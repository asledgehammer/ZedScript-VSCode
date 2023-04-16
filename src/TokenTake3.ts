import { ParseError } from './api/util/ParseError';

export type Token3Type =
    | 'white_space' // ' ', '\t', etc. (/\s/g)
    | 'new_line' // '\n'
    | 'scope_open' // '{'
    | 'scope_close' // '}'
    | 'property_terminator' // ','
    | 'delimiter_equals' // '='
    | 'delimiter_colon' // ':'
    | 'delimiter_semicolon' // ';'
    | 'delimiter_slash' // '/'
    | 'comment_block_open' // '/*'
    | 'comment_block_close' // '*/'
    | 'comment_block' //
    | 'comment_line_open' // '//'
    | 'comment_line' //
    | 'word' // /([a-z|A-Z|0-9|_|-]+)
    | 'unknown'; // ?

export type Token3Cursor = {
    row: number;
    col: number;
};

export type Token3Location = {
    start: Token3Cursor;
    stop: Token3Cursor;
};

export type Token3 = {
    loc: Token3Location | undefined;
    value: string;
    type: Token3Type;
};

export const CHAR_DICT: { [char: string]: Token3Type } = {
    '\n': 'new_line',
    '{': 'scope_open',
    '}': 'scope_close',
    ',': 'property_terminator',
    '=': 'delimiter_equals',
    ':': 'delimiter_colon',
    ';': 'delimiter_semicolon',
    '/': 'delimiter_slash',
};

export function tokenize3(raw: string): Token3[] {
    // Keeps returns consistent across encoding.
    raw = raw.replace(/\r/g, ''); //.replace('/\t/g', '    ');

    /** Flag to keep track of whitespace tokens. */
    let inWhiteSpace = false;
    let inComment = false;
    let inCommentType: 'line' | 'block' | undefined;

    const cursor: Token3Cursor = { row: 0, col: 0 };

    const tokens: Token3[] = [];
    let token: Token3 | undefined;

    function push() {
        /** Only push if a token is present. */
        if (token != null && token.value !== '') {
            
            if (token.type === 'unknown') {
                console.log({ token });
                throw new Error();
            }
            if (token.loc) {
                token.loc.stop = { ...cursor };
            }
            tokens.push(token);
        }

        token = {
            loc: undefined,
            // loc: { start: { ...cursor }, stop: { row: -1, col: -1 } },
            value: '',
            type: 'unknown',
        };
    }

    for (let i = 0; i < raw.length; i++) {
        const c = raw[i];
        const c1 = raw[i + 1];

        // Always check for new_lines first.
        if (c === '\n') {
            if (inComment) {
                // comment_blocks supports multi-line.
                if (inCommentType === 'block') {
                    token!.value += '\n';
                    continue;
                }
            }

            // Line-comments and words are done when a new_line is present.
            push();
            inCommentType = undefined;
            inComment = false;

            token!.type = 'new_line';
            token!.value = '\n';
            push();

            continue;
        }

        // Check for comments second. Comments ignores any conditional syntax beyond itself.
        if (inComment) {
            // In a comment block this signals the termination of the block.
            if (inCommentType === 'block') {
                if (c === '*' && c1 === '/') {
                    push();

                    token!.type = 'comment_block_close';
                    token!.value = '*/';
                    push();

                    // Skip over the next character to avoid redundancy and error in the next token.
                    i += 1;
                    inComment = false;
                    inCommentType = undefined;
                    continue;
                }
            }

            token!.value += c;
            continue;
        }

        if (c === '/') {
            if (c1 === '*') {
                // Push the previous token as it is now complete.
                push();

                // The comment_block_open token is always the same.
                token!.type = 'comment_block_open';
                token!.value = '/*';
                push();

                token!.type = 'comment_block';

                // Skip over the next character to avoid redundancy and error in the next token.
                i += 1;
                inCommentType = 'block';
                inComment = true;
                continue;
            } else if (c1 === '/') {
                // Push the previous token as it is now complete.
                push();

                // The comment_line_open token is always the same.
                token!.type = 'comment_line_open';
                token!.value = '//';
                push();

                token!.type = 'comment_line';

                // Skip over the next character to avoid redundancy and error in the next token.
                i += 1;
                inCommentType = 'line';
                inComment = true;
                continue;
            }
        }

        // If inside of a whitespace token.
        if (inWhiteSpace) {
            // Continue to add to the whitespace token.
            if (isWhiteSpaceCharacter(c)) {
                token!.type = 'white_space';
                token!.value += c;
                continue;
            }

            // Push the white_space token as it is now complete.
            push();
            // This is the end of the white_space token.
            inWhiteSpace = false;

            // Check if next character is a special character.
            if (isSpecialCharacter(c)) {
                // Apply the special character traits here.
                token!.type = CHAR_DICT[c];
                token!.value = c;

                // The special char token is complete.
                push();

                continue;
            }

            // The next character is part of a normal word token.
            token!.type = 'word';
            token!.value += c;

            continue;
        }

        // Entering a whitespace token.
        if (isWhiteSpaceCharacter(c)) {
            // Push the previous token as it is now complete.
            if (token!.type !== 'unknown') push();
            token!.type = 'white_space';
            token!.value = c;
            inWhiteSpace = true;
            continue;
        }

        // Check for special characters.
        else if (isSpecialCharacter(c)) {
            // Push the previous token as it is now complete.
            push();

            // Apply the special character traits here.
            token!.type = CHAR_DICT[c];
            token!.value = c;

            // The special char token is complete.
            push();

            continue;
        }

        if (token == null) push();
        // Is a word at this point.
        token!.type = 'word';
        token!.value += c;
    }

    return tokens;
}

function isWhiteSpaceCharacter(char: string): boolean {
    return /\s/g.exec(char)?.length === 1;
}

function isSpecialCharacter(char: string): boolean {
    return CHAR_DICT[char] !== undefined;
}

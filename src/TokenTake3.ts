import { Format3Options } from './FormatTake3';

export const FAKE_CURSOR = { row: -1, col: -1 };
export const FAKE_LOC = { start: FAKE_CURSOR, stop: FAKE_CURSOR };

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
    loc: Token3Location;
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

export function tokenize3(raw: string, options: Format3Options): Token3[] {
    // Keeps returns consistent across encoding.
    raw = raw.replace(/\r/g, '');//.replace('/\t/g', ' '.repeat(options.indentSize));

    function getCursor(index: number): Token3Cursor {
        let row = 1;
        let col = 1;
        for (let i = 0; i < Math.min(raw.length, index); i++) {
            const c = raw[i];
            if (c === '\n') {
                row++;
                col = 1;
            } else if (c === '\t') {
                col += options.indentSize;
            } else {
                col++;
            }
        }
        return { row, col };
    }

    /** Flag to keep track of whitespace tokens. */
    let inWhiteSpace = false;
    let inComment = false;
    let inCommentType: 'line' | 'block' | undefined;

    const tokens: Token3[] = [];
    let token: Token3 | undefined;

    function isValidToken() {
        return token != null && token.type !== 'unknown' && token.value !== '';
    }

    let i = 0;

    for (; i < raw.length; i++) {
        let c = raw[i];
        const c1 = raw[i + 1];

        if(c === '\t') c = ' '.repeat(options.indentSize);

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
            if (isValidToken()) {
                token!.loc.stop = getCursor(i);
                tokens.push(token!);
            }

            inWhiteSpace = false;
            inCommentType = undefined;
            inComment = false;

            token = {
                loc: { start: getCursor(i), stop: getCursor(i + 1) },
                type: 'new_line',
                value: '\n',
            };

            tokens.push(token);
            token = undefined;
            continue;
        }

        // Check for comments second. Comments ignores any conditional syntax beyond itself.
        if (inComment) {
            // In a comment block this signals the termination of the block.
            if (inCommentType === 'block') {
                if (c === '*' && c1 === '/') {
                    if (isValidToken()) {
                        token!.loc.stop = getCursor(i);
                        tokens.push(token!);
                    }

                    token = {
                        loc: { start: getCursor(i), stop: getCursor(i + 2) },
                        type: 'comment_block_close',
                        value: '*/',
                    };

                    tokens.push(token);
                    token = undefined;

                    // Skip over the next character to avoid redundancy and error in the next token.
                    i++;
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
                if (isValidToken()) {
                    token!.loc.stop = getCursor(i);
                    tokens.push(token!);
                }

                // The comment_block_open token is always the same.
                token = {
                    loc: { start: getCursor(i), stop: getCursor(i + 2) },
                    type: 'comment_block_open',
                    value: '/*',
                };

                tokens.push(token);

                token = {
                    loc: { start: getCursor(i + 2), stop: { row: -1, col: -1 } },
                    type: 'comment_block',
                    value: '',
                };

                // Skip over the next character to avoid redundancy and error in the next token.
                i++;
                inCommentType = 'block';
                inComment = true;
                continue;
            } else if (c1 === '/') {
                // Push the previous token as it is now complete.
                if (isValidToken()) {
                    token!.loc.stop = getCursor(i);
                    tokens.push(token!);
                }

                // The comment_line_open token is always the same.
                token = {
                    loc: { start: getCursor(i), stop: getCursor(i + 2) },
                    type: 'comment_line_open',
                    value: '//',
                };

                tokens.push(token);

                token = {
                    loc: { start: getCursor(i + 2), stop: { row: -1, col: -1 } },
                    type: 'comment_line',
                    value: '',
                };

                // Skip over the next character to avoid redundancy and error in the next token.
                i++;
                inCommentType = 'line';
                inComment = true;
                continue;
            }
        }

        // If inside of a whitespace token.
        if (inWhiteSpace) {
            // Continue to add to the whitespace token.
            if (isWhiteSpaceCharacter(c)) {
                if (token === undefined) {
                    token = {
                        loc: { start: getCursor(i), stop: { row: -1, col: -1 } },
                        type: 'white_space',
                        value: c,
                    };
                } else {
                    token!.type = 'white_space';
                    token!.value += c;
                }
                continue;
            }

            // Push the white_space token as it is now complete.
            if (isValidToken()) {
                token!.loc.stop = getCursor(i);
                tokens.push(token!);
            }

            token = undefined;

            // This is the end of the white_space token.
            inWhiteSpace = false;

            // Check if next character is a special character.
            if (isSpecialCharacter(c)) {
                // Apply the special character traits here.
                token = {
                    loc: { start: getCursor(i), stop: getCursor(i + 1) },
                    type: CHAR_DICT[c],
                    value: c,
                };

                tokens.push(token);
                token = undefined;
                continue;
            }
        }

        // Entering a whitespace token.
        else if (isWhiteSpaceCharacter(c)) {
            // (Sanity-Check)
            if (inWhiteSpace) throw new Error();

            // Push the previous token as it is now complete.
            if (isValidToken()) {
                token!.loc.stop = getCursor(i);
                tokens.push(token!);
            }

            token = {
                loc: { start: getCursor(i), stop: { row: -1, col: -1 } },
                type: 'white_space',
                value: c,
            };

            inWhiteSpace = true;
            continue;
        }

        // Check for special characters.
        else if (isSpecialCharacter(c)) {
            // Push the previous token as it is now complete.
            if (isValidToken()) {
                token!.loc.stop = getCursor(i);
                tokens.push(token!);
            }

            // Apply the special character traits here.
            token = {
                loc: { start: getCursor(i), stop: getCursor(i + 1) },
                type: CHAR_DICT[i],
                value: c,
            };

            // The special char token is complete.
            tokens.push(token);
            token = undefined;
            continue;
        }

        // Is a word at this point.
        if (token === undefined) {
            token = {
                loc: { start: getCursor(i), stop: { row: -1, col: -1 } },
                type: 'word',
                value: c,
            };
        } else {
            token.value += c;
        }
    }

    return tokens;
}

function isWhiteSpaceCharacter(char: string): boolean {
    return /\s/g.exec(char)?.length === 1;
}

function isSpecialCharacter(char: string): boolean {
    return CHAR_DICT[char] !== undefined;
}

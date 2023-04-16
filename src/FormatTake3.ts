import { Token3, Token3Type } from './TokenTake3';

export type Format3Options = {
    bracketStyle: 'inline' | 'allman';
    propertyCasing: 'camel_case' | 'pascal_case';
    indentSize: number;
};

export type Format3Metadata = {
    indent: number;
    index: number;
};

const DEFAULT_FORMAT3_OPTIONS: Format3Options = {
    bracketStyle: 'inline',
    propertyCasing: 'pascal_case',
    indentSize: 4,
};

function inject(tokens: Token3[], type: Token3Type, value: string) {
    tokens.push({
        type,
        value,
        loc: undefined,
    });
}

function isEmptyLine(tokens: Token3[], index: number): boolean {
    while (index < tokens.length) {
        const next = tokens[index++];
        if (next == null) return true;
        else if (next.type === 'white_space') continue;
        else if (next.type === 'new_line') return true;
        else return false;
    }
    return true;
}

function injectNewLine(tokens: Token3[]) {
    inject(tokens, 'new_line', '\n');
}

function injectCommentLine(tokens: Token3[], value: string) {
    inject(tokens, 'comment_line_open', '//');
    inject(tokens, 'comment_line', value);
    injectNewLine(tokens);
}

function formatIndent(options: Format3Options, tokens: Token3[], tokensNew: Token3[], meta: Format3Metadata): boolean {
    const t = tokens[meta.index];

    let spaceLength = options.indentSize * meta.indent;
    let spaces = ' '.repeat(spaceLength);

    if (t.type === 'scope_close') {
        spaceLength = options.indentSize * meta.indent;
        spaces = ' '.repeat(spaceLength);
        const tn1 = tokensNew[tokensNew.length - 1];
        if (tn1 != null && tn1.type === 'white_space' && tn1.value.length !== spaceLength) {
            tn1.value = spaces;
        }
    } else if (t.type === 'new_line') {
        // Make sure to add white_space after the new_line.
        tokensNew.push(t);

        // if (isEmptyLine(tokens, meta.index)) {
        //     return false;
        // }

        const t1 = tokens[meta.index + 1];

        // Checks for EOF.
        if (t1 == null) return false;

        // Something starts immediately on the next line.
        // (This is bad unless 'module' declaration line)
        if (t1.type !== 'white_space') {
            inject(tokensNew, 'white_space', spaces);
        } else {
            // Make sure that the white_space at the beginning of the line is the proper length.
            t1.value = spaces;
        }

        return false;
    } else if (t.type === 'white_space') {
        const tn1 = tokens[meta.index - 1];
        if (tn1.type === 'new_line') {
            t.value = spaces;
        }
    } 
    
    // Format all '=' properties to be like so: '[property] = [value]'
    else if (t.type === 'delimiter_equals') {
        const tn1 = tokens[meta.index - 1];

        if (tn1 != null) {
            if (tn1.type === 'white_space') tn1.value = ' ';
            else
                tokensNew.push({
                    loc: undefined,
                    type: 'white_space',
                    value: ' ',
                });
        }

        tokensNew.push(t);

        const t1 = tokens[meta.index + 1];
        if (t1 != null) {
            if (t1.type === 'white_space') t1.value = ' ';
            else
                tokensNew.push({
                    loc: undefined,
                    type: 'white_space',
                    value: ' ',
                });
        }

        return false;
    }
    // Format all ':' properties to be like so: '[property]: [value]'
    else if (t.type === 'delimiter_colon') {
        const tn1 = tokens[meta.index - 1];

        if (tn1 != null) {
            if (tn1.type === 'white_space') tokens.pop();
        }

        tokensNew.push(t);

        const t1 = tokens[meta.index + 1];
        if (t1 != null) {
            if (t1.type === 'white_space') t1.value = ' ';
            else
                tokensNew.push({
                    loc: undefined,
                    type: 'white_space',
                    value: ' ',
                });
        }

        return false;
    }

    // Format all ':' properties to be like so: '[item]; [item] ...'
    else if (t.type === 'delimiter_semicolon') {
        const tn1 = tokens[meta.index - 1];

        if (tn1 != null) {
            if (tn1.type === 'white_space') tokens.pop();
        }

        tokensNew.push(t);

        const t1 = tokens[meta.index + 1];
        if (t1 != null) {
            if (t1.type === 'white_space') t1.value = ' ';
            else
                tokensNew.push({
                    loc: undefined,
                    type: 'white_space',
                    value: ' ',
                });
        }

        return false;
    }

    // Format all '/' properties to be like so: '[item] / [item] ...'
    else if (t.type === 'delimiter_slash') {
        const tn1 = tokens[meta.index - 1];

        if (tn1 != null) {
            if (tn1.type === 'white_space') tn1.value = ' ';
            else
                tokensNew.push({
                    loc: undefined,
                    type: 'white_space',
                    value: ' ',
                });
        }

        tokensNew.push(t);

        const t1 = tokens[meta.index + 1];
        if (t1 != null) {
            if (t1.type === 'white_space') t1.value = ' ';
            else
                tokensNew.push({
                    loc: undefined,
                    type: 'white_space',
                    value: ' ',
                });
        }

        return false;
    }

    return true;
}

function formatScope(options: Format3Options, tokens: Token3[], tokensNew: Token3[], meta: Format3Metadata): boolean {
    const t = tokens[meta.index];
    let tn1 = tokens[meta.index + 1];

    if (t.type === 'scope_open') {
        // To let the formatter for indentions know we are deeper in the scope.
        meta.indent++;

        if (options.bracketStyle === 'allman') {
            if (!isFirstNonWhitespace(tokens, meta.index)) {
                injectNewLine(tokensNew);
            }
        } else {
            if (isFirstNonWhitespace(tokens, meta.index)) {
                removeNewLinePriorTo(tokensNew, tokensNew.length);
            }

            tn1 = tokens[tokens.length - 1];

            // If the last token is a new_line, fix it.
            if (tn1.type === 'new_line') {
                tokensNew.pop();
                tn1 = tokens[tokens.length - 1];
            }

            if (tn1 != null) {
                // Check to make sure that the white_space behind the scope_open isn't excessive.
                if (tn1.type === 'white_space') {
                    if (tn1.value !== ' ') {
                        tn1.value = ' ';
                    }
                } else {
                    tokensNew.push({
                        type: 'white_space',
                        value: ' ',
                        loc: undefined,
                    });
                }
            }
        }
    } else if (t.type === 'scope_close') {
        meta.indent--;
    }

    return true;
}

export function format3(tokens: Token3[], options: Partial<Format3Options>): string {
    // Insert default options to complete.
    const optionsAll: Format3Options = { ...DEFAULT_FORMAT3_OPTIONS, ...options };

    const tokensNew: Token3[] = [];

    // Non-Invasive loop

    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        // Convert tabs to spaces internally to better-manage the formatting process with white_spaces.
        t.value = t.value.replace(/\t/g, ' '.repeat(optionsAll.indentSize));
    }

    const meta = { indent: 0, index: 0 };

    // Invasive loop.
    for (; meta.index < tokens.length; meta.index++) {
        let add = true;
        if (!formatScope(optionsAll, tokens, tokensNew, meta)) add = false;
        if (!formatIndent(optionsAll, tokens, tokensNew, meta)) add = false;
        if (add) tokensNew.push(tokens[meta.index]);
    }

    return tokensNew
        .map((o: Token3) => {
            return o.value;
        })
        .join('');
}

function isFirstNonWhitespace(tokens: Token3[], index: number): boolean {
    if (tokens.length === 0 || index === 0) return true;

    while (index > 0) {
        const next = tokens[--index];
        if (next.type === 'new_line') return true;
        else if (next.type !== 'white_space') return false;
    }

    return true;
}

function removeNewLinePriorTo(tokens: Token3[], index: number) {
    if (tokens.length === 0 || index === 0) return;

    while (index > 0) {
        const next = tokens[--index];
        if (next.type === 'new_line') {
            tokens.splice(index, 1);
            return;
        }
    }
}

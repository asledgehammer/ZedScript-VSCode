import { Token3, Token3Type } from './TokenTake3';

const DEFAULT_FORMAT3_OPTIONS: Format3Options = {
    bracketStyle: 'inline',
    propertyCasing: 'pascal_case',
};

export type Format3Options = {
    bracketStyle: 'inline' | 'allman';
    propertyCasing: 'camel_case' | 'pascal_case';
};

export type Format3Metadata = {
    indent: number;
};

function inject(tokens: Token3[], type: Token3Type, value: string) {
    tokens.push({
        type,
        value,
        loc: undefined,
    });
}

function injectNewLine(tokens: Token3[]) {
    inject(tokens, 'new_line', '\n');
}

function injectCommentLine(tokens: Token3[], value: string) {
    inject(tokens, 'comment_line_open', '//');
    inject(tokens, 'comment_line', value);
    injectNewLine(tokens);
}

function formatScope(
    options: Format3Options,
    tokens: Token3[],
    tokensNew: Token3[],
    index: number,
    meta: Format3Metadata
): void {
    const t = tokens[index];
    let tn1 = tokens[index + 1];

    if (t.type === 'scope_open') {
        if (options.bracketStyle === 'allman') {
            if (!isFirstNonWhitespace(tokens, index)) {
                injectNewLine(tokensNew);
            }
        } else {
            if (isFirstNonWhitespace(tokens, index)) {
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
    }
}

export function format3(tokens: Token3[], options: Partial<Format3Options>): string {
    // Insert default options to complete.
    const optionsAll: Format3Options = { ...DEFAULT_FORMAT3_OPTIONS, ...options };

    const tokensNew: Token3[] = [];

    // Non-Invasive loop

    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
    }

    const meta = { indent: 0 };

    // Invasive loop.
    for (let i = 0; i < tokens.length; i++) {
        formatScope(optionsAll, tokens, tokensNew, i, meta);
        tokensNew.push(tokens[i]);
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

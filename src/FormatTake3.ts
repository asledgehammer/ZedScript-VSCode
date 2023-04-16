import { Token3, Token3Type } from './TokenTake3';

const DEFAULT_FORMAT3_OPTIONS: Format3Options = {
    bracketStyle: 'inline',
    propertyCasing: 'pascal_case',
};

export type Format3Options = {
    bracketStyle: 'inline' | 'allman';
    propertyCasing: 'camel_case' | 'pascal_case';
};

export function format3(tokens: Token3[], options: Partial<Format3Options>): string {
    // Insert default options to complete.
    const allOptions: Format3Options = { ...DEFAULT_FORMAT3_OPTIONS, ...options };

    const tokensNew: Token3[] = [];

    function inject(type: Token3Type, value: string) {
        tokensNew.push({
            type,
            value,
            loc: undefined,
        });
    }

    function injectNewLine() {
        inject('new_line', '\n');
    }

    function injectCommentLine(value: string) {
        inject('comment_line_open', '//');
        inject('comment_line', value);
        injectNewLine();
    }

    // Debug test
    injectCommentLine('test test2 test3');

    for (const token of tokens) {
        tokensNew.push(token);
    }

    return tokensNew
        .map((o: Token3) => {
            return o.value;
        })
        .join('');
}

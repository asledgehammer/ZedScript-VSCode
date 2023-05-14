import { Token } from '../token/Token';
import { LintResults } from './LintResults';
import { LintTest } from './LintTest';

export function lint(tokens: Token[]): LintResults {
    return new LintTest().test(tokens);
}

export function stripComments(tokens: Token[]): Token[] {
    return tokens
        .filter((o) => {
            // Remove all comment tokens. These do not affect the linting process.
            return (
                o.type !== 'comment_block_open' &&
                o.type !== 'comment_block_close' &&
                o.type !== 'comment_block' &&
                o.type !== 'comment_line_open' &&
                o.type !== 'comment_line'
            );
        })
        .map((o) => {
            // Clone the tokens to not poison the original tokens passed.
            return { ...o };
        });
}

export function stripWhiteSpace(tokens: Token[]): Token[] {
    return tokens
        .filter((o) => {
            // Remove all whitespace and new_lines to keep pattern checks clean.
            return o.type !== 'white_space' && o.type !== 'new_line';
        })
        .map((o) => {
            // Clone the tokens to not poison the original tokens passed.
            return { ...o };
        });
}

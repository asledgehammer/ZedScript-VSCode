import { Token3, Token3Location } from './TokenTake3';

/*
 * SCOPE RULES:
 *
 * ## Scopes
 *   - `scope=number`: Can only be in the number scope. `(0 === root)`
 *   - `scope>number`: Can only be above the number.
 *   - `scope<number`: Can only be below the number.
 *   - `scope>=number`: Can only be the number or above the number.
 *   - `scope<=number`: Can only be the number or below the number.
 *   - `scope_open` The token must be `{`.
 *   - `scope_close`: The token must be `}`.
 *
 * ## Words
 *   - `word`: A word token must be present.
 *   - `words`: Any number of word tokens must be present.
 *   - `word:value`: A word with the value must be present.
 *
 * ## Special Characters
 *   - `property_terminator`: The token must be `,`.
 *
 * ## Misc
 *   - `*`: Can contain any number of token-sequences.
 */

export type Lint3Log = {
    type: 'info' | 'warning' | 'error';
    message: string;
    location: Token3Location;
};

export type Lint3Results = {
    pass: boolean;
    logs: Lint3Log[];
};

const WORD_RULES: { [word: string]: string[] } = {
    /** module word[1] { ... } */
    module: ['scope:0', 'word', 'scope_open', '*', 'scope_close'],
};

export function lint3(tokens: Token3[]): Lint3Results {
    tokens = tokens
        .filter((o) => {
            // Remove all whitespace and new_lines to keep pattern checks clean.
            // Remove all comment tokens. These do not affect the linting process.
            return (
                o.type !== 'white_space' &&
                o.type !== 'new_line' &&
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

    const logs: Lint3Log[] = [];

    function error(location: Token3Location, message: string) {
        logs.push({ type: 'error', location, message });
    }

    function warning(location: Token3Location, message: string) {
        logs.push({ type: 'warning', location, message });
    }

    function info(location: Token3Location, message: string) {
        logs.push({ type: 'info', location, message });
    }

    function expectWord(token: Token3) {
        error(token.loc, `Illegal token: '${token.value}' (Expected word)`);
    }

    function expectWords(token: Token3) {
        error(token.loc, `Illegal token: '${token.value}' (Expected word)`);
    }
    function expectValue(token: Token3, value: string) {
        error(token.loc, `Illegal token: '${token.value}' (Expected '${value}')`);
    }

    // function expectScopeOpen(token: Token3) {
    //     error(token.loc, `Illegal token: '${token.value}' (Expected '{')`);
    // }

    // function expectScopeClose(token: Token3) {
    //     error(token.loc, `Illegal token: '${token.value}' (Expected '}')`);
    // }

    /**
     * The offset of the current token to lint.
     */
    let i = 0;

    /**
     * The current token to lint.
     */
    let t: Token3;

    /**
     * The token following the current token to lint.
     */
    let t1: Token3;

    /**
     * @param offset (Default: 1) The offset to shift for the token to lint.
     */
    function shift(offset = 1) {
        i += offset;
        t = tokens[i];
        t1 = tokens[i + 1];
    }

    /**
     * (Alias to keep code legible by humans)
     *
     * Alias to `shift()`. (Or `shift(1)`)
     */
    function next() {
        shift();
    }

    /**
     * Keeps track of how many scopes are nested where the current token is.
     */
    let scopeIndent = 0;

    /**
     * @param index The tokens-index to check.
     * @returns True if the index is at or greater than the length of the tokens to lint.
     */
    function isEOT(index: number = i): boolean {
        return index >= tokens.length;
    }

    /**
     * Scans into the next non-word token. (Useful for multi-word token sequences)
     *
     * **NOTE**: If the current token is not a 'word', then nothing will happen.
     */
    function skipWords() {
        if (t.type !== 'word') return;

        while (!isEOT() && t.type === 'word') next();
    }

    /**
     * Recursively scans through all tokens, checking their rules and seeing if these rules are followed.
     *
     * @returns True if the rules are followed in the level of recursion. If false, then the linter pass has failed and
     * no further checks are needed. When failure occurs, this should fall back to the entry level of recursion.
     */
    function scanInto() {
        if (t.type === 'word') {
            const rules = WORD_RULES[t.value.toLowerCase()];
            if (rules == null) return;

            for (const rule of rules) {
                // Grab our next token by shifting 1 index.
                t = tokens[i++];
                t1 = tokens[i + 1];

                switch (rule) {
                    case 'word': {
                        // Check to make sure that the next token is a word.
                        if (t.type !== 'word') expectWord(t);

                        break;
                    }

                    // RULE: A series of 1 or more word tokens. (Recipe names, String property values, Vector3, etc.)
                    case 'words': {
                        // Check to make sure that the next token is a word.
                        if (t.type !== 'word') expectWords(t);

                        // Skip until our next token is a non-word token.
                        skipWords();

                        // This is applied so that the next token is the non-word token when handled by the next rule.
                        shift(-1);
                        break;
                    }
                    case 'scope_open': {
                        if (t.type !== 'scope_open') expectValue(t, '{');
                        scopeIndent++;
                        break;
                    }
                    case 'scope_close': {
                        if (t.type !== 'scope_close') expectValue(t, '}');
                        scopeIndent++;
                        break;
                    }
                    case '*': {
                        // TODO: Scan recursively.
                        break;
                    }
                    default: {
                        // `word:value` rule:
                        if (rule.startsWith('word:')) {
                            const ruleValue = rule.split(':')[1].toLowerCase().trim();
                            if (t.value.toLowerCase().trim() !== ruleValue) {
                                expectValue(t, ruleValue);
                            }
                        }
                    }
                }
            }
        }

        // Any rules not known should always break the linter.
        return false;
    }

    // (Sets the initial token to lint)
    shift(0);

    // Use a while loop here. This is because multiple modules can be defined in one file. If we reach and terminate our
    // recursive scan for the first module, then we end up in the loop to continue until we have reached the end of our
    // tokens.
    while (!isEOT()) scanInto();

    // The only way that the linter can pass is if ZERO logs are assigned the type 'error'.
    const pass =
        logs.length === 0 ||
        logs.filter((o) => {
            return o.type === 'error';
        }).length === 0;

    return { pass, logs };
}

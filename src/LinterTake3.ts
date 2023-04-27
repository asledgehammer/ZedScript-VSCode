import { Token3, Token3Location } from './TokenTake3';

const DEBUG = true;

export type Lint3Log = {
    type: 'info' | 'warning' | 'error';
    message: string;
    location: Token3Location;
};

export type Lint3Results = {
    pass: boolean;
    logs: Lint3Log[];
};

const PROPERTY_EQUALS_RULE = [
    'word', // Property name.
    'delimiter_equals', // '='
    'property_value', // Anything.
    'property_terminator', // ','
];

const PROPERTY_COLON_RULE = [
    'word', // Property name.
    'delimiter_colon', // ':'
    'property_value', // Anything.
    'property_terminator', // ','
];

const SCOPE_RULES: { [word: string]: string[] } = {
    module: ['scope;root', 'title;word', 'body;category'],

    /** ANIMATION **************************************************** */
    animation: ['scope;root.module', 'title;word', 'body;='],
    copyframe: ['scope;root.module.animation', 'body;='],
    copyframes: ['scope;root.module.animation', 'body;='],
};

export function stripWhiteSpace(tokens: Token3[]): Token3[] {
    return tokens
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
}

export function lint3(tokens: Token3[]): Lint3Results {
    const EOFToken = tokens[tokens.length - 1];
    const EOFLocation = { start: EOFToken.loc.stop, stop: { ...EOFToken.loc.stop, col: EOFToken.loc.stop.col + 1 } };

    tokens = stripWhiteSpace(tokens);

    const logs: Lint3Log[] = [];
    const scope: string[] = ['root'];
    const scopeToTrace: string[] = ['root'];

    function error(location: Token3Location, message: string) {
        if (DEBUG) throw new Error(`[${location.start.row}:${location.start.col}]: ${message}`);
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

    function expectScope(token: Token3, value: string) {
        error(
            token.loc,
            `Unexpected token: '${token.value}'. (Improper scope: ${scopeToTrace.join('.')}; Expected scope: ${value})`
        );
    }

    function errorEOT() {
        const start = { ...tokens[tokens.length - 1].loc.stop };
        const stop = { ...start };
        error({ start, stop }, 'Unexpected EOF.');
    }

    /**
     * The offset of the current token to lint.
     */
    let i = 0;

    /**
     * @param index The tokens-index to check.
     * @returns True if the index is at or greater than the length of the tokens to lint.
     */
    function isEOT(index: number = i): boolean {
        return index >= tokens.length;
    }

    /**
     * Scans into the next token with the type.
     *
     * **NOTE**: If the current token-type EQUALS the type, then nothing will happen.
     */
    function skipUntil(type: string[] | string) {
        if (typeof type === 'string') type = [type];

        let token = tokens[i];
        if (type.indexOf(token.type) !== -1) return;

        while (!isEOT() && type.indexOf(token.type) === -1) {
            token = tokens[++i];
        }
    }

    function intoProperty(key: string, value: Token3[]): number {
        const valString = value
            .map((o) => {
                return o.value;
            })
            .join(' ');
        console.log(`Property Detected: key=${key} value=${valString}`);
        return 0;
    }

    function intoScope(value: string, rules: string[]): number {
        if (DEBUG) console.log(`intoScope(${value})`);
        let hasTitle = false;
        let titleType: 'word' | 'words' = 'word';
        let keyValDelimiter: '=' | ':' = '=';
        let scopeRequired: string | null = null;

        for (let rule of rules) {
            rule = rule.toLowerCase();
            if (rule.indexOf('body;') === 0) {
                keyValDelimiter = rule.split(';')[1] as '=' | ':';
            } else if (rule.indexOf('title;') === 0) {
                hasTitle = true;
                titleType = rule.split(';')[1] as 'word' | 'words';
            } else if (rule.indexOf('scope;') === 0) {
                scopeRequired = rule.split(';')[1];
            }
        }

        if (scopeRequired !== null) {
            if (scope.join('.') !== scopeRequired) {
                // We need to interpret this return as non-fatal.
                return 1;
            }
        }

        scope.push(value);

        let token = tokens[++i];
        let title = '';

        if (hasTitle) {
            // Both title types requires at least one word token.
            if (token.type !== 'word') {
                expectWord(token);
                scope.pop();
                scopeToTrace.pop();
                return -1;
            } else if (titleType === 'words') {
                title = token.value;
                // Skip word tokens.
                while (token.type === 'word') {
                    token = tokens[++i];
                    title += ` ${token.value}`;
                }

                // A 'scope_open' MUST follow the word tokens for the scope's title.
                if (token.type !== 'scope_open') {
                    expectValue(token, '{');
                    scope.pop();
                    scopeToTrace.pop();
                    return -1;
                }
            } else {
                title = token.value;
                token = tokens[++i];

                // A 'scope_open' MUST follow the word tokens for the scope's title.
                if (token.type !== 'scope_open') {
                    expectValue(token, '{');
                    scope.pop();
                    scopeToTrace.pop();
                    return -1;
                }
            }
            scopeToTrace.push(`${value}[${title}]`);
        } else {
            scopeToTrace.push(`${value}`);
            // A 'scope_open' MUST follow the word tokens for the scope's title.
            if (token.type !== 'scope_open') {
                expectValue(token, '{');
                scope.pop();
                scopeToTrace.pop();
                return -1;
            }
        }

        // This keeps track of untracked scopes so that we don't prematurely terminate the scope tested.
        let scopeIndent = 0;

        // This lets us know whether the scope closes properly. If it doesn't then the test fails.
        let closedProperly = false;

        let shouldBreak = false;

        // Process the body here.
        while (!isEOT() && !shouldBreak) {
            token = tokens[++i];

            // EOT
            if (token === undefined) break;

            const value = token.value.toLowerCase();
            if (token.type === 'word' && SCOPE_RULES[value] !== undefined) {
                // If there are rules for this word.
                const result = intoScope(value, SCOPE_RULES[value]);

                // Cascade catastrophic failures.
                if (result === -1) return -1;
                // Nominal result. Move on.
                else if (result === 0) continue;
                // If result is 1, it means there was a false-match and should be treated as a property key->value.
            } else if (token.type === 'scope_open') {
                scopeIndent++;
                continue;
            } else if (token.type === 'scope_close') {
                if (scopeIndent === 0) {
                    closedProperly = true;
                    break;
                }
                scopeIndent--;
            }
            // At this point we need to interpret as "key -> value,"
            else {
                token = tokens[i];

                const erroneousTokens = [];
                // Scan into the next word. (skips over erroneous tokens)
                while (!isEOT() && token.type !== 'scope_close') {
                    if (token.type === 'word') {
                        const tokenDelimiter = tokens[i + 1];

                        // (Sanity Check)
                        if (tokenDelimiter === undefined) {
                            errorEOT();
                            scope.pop();
                            scopeToTrace.pop();
                            return -1;
                        }

                        // Make sure that the 'key -> value' delimiter matches the scope rule.
                        if (keyValDelimiter === ':' && tokenDelimiter.type === 'delimiter_equals') {
                            expectValue(tokenDelimiter, '=');
                        } else if (keyValDelimiter === '=' && tokenDelimiter.type === 'delimiter_colon') {
                            expectValue(tokenDelimiter, ':');
                        }

                        const valueTokens = [];
                        let offset = 2;
                        let tokenNext = tokens[i + offset];

                        while (
                            tokenNext !== undefined &&
                            tokenNext.type !== 'property_terminator' &&
                            tokenNext.type !== 'scope_close'
                        ) {
                            valueTokens.push(tokenNext);
                            offset++;
                            tokenNext = tokens[i + offset];
                        }

                        // (Sanity Check)
                        if (tokenNext === undefined || isEOT()) {
                            errorEOT();
                            scope.pop();
                            scopeToTrace.pop();
                            return -1;
                        }

                        if (intoProperty(token.value, valueTokens) === -1) return -1;

                        // Since we have a valid property, catch up the index value.
                        i += offset + 1;
                        token = tokens[i];

                        if (tokenNext.type === 'scope_close') {
                            closedProperly = true;
                            shouldBreak = true;
                            break;
                        }
                    }
                }

                // (Sanity Check)
                if (isEOT()) {
                    errorEOT();
                    scope.pop();
                    scopeToTrace.pop();
                    return -1;
                }

                if(token.type === 'scope_close') {
                    closedProperly = true;
                    break;
                }

                // console.log(`Skipping over token: '${token.type}:${token.value}`);
            }
        }

        // Make sure that the scope is closed properly. If one is missing, then the test has failed.
        if (!closedProperly) {
            error(EOFLocation, `The scope '${scopeToTrace.join('.')}' is missing a '}'.`);
            return -1;
        }

        if (DEBUG) console.log(`outOfScope(${value})`);
        scope.pop();
        scopeToTrace.pop();
        return 0;
    }

    // Use a while loop here. This is because multiple modules can be defined in one file. If we reach and terminate our
    // recursive scan for the first module, then we end up in the loop to continue until we have reached the end of our
    // tokens.

    do {
        const token = tokens[i];
        const value = token.value.toLowerCase();

        if (SCOPE_RULES[value] !== undefined) {
            if (!intoScope(value, SCOPE_RULES[value])) break;
        } else {
            i++;
        }
    } while (!isEOT());

    // The only way that the linter can pass is if ZERO logs are assigned the type 'error'.
    const pass =
        logs.length === 0 ||
        logs.filter((o) => {
            return o.type === 'error';
        }).length === 0;

    const result = { pass, logs };

    return result;
}

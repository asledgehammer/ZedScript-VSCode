import { Token3, Token3Location } from './TokenTake3';

const CATASTROPHIC_ERROR = -1;

const DEBUG = true;

export type Lint3Log = {
    type: 'info' | 'warning' | 'error';
    location: Token3Location;
    scope: string;
    message: string;
};

export type Lint3Results = {
    pass: boolean;
    logs: Lint3Log[];
};

export type Lint3ScopeRules = {
    scope?: string;
    title?: 'word' | 'words';
    body?: '=' | ':';
};

export type Lint3PropertyType = 'string' | 'int' | 'float' | 'boolean';

export type Lint3PropertyRules = {
    scope: string;
    type: Lint3PropertyType;
};

const SCOPE_RULES: { [word: string]: Lint3ScopeRules[] } = {
    module: [{ scope: 'root', title: 'word' }],

    /** ANIMATION **************************************************** */
    animation: [{ scope: 'root.module', title: 'word', body: '=' }],
    copyframe: [{ scope: 'root.module.animation', body: '=' }],
    copyframes: [{ scope: 'root.module.animation', body: '=' }],
};

const PROP_RULES: { [word: string]: Lint3PropertyRules[] } = {
    // root.module.animation.copyframe
    frame: [{ scope: 'root.module.animation.copyframe', type: 'int' }],
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
        logs.push({ scope: scopeToTrace.join('.'), type: 'error', location, message });
    }

    function warning(location: Token3Location, message: string) {
        logs.push({ scope: scopeToTrace.join('.'), type: 'warning', location, message });
    }

    function info(location: Token3Location, message: string) {
        logs.push({ scope: scopeToTrace.join('.'), type: 'info', location, message });
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

    /**
     * Checks if a property is a scope. If so, the scope is scanned over.
     *
     * @param loc The location of the property token.
     * @param value The name of the property.
     * @returns {number} -1 if catastrophic error, 0 if false, 1 if true.
     */
    function scanOverIfUnknownScope(loc: Token3Location, value: string): number {
        // Check to see if a 'scope_open' token follows prior to a 'scope_close' token. If so, this means that
        // this is a scope but isn't one that we know about. In this situation, we simply scan past it and move
        // on.

        let testToken;
        let testIndex = i + 1;
        let testScopeIndent = 0;
        let hasScope = false;

        while (!isEOT()) {
            testToken = tokens[testIndex++];
            if (testToken === undefined) {
                if (hasScope) {
                    error(loc, `Expected '}' for closing scope: ${value}`);
                } else {
                    errorEOT();
                }
                return CATASTROPHIC_ERROR;
            }

            // This is confirmed to be a property.
            if ((!hasScope && testToken.type === 'delimiter_equals') || testToken.type === 'delimiter_colon') {
                break;
            }

            if (testToken.type === 'scope_open') {
                testScopeIndent++;
                hasScope = true;
                continue;
            } else if (testToken.type === 'scope_close') {
                if (testScopeIndent === 0) {
                    break;
                }
                testScopeIndent--;
            }
        }

        // We confirmed that the item is a scope.
        if (hasScope) {
            console.log('Confirmed hasScope. Left at: ');
            i = testIndex - 1;
            console.log(tokens[i]);
            return 1;
        }

        return 0;
    }

    function intoProperty(loc: Token3Location, key: string, value: Token3[]): number {
        const rulesAll = PROP_RULES[key];
        console.log({ key, rulesAll });
        let rules: Lint3PropertyRules | null = null;

        if (rulesAll !== undefined) {
            for (const rulesNext of rulesAll) {
                if (rulesNext.scope === scope.join('.')) {
                    rules = rulesNext;
                    break;
                }
            }
        }

        // No rules found or satisfied the scope requirement for the key->value pair.
        if (rules == null) {
            // Check to see if the unknown property is a scope.
            const scopeCheck = scanOverIfUnknownScope(loc, key);

            // Cascade catastrophic failure.
            if (scopeCheck === CATASTROPHIC_ERROR) return CATASTROPHIC_ERROR;

            if (scopeCheck === 1) {
                warning(loc, `Unknown scope: ${key}`);
                if (DEBUG) console.log(`[${scopeToTrace.join('.')}] :: Unknown Scope Detected: ${key}`);
            } else {
                warning(loc, `Unknown property: ${key}`);
                if (DEBUG) console.log(`[${scopeToTrace.join('.')}] :: Unknown Property Detected: ${key}`);
            }
            return 1;
        }

        const valString = value
            .map((o) => {
                return o.value;
            })
            .join(' ');
        console.log(`Property Detected: key=${key} value=${valString}`);
        return 0;
    }

    function intoScope(value: string, rules: Lint3ScopeRules): number {
        if (DEBUG) console.log(`intoScope(${value})`);
        let hasTitle = false;
        let titleType: 'word' | 'words' = 'word';
        let keyValDelimiter: '=' | ':' = '=';
        let scopeRequired: string | null = null;

        if (rules.body != null) {
            keyValDelimiter = rules.body!;
        }
        if (rules.title != null) {
            hasTitle = true;
            titleType = rules.title!;
        }

        // If scope is defined, check to see if this ruleset requirement is met.
        if (rules.scope) {
            scopeRequired = rules.scope!;
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
                return CATASTROPHIC_ERROR;
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
                    return CATASTROPHIC_ERROR;
                }
            } else {
                title = token.value;
                token = tokens[++i];

                // A 'scope_open' MUST follow the word tokens for the scope's title.
                if (token.type !== 'scope_open') {
                    expectValue(token, '{');
                    scope.pop();
                    scopeToTrace.pop();
                    return CATASTROPHIC_ERROR;
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
                return CATASTROPHIC_ERROR;
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
                // TODO: Check all variants.
                const result = intoScope(value, SCOPE_RULES[value][0]);

                // Cascade catastrophic failures.
                if (result === CATASTROPHIC_ERROR) return CATASTROPHIC_ERROR;
                // Nominal result. Move on.
                else if (result === 0) continue;

                // If result is 1, it means there was a false-match and could be a property key->value.
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

                const errorTokens = [];

                // Scan into the next word. (skips over erroneous tokens)
                while (!isEOT() && token.type !== 'scope_close') {
                    while (!isEOT() && token.type !== 'word') {
                        errorTokens.push(token);
                        token = tokens[++i];

                        // EOT
                        if (token === undefined) break;

                        if (token.type === 'scope_open') {
                            scopeIndent++;
                            continue;
                        } else if (token.type === 'scope_close') {
                            if (scopeIndent === 0) {
                                closedProperly = true;
                                shouldBreak = true;
                                break;
                            }
                            scopeIndent--;
                        }
                    }

                    // (Sanity Check)
                    if (isEOT()) {
                        errorEOT();
                        scope.pop();
                        scopeToTrace.pop();
                        return CATASTROPHIC_ERROR;
                    }

                    // Catch for closure of scope with erroneous tokens.
                    if (shouldBreak) break;

                    if (token.type === 'word') {
                        const tokenDelimiter = tokens[i + 1];

                        // (Sanity Check)
                        if (tokenDelimiter === undefined) {
                            errorEOT();
                            scope.pop();
                            scopeToTrace.pop();
                            return CATASTROPHIC_ERROR;
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
                            return CATASTROPHIC_ERROR;
                        }

                        const result = intoProperty(token.loc, token.value, valueTokens);
                        if (result === CATASTROPHIC_ERROR) return CATASTROPHIC_ERROR;

                        // If an unknown scope is detected, we check for closure here.
                        if (tokens[i].type === 'scope_close') {
                            closedProperly = true;
                            shouldBreak = true;
                            break;
                        }

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

                // Process erroneous tokens. (If any)
                if (errorTokens.length !== 0) {
                    for (const errorToken of errorTokens) {
                        error(errorToken.loc, `Unknown token: ${errorToken.value}`);
                    }
                }

                // (Sanity Check)
                if (isEOT()) {
                    errorEOT();
                    scope.pop();
                    scopeToTrace.pop();
                    return CATASTROPHIC_ERROR;
                }

                if (token.type === 'scope_close') {
                    closedProperly = true;
                    break;
                }

                // console.log(`Skipping over token: '${token.type}:${token.value}`);
            }
        }

        // Make sure that the scope is closed properly. If one is missing, then the test has failed.
        if (!closedProperly) {
            error(EOFLocation, `The scope '${scopeToTrace.join('.')}' is missing a '}'.`);
            return CATASTROPHIC_ERROR;
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
            // TODO: Check all variants.
            if (!intoScope(value, SCOPE_RULES[value][0])) break;
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

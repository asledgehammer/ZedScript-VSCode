import { Token } from '../token/Token';
import { TokenLocation } from '../token/TokenLocation';
import { LintLog } from './LintLog';
import { LintPropertyRules } from './LintPropertyRules';
import { LintResults } from './LintResults';
import { LintScopeRules } from './LintScopeRules';

const DEBUG = true;
const CATASTROPHIC_ERROR = -1;
const SUCCESS = 0;
const ANOMALOUS = 1;

const SCOPE_RULES: { [word: string]: LintScopeRules[] } = {
    module: [{ scope: 'root', title: 'word' }],

    /** ANIMATION **************************************************** */
    animation: [{ scope: 'root.module', title: 'word', body: '=' }],
    copyframe: [{ scope: 'root.module.animation', body: '=' }],
    copyframes: [{ scope: 'root.module.animation', body: '=' }],
};

const PROP_RULES: { [word: string]: LintPropertyRules[] } = {
    frame: [
        { scope: 'root.module.animation.copyframe', type: 'int' },
        { scope: 'root.module.animation.copyframes', type: 'int' },
    ],
    source: [
        { scope: 'root.module.animation.copyframe', type: 'string' },
        { scope: 'root.module.animation.copyframes', type: 'string' },
    ],
    sourceFrame: [{ scope: 'root.module.animation.copyframe', type: 'int' }],
    sourceFrame1: [{ scope: 'root.module.animation.copyframes', type: 'int' }],
    sourceFrame2: [{ scope: 'root.module.animation.copyframes', type: 'int' }],
};

export function stripWhiteSpace(tokens: Token[]): Token[] {
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

export function lint3(tokens: Token[]): LintResults {
    const EOFToken = tokens[tokens.length - 1];
    const EOFLocation = { start: EOFToken.loc.stop, stop: { ...EOFToken.loc.stop, col: EOFToken.loc.stop.col + 1 } };

    tokens = stripWhiteSpace(tokens);

    const logs: LintLog[] = [];
    const scope: string[] = ['root'];
    const scopeToTrace: string[] = ['root'];

    function error(location: TokenLocation, message: string) {
        // if (DEBUG) throw new Error(`[${location.start.row}:${location.start.col}]: ${message}`);
        logs.push({ scope: scopeToTrace.join('.'), type: 'error', location, message });
    }

    function warning(location: TokenLocation, message: string) {
        logs.push({ scope: scopeToTrace.join('.'), type: 'warning', location, message });
    }

    function info(location: TokenLocation, message: string) {
        logs.push({ scope: scopeToTrace.join('.'), type: 'info', location, message });
    }

    function expectWord(token: Token) {
        error(token.loc, `Illegal token: '${token.value}' (Expected word)`);
    }

    function expectWords(token: Token) {
        error(token.loc, `Illegal token: '${token.value}' (Expected word)`);
    }

    function expectValue(token: Token, value: string) {
        error(token.loc, `Illegal token: '${token.value}' (Expected '${value}')`);
    }

    function expectScope(token: Token, value: string) {
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
    function scanOverIfUnknownScope(loc: TokenLocation, value: string): number {
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
                if (testScopeIndent === 0) break;
                testScopeIndent--;
            }
        }

        // We confirmed that the item is a scope.
        if (hasScope) {
            if (DEBUG) console.log('Confirmed hasScope.');
            i = testIndex - 1;
            return 1;
        }

        return 0;
    }

    function intoProperty(loc: TokenLocation, key: string, value: Token[]): number {
        const rulesAll = PROP_RULES[key];
        if (DEBUG) console.log({ key, rulesAll });
        let rules: LintPropertyRules | null = null;

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

                // We've already scanned over the scope.
                return 1;
            } else {
                warning(loc, `Unknown property: ${key}`);
                if (DEBUG) console.log(`[${scopeToTrace.join('.')}] :: Unknown Property Detected: ${key}`);
            }

            return ANOMALOUS;
        }

        const valString = value
            .map((o) => {
                return o.value;
            })
            .join(' ');
        if (DEBUG) console.log(`Property Detected: key=${key} value=${valString}`);
        return 0;
    }

    function intoScope(value: string, rules: LintScopeRules): number {
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
                return SUCCESS;
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

        // Process the body-content of the scope in this loop. The loop should only break during EOF or scope_closure.
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
                else if (result === SUCCESS) continue;

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
                continue;
            }
            // At this point we need to interpret as "key -> value,"
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

                    // Make sure that there's only one 'word' and 'delimiter'.
                    if (tokenDelimiter.type !== 'delimiter_colon' && tokenDelimiter.type !== 'delimiter_equals') {
                        error(
                            tokenDelimiter.loc,
                            `Unexpected token: ${tokenDelimiter.value} (Expected '${keyValDelimiter}')`
                        );
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

                    // If an unknown scope is detected, we check for closure here before going on to the next token.
                    if (tokens[i].type === 'scope_close') {
                        closedProperly = true;
                        shouldBreak = true;
                        break;
                    }

                    // Since we have a valid property, catch up the index value.
                    i += offset + 1;
                    token = tokens[i];

                    // Check if the next token is a closure.
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

            if (DEBUG) console.log(`Skipping over token: '${token.type}:${token.value}`);
        }

        // Make sure that the scope is closed properly. If one is missing, then the test has failed.
        if (!closedProperly) {
            error(EOFLocation, `The scope '${scopeToTrace.join('.')}' is missing a '}'.`);
            return CATASTROPHIC_ERROR;
        }

        if (DEBUG) console.log(`outOfScope(${value})`);
        scope.pop();
        scopeToTrace.pop();
        return SUCCESS;
    }

    // Use a while loop here. This is because multiple modules can be defined in one file. If we reach and terminate our
    // recursive scan for the first module, then we end up in the loop to continue until we have reached the end of our
    // tokens.

    do {
        const token = tokens[i];
        const value = token.value.toLowerCase();

        if (SCOPE_RULES[value] !== undefined) {
            // TODO: Check all variants.
            if (intoScope(value, SCOPE_RULES[value][0]) === CATASTROPHIC_ERROR) break;
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
    console.log(result);
    return result;
}

import { Token3, Token3Location } from './TokenTake3';

const DEBUG = true;

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
    /** module word[1] { ... } */
    module: ['scope:root', 'word', 'scope_open', '*', 'scope_close'],

    /** ANIMATION **************************************************** */
    animation: ['scope:root.module', 'word', 'scope_open', '*=', 'scope_close'],
    copyframe: ['scope:root.module.animation', 'scope_open', '*=', 'scope_close'],
    copyframes: ['scope:root.module.animation', 'scope_open', '*=', 'scope_close'],
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

    const scope: string[] = ['root'];

    function stepIntoScope(name: string) {
        scope.push(name);
        scopeIndent++;
        if (DEBUG) console.log(`Stepping into scope: ${scope.join('.')} ..`);
    }

    function stepOutOfScope() {
        if (scope.length !== 0) {
            scopeIndent--;
            const popped = scope.pop();

            if (DEBUG) {
                if (scope.length === 0) {
                    console.log(`Stepping out of scope: ${popped} ..`);
                } else {
                    console.log(`Stepping out of scope: ${scope.join('.')}.${popped} ..`);
                }
            }
        }
    }

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
            `Unexpected token: '${token.value}'. (Improper scope: ${scope.join('.')}; Expected scope: ${value})`
        );
    }

    function unexpectedEOT() {
        const start = { ...tokens[tokens.length - 1].loc.stop };
        const stop = { ...start };
        error({ start, stop }, 'Unexpected EOF.');
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
     * **NOTE**: If the current token-type is NOT a 'word', then nothing will happen.
     */
    function skipWords() {
        if (t.type !== 'word') return;

        while (!isEOT() && t.type === 'word') next();
    }

    /**
     * Scans into the next token with the type.
     *
     * **NOTE**: If the current token-type EQUALS the type, then nothing will happen.
     */
    function skipUntilType(type: string[] | string) {
        if (typeof type === 'string') type = [type];

        if (type.indexOf(t.type) !== -1) return;

        while (!isEOT() && type.indexOf(t.type) === -1) next();
    }

    function scanProperty(name: string, value: Token3[]) {
        if (DEBUG)
            console.log(
                `\t\tscanProperty() => ${name} = ${value
                    .map((o) => {
                        return o.value;
                    })
                    .join(' ')}`
            );
    }

    function scanIntoProperties(delimiter: '=' | ':'): boolean {

        if (DEBUG) console.log('\tscanIntoProperties()', t);

        // Go through each property in the sequence.
        while (!isEOT()) {

            // The properties scope is done.
            if(t.type === 'scope_close') {
                console.log("fun return }");
                // i--;
                return true;
            }

            // Checks the first token in the sequence.
            if (t.type !== 'word') {
                expectWord(t);

                // Since the property is invalid, skip to the next property.
                skipUntilType(['delimiter_property', 'scope_close']);
                break;
            }

            const valLower = t.value.toLowerCase().trim();

            // This property is a scope. Treat it like one.
            if (SCOPE_RULES[valLower] !== undefined) {
                // Process the scope and its rules.
                if (!scanIntoScope()) return false;
            } else {
                const propertyName = valLower;
                const propertyValue = [];

                // Grab our next token by shifting 1 index.
                t = tokens[++i];

                if (t.value !== delimiter) {
                    expectValue(t, delimiter);
                    // Since the property is invalid, skip to the next property.
                    skipUntilType(['delimiter_property', 'scope_close']);
                    break;
                }

                // (Sanity Check)
                if (isEOT()) {
                    unexpectedEOT();
                    return false;
                }

                // Check to see if the property is empty.
                if (t.type !== 'property_terminator') {
                    while (!isEOT()) {
                        t = tokens[++i];
                        if (t.type === 'property_terminator') {
                            break;
                        }
                        propertyValue.push(t);
                    }
                }

                // (Sanity Check)
                if (isEOT()) {
                    unexpectedEOT();
                    return false;
                }

                scanProperty(propertyName, propertyValue);

                // Set the proper index for the ruleset of the container to properly handle the next token.
                if (t.type === 'property_terminator') {
                    t = tokens[++i];
                }

                console.log(`[${t.loc.start.row}:${t.loc.start.col}] type: ${t.type}`);
            }
        }

        // (Sanity Check)
        if (isEOT()) {
            unexpectedEOT();
            return false;
        }

        return true;
    }

    /**
     * Recursively scans through all tokens, checking their rules and seeing if these rules are followed.
     *
     * @returns True if the rules are followed in the level of recursion. If false, then the linter pass has failed and
     * no further checks are needed. When failure occurs, this should fall back to the entry level of recursion.
     */
    function scanIntoScope(): boolean {
        if (DEBUG) console.log('scanIntoScope()', t);

        if (isEOT()) return false;

        if (t.type === 'word') {
            const rules = SCOPE_RULES[t.value.toLowerCase()];
            if (rules == null) {
                error(t.loc, `Unknown word: ${t.value}`);
                return false;
            }

            // Go through conditional rules here.
            for (const rule of rules) {
                // Check 'scope:<scope>' rule.
                if (rule.indexOf('scope:') === 0) {
                    const ruleValue = rule.split(':')[1].toLowerCase().trim();
                    if (scope.join('.') !== ruleValue) {
                        expectScope(t, ruleValue);
                    }
                }
            }

            // Step into scope.
            const scopeLower = t.value.toLowerCase().trim();
            stepIntoScope(scopeLower);

            // Go through sequential rules here.
            for (const rule of rules) {
                // Ignore non-sequence rules.
                if (rule.indexOf('scope:') !== -1) continue;

                switch (rule) {
                    case 'word': {
                        // Grab our next token by shifting 1 index.
                        t = tokens[++i];
                        t1 = tokens[i + 1];

                        // (Sanity Check)
                        if (isEOT()) {
                            unexpectedEOT();
                            return false;
                        }

                        // Check to make sure that the next token is a word.
                        if (t.type !== 'word') expectWord(t);

                        break;
                    }

                    // RULE: A series of 1 or more word tokens. (Recipe names, String property values, Vector3, etc.)
                    case 'words': {
                        // Grab our next token by shifting 1 index.
                        t = tokens[++i];
                        t1 = tokens[i + 1];

                        // (Sanity Check)
                        if (isEOT()) {
                            unexpectedEOT();
                            return false;
                        }

                        // Check to make sure that the next token is a word.
                        if (t.type !== 'word') expectWords(t);

                        // Skip until our next token is a non-word token.
                        skipWords();

                        // This is applied so that the next token is the non-word token when handled by the next rule.
                        shift(-1);
                        break;
                    }
                    case 'scope_open': {
                        // Grab our next token by shifting 1 index.
                        t = tokens[++i];
                        t1 = tokens[i + 1];

                        // (Sanity Check)
                        if (isEOT()) {
                            unexpectedEOT();
                            return false;
                        }

                        if (t.type !== 'scope_open') expectValue(t, '{');
                        break;
                    }
                    case 'scope_close': {
                        // Grab our next token by shifting 1 index.
                        t = tokens[++i];

                        // (Sanity Check)
                        if (isEOT()) {
                            unexpectedEOT();
                            return false;
                        }

                        if (t.type !== 'scope_close') expectValue(t, '}');
                        i++;
                        break;
                    }
                    case '*': {
                        // Grab our next token by shifting 1 index.
                        t = tokens[++i];

                        // (Sanity Check)
                        if (isEOT()) {
                            unexpectedEOT();
                            return false;
                        }
                        
                        while(t.type !== 'scope_close') {
                            console.log('next');
                            if (!scanIntoScope()) return false;
                        }
                        break;
                    }
                    case '*:': {
                        t = tokens[++i];

                        // (Sanity Check)
                        if (isEOT()) {
                            unexpectedEOT();
                            return false;
                        }

                        if (!scanIntoProperties(':')) return false;

                        t = tokens[i];
                        if(t.type !== 'scope_close') {
                            expectValue(t, '}');
                        } else {
                            i--;
                        }
                        break;
                    }
                    case '*=': {
                        // Grab our next token by shifting 1 index.
                        t = tokens[++i];

                        // (Sanity Check)
                        if (isEOT()) {
                            unexpectedEOT();
                            return false;
                        }

                        if (!scanIntoProperties('=')) return false;
                        
                        t = tokens[i];
                        console.log(t);
                        if(t.type !== 'scope_close') {
                            expectValue(t, '}');
                        }

                        i--;
                        break;
                    }
                    default: {
                        // `word:value` rule:
                        if (rule.startsWith('word:')) {
                            // Grab our next token by shifting 1 index.
                            t = tokens[++i];
                            t1 = tokens[i + 1];

                            // (Sanity Check)
                            if (isEOT()) {
                                unexpectedEOT();
                                return false;
                            }

                            const ruleValue = rule.split(':')[1].toLowerCase().trim();
                            if (t.value.toLowerCase().trim() !== ruleValue) {
                                expectValue(t, ruleValue);
                            }
                        }
                        break;
                    }
                }
            }

            stepOutOfScope();
            return true;
        } else {
            next();
            return true;
        }
    }

    // (Sets the initial token to lint)
    shift(0);

    // Use a while loop here. This is because multiple modules can be defined in one file. If we reach and terminate our
    // recursive scan for the first module, then we end up in the loop to continue until we have reached the end of our
    // tokens.
    while (!isEOT()) if (!scanIntoScope()) break;

    // The only way that the linter can pass is if ZERO logs are assigned the type 'error'.
    const pass =
        logs.length === 0 ||
        logs.filter((o) => {
            return o.type === 'error';
        }).length === 0;

    return { pass, logs };
}

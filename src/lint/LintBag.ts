import { Token } from '../token/Token';
import { TokenLocation } from '../token/TokenLocation';
import { TokenType } from '../token/TokenType';
import { LintLog } from './LintLog';

/**
 * **LintBag** is a wrapper-class for arrays of Token3 objects. The wrapper provides common tasks associated with
 * analyzing tokens processed by the extension and the linting process.
 *
 * @author Jab
 */
export class LintBag {
    /** The tokens to interpret. */
    readonly tokens: Token[];

    /** The scope tree. (Used to check against scope requirements for certain properties or other scopes) */
    readonly scope: string[] = ['root'];

    /** The scope tree with scope names. (Used for diagnostics insight) */
    readonly scopeWithNames: string[] = ['root'];

    /** The offset in the tokens array. */
    offset = 0;

    readonly logs: LintLog[] = [];

    /**
     * @param tokens The tokens to lint. Must be non-zero array.
     */
    constructor(tokens: Token[]) {
        // Make sure the array passed isn't empty.
        if (tokens.length === 0) throw new Error('No tokens provided. (Empty)');

        this.tokens = tokens;
    }

    /**
     * Seeks through the tokens, setting the transformed offset in the bag.
     *
     * @param amount (Default is 1) The amount to seek.
     * @returns The token at the location of the transformed offset in the bag.
     *
     * @throws Error - If isEOT() OR if the transformed offset is negative.
     */
    seek(amount = 1): Token {
        // (Sanity Check)
        if (this.isEOT()) throw new Error('Unexpected EOF.');

        const offsetTransformed = this.offset + amount;
        if (offsetTransformed < 0) {
            throw new Error(
                `The transformed offset is negative. (amount: ${amount}, offset: ${this.offset}, result: ${offsetTransformed})`
            );
        }

        this.offset = offsetTransformed;

        // (Sanity Check)
        if (this.isEOT()) throw new Error('Unexpected EOF.');

        return this.tokens[this.offset];
    }

    /**
     * Peeks through the tokens. (This does not change the offset in the bag)
     *
     * @param offset (Default is 0) The amount to peek.
     * @returns The token at the location of the transformed offset in the bag.
     *
     * @throws Error - If isEOT() OR if the transformed offset is negative.
     */
    peek(offset = 0): Token {
        // (Sanity Check)
        if (this.isEOT()) throw new Error('Unexpected EOF.');

        const offsetTransformed = this.offset + offset;
        if (offsetTransformed < 0) {
            throw new Error(
                `The transformed offset is negative. (offset: ${offset}, bag.offset: ${this.offset}, result: ${offsetTransformed})`
            );
        }

        // (Sanity Check)
        if (this.isEOT(offsetTransformed)) throw new Error('Unexpected EOF.');

        return this.tokens[offsetTransformed];
    }

    /**
     * @returns The next token in the bag. (Equivelant to `this.seek(1)`)
     *
     * @throws Error - Thrown if isEOT()
     */
    next(): Token {
        // (Sanity Check)
        if (this.isEOT()) throw new Error('Unexpected EOF.');

        return this.seek(1);
    }

    /**
     * @returns The previous token in the bag. (Equivelant to `this.seek(-1)`)
     *
     * @throws Error - Thrown if isEOT() OR a negative offset.
     */
    prev(): Token {
        // (Sanity Check)
        if (this.isEOT()) throw new Error('Unexpected EOF.');

        return this.seek(-1);
    }

    /**
     * Scans tokens until the next token is found with the type given.
     *
     * @param type The type to check.
     * @returns The next token with the type given.
     *
     * @throws Error - Thrown if isEOT()
     */
    untilType(type: TokenType): Token {
        // (Sanity Check)
        if (this.isEOT()) throw new Error('Unexpected EOF.');

        // Loop through until the next token is found with the matching value.
        while (!this.isEOT() && this.tokens[this.offset].type !== type) {
            this.offset++;
        }

        // (Sanity Check)
        if (this.isEOT()) throw new Error('Unexpected EOF.');

        return this.tokens[this.offset];
    }

    /**
     * Scans tokens until the next token is found with the value given.
     *
     * @param value The value to check.
     * @param caseSensitive (Default: false) Whether compare values as case-sensitive.
     * @returns The next token with the value given.
     *
     * @throws Error - Thrown if isEOT()
     */
    untilValue(value: string, caseSensitive = false): Token {
        // (Sanity Check)
        if (this.isEOT()) throw new Error('Unexpected EOF.');

        // (If not case-sensitive, check in lower-case)
        if (!caseSensitive) value = value.toLowerCase();

        // Loop through until the next token is found with the matching value.
        while (!this.isEOT()) {
            let next = this.tokens[this.offset].value;
            if (!caseSensitive) next = next.toLowerCase();
            if (next === value) break;
            this.offset++;
        }

        // (Sanity Check)
        if (this.isEOT()) throw new Error('Unexpected EOF.');

        return this.tokens[this.offset];
    }

    /**
     * Resets all tracked data in the bag. (Offset set to 0)
     */
    reset(): void {
        this.offset = 0;
        this.logs.length = 0;
        this.scope.length = 0;
        this.scopeWithNames.length = 0;
        this.scope.push('root');
        this.scopeWithNames.push('root');
    }

    /**
     * Records the scope stepped into.
     *
     * @param scope The scope to step into.
     * @param name (Optional) The name of the scope to step into.
     *
     * @throws Error - If the scope OR name are empty strings.
     */
    stepIn(scope: string, name?: string): void {
        if (scope.length === 0) throw new Error('The scope given is empty.');
        if (name != null && name.length === 0) throw new Error('The name given is empty.');

        this.scope.push(scope);

        if (name == null) {
            this.scopeWithNames.push(scope);
            return;
        }

        this.scopeWithNames.push(`${scope}[${name}]`);
    }

    /**
     * Steps out of the current scope position.
     *
     * @throws Error - If the current scope is the root file.
     */
    stepOut(): boolean {
        // This is an illegal situation. For the scope-bracket phase, this would be an immediate failure.
        if (this.scope.length === 1) return false;

        this.scope.pop();
        this.scopeWithNames.pop();

        return true;
    }

    /**
     * @returns The scope currently inside.
     */
    getScope(): string {
        return this.scope.join('.');
    }

    /**
     * @returns The scope currently inside with names. (If the scope has a name)
     */
    getScopeWithNames(): string {
        return this.scopeWithNames.join('.');
    }

    /**
     * @returns True if the offset in the bag is greater than the last token's index.
     */
    isEOT(offset = this.offset): boolean {
        return offset >= this.tokens.length;
    }

    /**
     * Logs an error. (Used during the lint process)
     *
     * @param location The location of the error.
     * @param message The diagnostic message to explain the error.
     */
    error(location: TokenLocation, message: string) {
        // if (DEBUG) throw new Error(`[${location.start.row}:${location.start.col}]: ${message}`);
        this.logs.push({ scope: this.getScopeWithNames(), type: 'error', location, message });
    }

    /**
     * Logs a warning. (Used during the lint process)
     *
     * @param location The location of the warning.
     * @param message The diagnostic message to explain the warning.
     */
    warning(location: TokenLocation, message: string) {
        this.logs.push({ scope: this.getScopeWithNames(), type: 'warning', location, message });
    }

    /**
     * Logs information. (Used during the lint process)
     *
     * @param location The location of the area to inform.
     * @param message The diagnostic message to inform.
     */
    info(location: TokenLocation, message: string) {
        this.logs.push({ scope: this.getScopeWithNames(), type: 'info', location, message });
    }

    /**
     * Logs an error of a token that is expected to be a 'word' type, but isn't.
     *
     * @param token The offending token.
     */
    expectWord(token: Token) {
        this.error(token.loc, `Illegal token: '${token.value}' (Expected word)`);
    }

    /**
     * Logs an error of a token that is expected to be a value, but isn't.
     *
     * @param token The offending token.
     */
    expectValue(token: Token, value: string) {
        this.error(token.loc, `Illegal token: '${token.value}' (Expected '${value}')`);
    }

    /**
     * Logs an error of a token that is expected to be a scope, but isn't.
     *
     * @param token The offending token.
     */
    expectScope(token: Token, value: string) {
        this.error(
            token.loc,
            `Unexpected token: '${
                token.value
            }'. (Improper scope: ${this.getScopeWithNames()}; Expected scope: ${value})`
        );
    }

    /**
     * Logs an unexpected EOT. (EOF)
     */
    errorEOT() {
        const start = { ...this.tokens[this.tokens.length - 1].loc.stop };
        const stop = { ...start };
        this.error({ start, stop }, 'Unexpected EOF.');
    }

    /**
     * @returns True if one or more log entries is assigned the 'error' type.
     */
    hasErrors(): boolean {
        // No logs? No errors.
        if (this.logs.length === 0) return false;

        // Check each type of log.
        for (const log of this.logs) {
            if (log.type === 'error') return true;
        }

        // No errors.
        return false;
    }
}

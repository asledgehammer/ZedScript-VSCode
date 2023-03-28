import { ParseBag } from '../api/util/ParseBag';
import { LexerToken } from '../Lexer';
import { TokenLocation, TokenType } from '../Token';

export class FormatError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FormatError';
    }
}

export class FormatBag {
    tokens: Element[] = [];
    offset = 0;

    format(prefix = ''): string {
        let s = '';
        const { tokens } = this;
        for (const token of tokens) {
            s += token.format(this, prefix);
        }
        return s;
    }

    get length() {
        return this.tokens.length;
    }

    token(token: Element) {
        this.tokens.push(token);
    }

    next(): Element {
        return this.tokens[this.offset++];
    }

    peek(offsetArg = 0): Element {
        return this.tokens[this.offset + offsetArg];
    }

    reset() {
        this.offset = 0;
    }

    isEOF(): boolean {
        return this.offset >= this.tokens.length;
    }

    log(loc: TokenLocation, message: string) {
        console.log(`[FORMATTER][LOG][${loc.start.row}:${loc.start.column}] :: ${message}`);
    }

    info(loc: TokenLocation, message: string) {
        console.info(`[FORMATTER][INFO][${loc.start.row}:${loc.start.column}] :: ${message}`);
    }

    warn(loc: TokenLocation, message: string) {
        console.warn(`[FORMATTER][WARN][${loc.start.row}:${loc.start.column}] :: ${message}`);
    }

    error(loc: TokenLocation, message: string): FormatError {
        return new FormatError(`[FORMATTER][ERROR][${loc.start.row}:${loc.start.column}] :: ${message}`);
    }
}

export abstract class Element {
    readonly type: TokenType;

    /**
     * @param type The token's type.
     */
    constructor(type: TokenType) {
        this.type = type;
    }

    abstract format(bag: FormatBag, prefix: string): string;
}

export class CommentToken extends Element {
    readonly raw: string;
    constructor(raw: string) {
        super('comment');
        this.raw = raw.trim();
    }

    format(bag: FormatBag, prefix = ''): string {
        return `${prefix}${this.raw}`;
    }
}

export class CommentBlockToken extends Element {
    readonly raw: string;
    constructor(raw: string) {
        super('comment_block');
        this.raw = raw.trim();
    }

    format(bag: FormatBag, prefix = ''): string {
        return `${prefix}${this.raw}`;
    }
}

export class EmptyLineToken extends Element {
    constructor() {
        super('empty_line');
    }
    format(bag: FormatBag, prefix = ''): string {
        return '\n';
    }
}

export class EOLToken extends Element {
    raw: string;

    constructor(raw: string) {
        super('eol');
        this.raw = raw.trim();
    }
    format(bag: FormatBag, prefix = ''): string {
        return `${this.raw}`;
    }
}

export class PropertyToken extends Element {
    readonly raw: string;
    name?: string;
    values: string[];
    delimiter: ':' | '=' | '/' | null;
    constructor(raw: string) {
        super('property');

        this.raw = raw;

        /* The left-most key-value delimiter. */

        if (raw.indexOf(':') !== -1) {
            /* NOTE: Put ':' first because properties using this delimiter can use '=' in their values. */
            this.delimiter = ':';
        } else if (raw.indexOf('/') !== -1) {
            /* NOTE: Put '/' second because properties using this delimiter can use '=' in their values. */
            this.delimiter = '/';
        } else if (raw.indexOf('=') !== -1) {
            this.delimiter = '=';
        } else {
            this.delimiter = null;
            // throw new Error('Unknown delimiter for property: ' + raw);
        }

        if (this.delimiter != null) {
            if (this.delimiter === '/') {
                this.values = raw.split('/').map((o) => {
                    return o.trim();
                });
            } else {
                const delIndex = raw.indexOf(this.delimiter);
                this.name = raw.substring(0, delIndex).trim();
                this.values = [raw.substring(delIndex + 1).trim()];
            }
        } else {
            this.values = [raw.trim()];
        }
    }

    format(bag: FormatBag, prefix = ''): string {
        const { name } = this;
        let delimiter: string = this.delimiter as string;

        let join = ' / ';
        if (delimiter === ':') {
            delimiter = ': ';
            join = ' ; ';
        } else if (delimiter === '=') delimiter = ' = ';
        const value = this.values.join(join);

        if (this.name !== undefined) {
            return `${prefix}${name}${delimiter}${value}`;
        } else {
            return `${prefix}${value}`;
        }
    }
}

export type ValueType = 'string' | 'number' | 'boolean';

export class ValueToken<E> {
    type: ValueType;
    value: E;

    constructor(type: ValueType, value: E) {
        this.type = type;
        this.value = value;
    }
}

class StringValue extends ValueToken<string> {
    static TYPE: ValueType = 'string';

    constructor(value: string) {
        super(StringValue.TYPE, value);
    }
}

class NumberValue extends ValueToken<string> {
    static TYPE: ValueType = 'number';

    constructor(value: string) {
        super(NumberValue.TYPE, value);
    }
}

export class Scope extends Element {
    name?: string;
    scopeType: string;
    properties: Element[] = [];

    constructor(scopeType: string, name: string | undefined) {
        super('scope');
        this.scopeType = scopeType;
        this.name = name;
    }

    deserialize(inBag: ParseBag, outBag = new FormatBag()): void {
        const { properties: tokens } = this;

        while (!inBag.isEOF()) {
            const next = inBag.next();
            switch (next.type) {
                case 'scope_close': {
                    return;
                }
                case 'key': {
                    tokens.push(deserializeKeyValue(next, inBag, outBag));
                    break;
                }
                case 'property': {
                    tokens.push(new PropertyToken(next.val));
                    break;
                }
                case 'scope_type': {
                    tokens.push(deserializeScope(next.val, inBag, outBag));
                    break;
                }
                case 'comment': {
                    tokens.push(new CommentToken(next.val));
                    break;
                }
                case 'comment_block': {
                    tokens.push(new CommentToken(next.val));
                    break;
                }
                case 'eol': {
                    tokens.push(new EOLToken(next.val));
                    break;
                }
                case 'empty_line': {
                    tokens.push(new EmptyLineToken());
                    break;
                }
                // These shouldn't be discovered at this level of the token tree.
                case 'delimiter':
                case 'value':
                    outBag.error(next.loc, `Unexpected token in scope:  '${next.type}' => '${next.val}'`);
            }
        }
    }

    format(bag: FormatBag, prefix = ''): string {
        const prefixNew = prefix + ' '.repeat(4);
        let s = `${prefix}${this.scopeType} ${this.name != null ? this.name : ''} {`;
        const { properties } = this;
        for (const property of properties) {
            s += property.format(bag, prefixNew);
        }
        s += `${prefix}}\n\n`;
        return s;
    }
}

function deserializeKeyValue(next: LexerToken, inBag: ParseBag, outBag = new FormatBag()): PropertyToken {
    const sKey = next.val;
    const tDelimiter = inBag.next();
    if (tDelimiter.type !== 'delimiter') {
        outBag.error(tDelimiter.loc, 'Expected delimiter for key-value pair.');
    }
    const sDelimiter = tDelimiter.val;

    const tVal = inBag.next();
    if (tVal.type !== 'value') {
        outBag.error(tDelimiter.loc, 'Expected value for key-value pair.');
    }

    const sVal = tVal.val;

    return new PropertyToken(`${sKey}${sDelimiter}${sVal}`);
}

function deserializeScope(scopeType: string, inBag: ParseBag, outBag = new FormatBag()): Scope {
    let name = undefined;
    let next = inBag.next();
    if (next.type === 'scope_name') {
        name = next.val;
        next = inBag.next();
        if (next.type === 'eol') next = inBag.next();
        if (next.type !== 'scope_open') {
            throw inBag.error(next.loc, "Expected '{'.");
        }
    } else if (next.type === 'eol') {
        next = inBag.next();
        if (next.type !== 'scope_open') {
            throw inBag.error(next.loc, "Expected '{'.");
        }
    } else if (next.type !== 'scope_open') {
        throw inBag.error(next.loc, "Expected '{'.");
    }

    const scope = new Scope(scopeType, name);
    scope.deserialize(inBag, outBag);
    return scope;
}

function _deserialize(inBag: ParseBag, outBag = new FormatBag()): FormatBag {
    while (!inBag.isEOF()) {
        const next = inBag.next();
        switch (next.type) {
            case 'scope_type': {
                outBag.token(deserializeScope(next.val, inBag, outBag));
                break;
            }
            case 'key': {
                outBag.token(deserializeKeyValue(next, inBag, outBag));
                break;
            }
            case 'property': {
                outBag.token(new PropertyToken(next.val));
                break;
            }
            case 'comment': {
                outBag.token(new CommentToken(next.val));
                break;
            }
            case 'comment_block': {
                outBag.token(new CommentBlockToken(next.val));
                break;
            }
            case 'eol': {
                outBag.token(new EOLToken(next.val));
                break;
            }
            case 'empty_line': {
                outBag.token(new EmptyLineToken());
                break;
            }
        }
    }

    return outBag;
}

export function deserialize(tokens: LexerToken[]): FormatBag {
    return _deserialize(new ParseBag(tokens));
}

export function format(tokens: LexerToken[]): string {
    return _deserialize(new ParseBag(tokens)).format();
}

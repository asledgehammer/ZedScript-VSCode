export class ParseBag {
    tokens: string[];
    offset = 0;

    constructor(tokens: string[]) {
        this.tokens = tokens;
    }

    next(): string {
        return this.tokens[this.offset++];
    }

    peek(offsetArg = 0): string {
        return this.tokens[this.offset + offsetArg];
    }

    isEOF(): boolean {
        return this.offset >= this.tokens.length;
    }
}

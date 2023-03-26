import { LexerToken } from '../../Lexer';

export class ParseBag {
    tokens: LexerToken[];
    offset = 0;

    constructor(tokens: LexerToken[]) {
        this.tokens = tokens;
    }

    next(): LexerToken {
        return this.tokens[this.offset++];
    }

    peek(offsetArg = 0): LexerToken {
        return this.tokens[this.offset + offsetArg];
    }

    isEOF(): boolean {
        return this.offset >= this.tokens.length;
    }
}

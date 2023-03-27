import { LexerToken } from '../../Lexer';
import { TokenLocation } from '../../Token';
import { ParseError } from './ParseError';

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

    log(loc: TokenLocation, message: string) {
        console.log(`[LOG][${loc.start.row}:${loc.start.column}] :: ${message}`);
    }

    info(loc: TokenLocation, message: string) {
        console.info(`[INFO][${loc.start.row}:${loc.start.column}] :: ${message}`);
    }
    
    warn(loc: TokenLocation, message: string) {
        console.warn(`[WARN][${loc.start.row}:${loc.start.column}] :: ${message}`);
    }

    error(loc: TokenLocation, message: string): ParseError {
        return new ParseError(`[ERROR][${loc.start.row}:${loc.start.column}] :: ${message}`);
    }
}

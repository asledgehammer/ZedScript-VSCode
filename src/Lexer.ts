import { TokenCursor, TokenLocation, TokenType } from './Token';

export type LexerToken = { type: TokenType; val: string; loc: TokenLocation };

export class LexerError extends Error {
    /**
     * @param {string} message
     */
    constructor(cursor: TokenCursor, message: string) {
        super(`[ZedScriptParse][Lexer][ERROR][${cursor.row}:${cursor.column}] :: ${message}`);
        this.name = 'LexerError';
    }
}

export class LexerBag {
    inCommentBlock = false;
    comments: LexerToken[] = [];
    tokens: LexerToken[] = [];
    raw: string;
    offset = 0;

    cursors: { [offset: number]: TokenCursor } = {};

    largestCursorOffset = 0;
    largestCursor: TokenCursor = { row: 1, column: 1 };

    constructor(raw: string) {
        const tabIndentCount = 4;
        this.raw = raw.replace(/\r/g, '').replace(/\t/g, ' '.repeat(tabIndentCount));
    }

    token(type: TokenType, value: string, start: TokenCursor, stop: TokenCursor): void {
        this.tokens.push({ type, val: value, loc: { start, stop } });
        if (type === 'property') {
            this.eol(',');
        }
    }

    isEOF(): boolean {
        return this.offset >= this.raw.length;
    }

    commentLine(): LexerToken {
        this.next();
        const start = this.cursor(this.offset - 2);
        const value = this.until(['\n'], true)!;
        const stop = this.cursor(this.offset - 1);
        return { type: 'comment', loc: { start, stop }, val: `//${value}` };
    }

    commentBlock(): LexerToken {
        this.inCommentBlock = true;
        this.next();
        const start = this.cursor(this.offset - 2);
        let value = '';
        let layersIn = 1;
        while (layersIn > 0) {
            if (this.peek() === '/' && this.peek(1) === '*') {
                layersIn++;
                this.offset += 2;
            } else if (this.peek() === '*' && this.peek(1) === '/') {
                layersIn--;
                this.offset += 2;
            } else {
                value += this.raw[this.offset++];
            }
        }
        const stop = this.cursor();
        this.inCommentBlock = false;
        return { type: 'comment_block', loc: { start, stop }, val: `/*${value}*/` };
    }

    cursor(o: number = this.offset): TokenCursor {
        if (this.cursors[o] != null) return this.cursors[o];

        let i = o < this.largestCursorOffset ? 0 : this.largestCursorOffset;
        const c = o < this.largestCursorOffset ? { row: 1, column: 1 } : { ...this.largestCursor };

        for (; i < o; i++) {
            const char = this.raw[i];
            if (char === '\n') {
                c.row++;
                c.column = 1;
            } else {
                c.column++;
            }
        }

        this.cursors[o] = c;

        if (this.largestCursorOffset < o) {
            this.largestCursorOffset = o;
            this.largestCursor = c;
        }

        return c;
    }

    eol(val = '', tokens = this.tokens) {
        const last = this.cursor();
        tokens.push({
            type: 'eol',
            val,
            loc: { start: last, stop: { row: last.row, column: last.column + 1 } },
        });
    }

    next(): string {
        let c = this.raw[this.offset++];
        if (!this.inCommentBlock) {
            if (c === '/' && this.peek() === '*') {
                this.comments.push(this.commentBlock());
                c = this.next();
                if (c === '\n') this.eol('\n');
            } else if (c == '/' && this.peek() === '/') {
                this.comments.push(this.commentLine());
                this.eol('\n', this.comments);
                c = this.next();
            }
        }
        return c;
    }

    until(patterns: string[], removePattern = false): string | undefined {
        let s = '';
        while (!this.isEOF()) {
            const c = this.next();
            if (c === undefined) return s;

            s += c;

            for (const pattern of patterns) {
                if (s.indexOf(pattern) !== -1) {
                    if (removePattern) {
                        s = s.substring(0, s.length - pattern.length);
                    }
                    return s;
                }
            }
        }

        return s;
    }

    audit() {
        function auditToken(index: number, token: LexerToken) {
            const startRow = token.loc.start.row;
            const startCol = token.loc.start.column;
            const stopRow = token.loc.stop.row;
            const stopCol = token.loc.stop.column;

            // This ensures that the tokens which overruns comment tokens are properly sized.
            if (startRow === stopRow) {
                const len = stopCol - startCol;
                if (token.val.length !== len) {
                    // console.log("Resizing string: " + token.val);
                    token.loc.stop = { row: startRow, column: startCol + token.val.length };
                }
            }
        }

        for (let index = 0; index < this.comments.length; index++) {
            auditToken(index, this.comments[index]);
        }

        for (let index = 0; index < this.tokens.length; index++) {
            auditToken(index, this.tokens[index]);
        }
    }

    print(message: string): void {
        const cursor = this.cursor();
        console.log(`[${cursor.row}:${cursor.column}] :: ${message}`);
    }

    error(message: string, cursor: TokenCursor = this.cursor(this.offset)): LexerError {
        return new LexerError(cursor, message);
    }

    warn(message: string, cursor: TokenCursor = this.cursor(this.offset)): void {
        console.warn(`[Lexer][${cursor.row}:${cursor.column}] :: ${message}`);
    }

    peek(offsetArg = 0): string | undefined {
        return this.raw[this.offset + offsetArg];
    }

    isEOL(tokens: LexerToken[], index: number): boolean {
        const token = tokens[index];
        const tokenNext = tokens[index + 1];
        if (tokenNext === undefined) {
            return true;
        }

        return tokenNext.loc.start.row > token.loc.start.row;
    }
}

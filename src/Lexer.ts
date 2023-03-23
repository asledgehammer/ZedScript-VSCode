export type LexerCursor = { row: number; column: number };
export type LexerLocation = { start: LexerCursor; stop: LexerCursor };
export type LexerToken = { value: string; loc?: LexerLocation };
export type LexerOptions = { comments: boolean; location: boolean };

export class LexerError extends Error {
    /**
     * @param {string} message
     */
    constructor(cursor: LexerCursor, message: string) {
        super(`[ZedScriptParse][Lexer][ERROR][${cursor.row}:${cursor.column}] :: ${message}`);
        this.name = 'LexerError';
    }
}

export class LexerBag {
    inCommentBlock = false;
    comments: LexerToken[] = [];
    tokens: LexerToken[] = [];
    options: Partial<LexerOptions>;
    raw: string;
    offset = 0;

    cursors: { [offset: number]: LexerCursor } = {};

    largestCursorOffset = 0;
    largestCursor: LexerCursor = { row: 1, column: 1 };

    constructor(raw: string, options: Partial<LexerOptions>) {
        this.raw = raw.replace(/\r/g, '');
        this.options = options;
    }

    token(value: string, start: LexerCursor, stop: LexerCursor): void {
        this.tokens.push(this.options.location ? { value, loc: { start, stop } } : { value });
    }

    isEOF(): boolean {
        return this.offset >= this.raw.length;
    }

    commentLine() {
        this.next();
        const start = this.cursor();
        const value = this.until(['\n'], true)!;
        const stop = this.cursor();
        return { loc: { start, stop }, value };
    }

    commentBlock() {
        this.inCommentBlock = true;
        this.next();
        const start = this.cursor();
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
        return { loc: { start, stop }, value: `${value}` };
    }

    cursor(o: number = this.offset, force = false): LexerCursor {
        if (this.cursors[o] != null) return this.cursors[o];

        if (!this.options.location && !force) {
            return { row: -1, column: -1 };
        }

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

    next(): string {
        let c = this.raw[this.offset++];
        if (!this.inCommentBlock) {
            if (c === '/' && this.peek() === '*') {
                this.comments.push(this.commentBlock());
                c = this.next();
            }
            if (c == '/' && this.peek() === '/') {
                this.comments.push(this.commentLine());
                c = this.next();
            }
        }
        return c;
    }

    until(patterns: string[], removePattern = false): string | undefined {
        let s = '';
        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (this.isEOF()) return s;
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
    }

    print(message: string): void {
        const cursor = this.cursor();
        console.log(`[${cursor.row}:${cursor.column}] :: ${message}`);
    }

    error(message: string, cursor: LexerCursor = this.cursor(this.offset, true)): void {
        throw new LexerError(cursor, message);
    }

    warn(message: string, cursor: LexerCursor = this.cursor(this.offset, true)): void {
        console.warn(`[ZedScriptParse][Lexer][${cursor.row}:${cursor.column}] :: ${message}`);
    }

    peek(offsetArg = 0): string | undefined {
        return this.raw[this.offset + offsetArg];
    }
}

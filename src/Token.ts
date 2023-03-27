export type TokenCursor = { row: number; column: number };
export type TokenLocation = { start: TokenCursor; stop: TokenCursor };
export type TokenType =
    | 'comment'
    | 'comment_block'
    | 'empty_line'
    | 'scope'
    | 'scope_type'
    | 'scope_name'
    | 'scope_open'
    | 'scope_close'
    | 'key'
    | 'delimiter'
    | 'value'
    | 'property';
export type TokenType =
    | 'white_space'         // ' ', '\t', etc. (/\s/g)
    | 'new_line'            // '\n'
    | 'scope_open'          // '{'
    | 'scope_close'         // '}'
    | 'property_terminator' // ','
    | 'delimiter_equals'    // '='
    | 'delimiter_colon'     // ':'
    | 'delimiter_semicolon' // ';'
    | 'delimiter_slash'     // '/'
    | 'comment_block_open'  // '/*'
    | 'comment_block_close' // '*/'
    | 'comment_block'       //
    | 'comment_line_open'   // '//'
    | 'comment_line'        //
    | 'word'                // /([a-z|A-Z|0-9|_|-]+)
    | 'unknown';            // ?

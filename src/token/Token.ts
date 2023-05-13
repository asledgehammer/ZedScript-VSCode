import { TokenLocation } from './TokenLocation';
import { TokenType } from './TokenType';

export type Token = {
    loc: TokenLocation;
    value: string;
    type: TokenType;
};

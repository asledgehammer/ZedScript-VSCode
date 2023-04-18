import { Token3, Token3Location } from './TokenTake3';

export type Lint3Log = {
    type: 'info' | 'warning' | 'error';
    message: string;
    location: Token3Location;
};

export type Lint3Results = {
    pass: boolean;
    logs: Lint3Log[],
}

export function lint3(tokens: Token3[]): Lint3Results {

    // Clone the tokens to not poison the original tokens passed.
    tokens = tokens.map((o) => {
        return { ...o };
    });

    let pass = true;
    const logs: Lint3Log[] = [];

    // ..

    return { pass, logs };
}

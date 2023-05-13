import { Token } from '../../token/Token';
import { TokenCursor } from '../../token/TokenCursor';
import { TokenLocation } from '../../token/TokenLocation';
import { LintResults } from '../LintResults';
import { LintPhase } from './LintPhase';

export class LintScopeClosureCheck extends LintPhase {
    constructor() {
        super('Bracket Phase');
    }

    onTest(tokens: Token[], results: LintResults): void {
        let indent = 0;
        let tokenLast: Token = tokens[0];
        for (const next of tokens) {
            tokenLast = next;
            if (next.type === 'scope_open') {
                indent++;
            } else if (next.type === 'scope_close') {
                indent--;
                if (indent < 0) break;
            }
        }

        if (indent !== 0) {
            results.pass = false;

            const EOFLoc: TokenCursor = tokenLast.loc.stop;
            const EOF: TokenLocation = {
                start: EOFLoc,
                stop: { ...EOFLoc, col: EOFLoc.col + 1 },
            };

            if (indent < 0) {
                results.logs.push({
                    type: 'error',
                    location: EOF,
                    message: "Too many '}'",
                });
            } else {
                results.logs.push({
                    type: 'error',
                    location: EOF,
                    message: "Missing '}'",
                });
            }
        }
    }
}

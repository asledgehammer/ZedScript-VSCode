import { Token } from '../token/Token';
import { LintResults } from './LintResults';
import { LintScopeClosureCheck } from './phase/LintBracketPhase';
import { LintPhase } from './phase/LintPhase';

export class LintTest {
    readonly tests: LintPhase[] = [new LintScopeClosureCheck()];

    test(tokens: Token[]): LintResults {
        const results = { logs: [], pass: true };

        for (const test of this.tests) {
            test.onTest(tokens, results);
            if (!results.pass) break;
        }

        return results;
    }
}

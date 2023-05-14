import { Token } from '../token/Token';
import { stripComments, stripWhiteSpace } from './API';
import { LintBag } from './LintBag';
import { LintResults } from './LintResults';
import { LintScopeClosureCheck } from './phase/lintScopeClosureCheck';
import { LintCheck } from './phase/LintCheck';
import { LintScopeRuleCheck } from './phase/LintScopeRuleCheck';

export class LintTest {
    readonly tests: LintCheck[] = [new LintScopeClosureCheck(), new LintScopeRuleCheck()];

    test(tokens: Token[]): LintResults {
        const bag = new LintBag(stripWhiteSpace(stripComments(tokens)));

        const results = { logs: [], pass: true };

        for (const test of this.tests) {
            bag.reset();
            test.onTest(bag, results);
            if (!results.pass) break;
        }

        return results;
    }
}

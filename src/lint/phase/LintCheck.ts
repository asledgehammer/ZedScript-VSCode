import { LintBag } from '../LintBag';
import { LintResults } from '../LintResults';

export abstract class LintCheck {
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    abstract onTest(bag: LintBag, results: LintResults): void;
}

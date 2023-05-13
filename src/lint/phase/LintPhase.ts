import { Token } from '../../token/Token';
import { LintResults } from '../LintResults';

export abstract class LintPhase {
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    abstract onTest(tokens: Token[], results: LintResults): void;
}

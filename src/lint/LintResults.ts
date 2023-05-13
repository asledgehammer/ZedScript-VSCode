import { LintLog } from './LintLog';

export type LintResults = {
    pass: boolean;
    logs: LintLog[];
};

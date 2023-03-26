import { FixerSkill } from './FixerSkill';

/**
 * *ScriptFixer*
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export type ScriptFixer = Fixer | undefined;

/**
 * *ScriptFixerArray*
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export type ScriptFixerArray = Fixer[] | undefined;

/**
 * **Fixer**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class Fixer {
    readonly item: string;
    readonly amount: number;
    skills: FixerSkill[] | undefined;

    constructor(item: string, amount: number) {
        this.item = item;
        this.amount = amount;
    }

    toScript(prefix = ''): string {
        let s = `${prefix}${this.item}`;
        if (this.amount !== 1) s += ` = ${this.amount}`;
        return s;
    }
}

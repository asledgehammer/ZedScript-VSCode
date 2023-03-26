/**
 * **EvolvedRecipe**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class EvolvedRecipe {
    name: string;
    amount: number;

    constructor(name: string, amount: number) {
        this.name = name;
        this.amount = amount;
    }

    toScript(prefix = ''): string {
        return `${prefix}${this.name}: ${this.amount}`;
    }
}

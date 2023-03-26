/**
 * **RecipeResult**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class RecipeResult {
    amount: number;
    item: string;

    constructor(item: string, amount: number) {
        this.item = item;
        this.amount = amount;
    }

    toScript(prefix: string, maxKeyLength: number = 'result'.length): string {
        return `${prefix}result${' '.repeat('result'.length - maxKeyLength)}: ${this.item} = ${this.amount}`;
    }
}

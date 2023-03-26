/**
 * **RecipeProp**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class RecipeProp {
    amount: number;
    item: string;

    constructor(item: string, amount: number) {
        this.item = item;
        this.amount = amount;
    }

    toScript(prefix = ''): string {
        if (this.amount === 1) {
            return `${prefix}${this.item}`;
        }
        return `${prefix}${this.item} = ${this.amount}`;
    }
}

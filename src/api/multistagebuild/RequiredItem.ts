/**
 * **RequiredItem**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class RequiredItem {
    item: string;
    amount: number;

    constructor(item: string, amount: number) {
        this.item = item;
        this.amount = amount;
    }

    toScript(prefix = ''): string {
        return `${prefix}${this.item} = ${this.amount}`;
    }
}

/**
 * **XPReward**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class XPReward {
    type: string;
    amount: number;

    constructor(type: string, amount: number) {
        this.type = type;
        this.amount = amount;
    }

    toScript(prefix = ''): string {
        return `${prefix}${this.type} = ${this.amount}`;
    }
}

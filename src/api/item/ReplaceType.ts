export class ItemReplaceType {
    a: string;
    b: string;

    constructor(a: string, b: string) {
        this.a = a;
        this.b = b;
    }

    toScript(prefix = ''): string {
        return `${prefix}${this.a} ${this.b}`;
    }
}

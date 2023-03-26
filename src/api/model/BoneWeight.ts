/**
 * **BoneWeight**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class BoneWeight {
    name: string;
    weight: number;

    constructor(name: string, weight: number) {
        this.name = name;
        this.weight = weight;
    }

    toScript(prefix = ''): string {
        return `${prefix}${this.name} ${this.weight}`;
    }
}

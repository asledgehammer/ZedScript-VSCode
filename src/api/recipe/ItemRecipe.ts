/**
 * **ItemRecipe**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class ItemRecipe {
    readonly name: string;
    readonly module: string;
    readonly use: number;

    constructor(name: string, module: string, use: number) {
        this.name = name;
        this.module = module;
        this.use = use;
    }
}

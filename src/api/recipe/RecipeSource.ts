import { RecipeAction } from './RecipeAction';
import { RecipeSourceItem } from './RecipeSourceItem';

/**
 * *ScriptRecipeSourceArray*
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export type ScriptRecipeSourceArray = RecipeSource[] | undefined;

/**
 * **RecipeSource**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class RecipeSource {
    items: RecipeSourceItem[];
    action: RecipeAction;

    constructor(items: RecipeSourceItem[], action: RecipeAction) {
        this.items = items;
        this.action = action;
    }

    toScript(prefix = '') {
        return `${prefix}${this.action} ${this.items
            .map((o) => {
                return o.toScript();
            })
            .join('; ')}`;
    }
}

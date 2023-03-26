import { ParseBag } from '../util/ParseBag';
import { getInt, getString, Script, ScriptInt, ScriptString } from '../Script';

/**
 * **UniqueRecipeScript**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class UniqueRecipeScript extends Script {
    baseRecipeItem: ScriptString;
    boredom: ScriptInt;
    hapiness: ScriptInt;
    item: ScriptString;

    constructor(bag: ParseBag) {
        super(bag, ':');
    }

    onPropertyValue(property: string, value: string): boolean {
        property = property.trim();
        value = value.trim();
        switch (property.toLowerCase()) {
            case 'baserecipeitem':
                this.baseRecipeItem = getString(value);
                return true;
            case 'boredom':
                this.boredom = getInt(value);
                return true;
            case 'hapiness':
                this.hapiness = getInt(value);
                return true;
            case 'item':
                this.item = getString(value);
                return true;
        }
        return false;
    }

    get label(): string {
        return 'uniquerecipe';
    }
}

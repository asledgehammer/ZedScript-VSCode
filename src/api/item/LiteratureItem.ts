import { getBoolean, getInt, getString, ScriptBoolean, ScriptInt, ScriptString } from '../Script';
import { ItemScript } from './ItemScript';
import { ParseBag } from '../util/ParseBag';
import { DelimiterArray, ScriptDelimiterArray } from '../util/Array';

/**
 * **LiteratureItem**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class LiteratureItem extends ItemScript {
    canBeWrite: ScriptBoolean;
    lvlSkillTrained: ScriptInt;
    numberOfPages: ScriptInt;
    numLevelsTrained: ScriptInt;
    pageToWrite: ScriptInt;
    skillTrained: ScriptString;
    teachedRecipes: ScriptDelimiterArray<string>;

    constructor(bag: ParseBag) {
        super(bag, '=', 'Literature');
    }

    onPropertyToken(_: ParseBag, __: string): boolean {
        return super.onPropertyToken(_, __);
    }

    onPropertyValue(property: string, value: string): boolean {
        property = property.trim();
        value = value.trim();
        switch (property.toLowerCase()) {
            case 'canbewrite':
                this.canBeWrite = getBoolean(value);
                return true;
            case 'lvlskilltrained':
                this.lvlSkillTrained = getInt(value);
                return true;
            case 'numberofpages':
                this.numberOfPages = getInt(value);
                return true;
            case 'numlevelstrained':
                this.numLevelsTrained = getInt(value);
                return true;
            case 'pagetowrite':
                this.pageToWrite = getInt(value);
                return true;
            case 'skilltrained':
                this.skillTrained = getString(value);
                return true;
            case 'teachedrecipes':
                this.teachedRecipes = new DelimiterArray(';', getString(value));
                return true;
        }
        return super.onPropertyValue(property, value);
    }
}

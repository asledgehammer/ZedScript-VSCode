import { getInt, getString, ScriptInt, ScriptString } from '../Script';
import { ItemScript } from './ItemScript';
import { ParseBag } from '../util/ParseBag';
import { DelimiterArray, ScriptDelimiterArray } from '../util/Array';

/**
 * **ContainerItem**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class ContainerItem extends ItemScript {
    canBeEquipped: ScriptString;
    capacity: ScriptInt;
    closeSound: ScriptString;
    onlyAcceptCategory: ScriptString;
    openSound: ScriptString;
    putInSound: ScriptString;
    soundParameter: ScriptDelimiterArray<string>;
    weightReduction: ScriptInt;

    constructor(bag: ParseBag) {
        super(bag, '=', 'Container');
    }

    onPropertyToken(bag: ParseBag, property: string): boolean {
        return super.onPropertyToken(bag, property);
    }

    onPropertyValue(property: string, value: string): boolean {
        property = property.trim();
        value = value.trim();
        switch (property.toLowerCase()) {
            case 'canbeequipped':
                this.canBeEquipped = getString(value);
                return true;
            case 'capacity':
                this.capacity = getInt(value);
                return true;
            case 'closesound':
                this.closeSound = getString(value);
                return true;
            case 'onlyacceptcategory':
                this.onlyAcceptCategory = getString(value);
                return true;
            case 'opensound':
                this.openSound = getString(value);
                return true;
            case 'putinsound':
                this.putInSound = getString(value);
                return true;
            case 'soundparameter':
                this.soundParameter = new DelimiterArray(' ', getString(value));
                return true;
            case 'weightreduction':
                this.weightReduction = getInt(value);
                return true;
        }
        return super.onPropertyValue(property, value);
    }
}

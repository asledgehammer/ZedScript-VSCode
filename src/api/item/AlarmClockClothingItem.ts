import { getInt, getString, ScriptInt, ScriptString } from '../Script';
import { ClothingItem } from './ClothingItem';
import { ParseBag } from '../util/ParseBag';

/**
 * **AlarmClockClothingItem**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class AlarmClockClothingItem extends ClothingItem {
    alarmSound: ScriptString;
    soundRadius: ScriptInt;

    constructor(bag: ParseBag) {
        super(bag, 'AlarmClockClothing');
    }

    onPropertyToken(bag: ParseBag, property: string): boolean {
        return super.onPropertyToken(bag, property);
    }

    onPropertyValue(property: string, value: string): boolean {
        property = property.trim();
        value = value.trim();
        switch (property.toLowerCase()) {
            case 'alarmsound':
                this.alarmSound = getString(value);
                return true;
            case 'soundradius':
                this.soundRadius = getInt(value);
                return true;
        }
        return super.onPropertyValue(property, value);
    }
}

import { getBoolean, ScriptBoolean } from '../Script';
import { ItemScript } from './ItemScript';
import { ParseBag } from '../util/ParseBag';

/**
 * **KeyItem**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class KeyItem extends ItemScript {
    digitalPadlock: ScriptBoolean;
    padlock: ScriptBoolean;

    constructor(bag: ParseBag) {
        super(bag, '=', 'Key');
    }

    onPropertyToken(_: ParseBag, __: string): boolean {
        return super.onPropertyToken(_, __);
    }

    onPropertyValue(property: string, value: string): boolean {
        property = property.trim();
        value = value.trim();
        switch (property.toLowerCase()) {
            case 'digitalpadlock':
                this.digitalPadlock = getBoolean(value);
                return true;
            case 'padlock':
                this.padlock = getBoolean(value);
                return true;
        }
        return super.onPropertyValue(property, value);
    }
}

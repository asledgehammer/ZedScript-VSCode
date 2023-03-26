import { getString, ScriptString } from '../Script';
import { ItemScript } from './ItemScript';
import { ParseBag } from '../util/ParseBag';

/**
 * **MapItem**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class MapItem extends ItemScript {
    map: ScriptString;

    constructor(bag: ParseBag) {
        super(bag, '=', 'Map');
    }

    onPropertyToken(_: ParseBag, __: string): boolean {
        return super.onPropertyToken(_, __);
    }

    onPropertyValue(property: string, value: string): boolean {
        property = property.trim();
        value = value.trim();
        switch (property.toLowerCase()) {
            case 'map':
                this.map = getString(value);
                return true;
        }
        return super.onPropertyValue(property, value);
    }
}

import { ParseBag } from '../util/ParseBag';
import { ItemScript } from './ItemScript';

/**
 * **KeyRingItem**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class KeyRingItem extends ItemScript {
    constructor(bag: ParseBag) {
        super(bag, '=', 'KeyRing');
    }

    onPropertyToken(_: ParseBag, __: string): boolean {
        return super.onPropertyToken(_, __);
    }

    onPropertyValue(property: string, value: string): boolean {
        return super.onPropertyValue(property, value);
    }
}

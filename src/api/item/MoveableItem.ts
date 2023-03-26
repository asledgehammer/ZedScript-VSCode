import { ParseBag } from '../util/ParseBag';
import { ItemScript } from './ItemScript';

/**
 * **MoveableItem**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class MoveableItem extends ItemScript {
    constructor(bag: ParseBag) {
        super(bag, '=', 'Moveable');
    }

    onPropertyToken(_: ParseBag, __: string): boolean {
        return super.onPropertyToken(_, __);
    }

    onPropertyValue(property: string, value: string): boolean {
        return super.onPropertyValue(property, value);
    }
}

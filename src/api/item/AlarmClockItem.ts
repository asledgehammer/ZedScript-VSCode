import { ParseBag } from '../util/ParseBag';
import { ItemScript } from './ItemScript';

/**
 * **AlarmClockItem**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class AlarmClockItem extends ItemScript {
    constructor(bag: ParseBag) {
        super(bag, '=', 'AlarmClock');
    }

    onPropertyToken(bag: ParseBag, property: string): boolean {
        return super.onPropertyToken(bag, property);
    }

    onPropertyValue(property: string, value: string): boolean {
        return super.onPropertyValue(property, value);
    }
}

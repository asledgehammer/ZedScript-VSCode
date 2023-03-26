import { ParseBag } from '../util/ParseBag';
import { Script } from '../Script';
import { VehicleItem } from './VehicleItem';

/**
 * **VehicleItems**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehicleItems extends Script {
    items: VehicleItem[] | undefined;

    constructor(bag: ParseBag) {
        super(bag, '=', false, true);
        this.parse(bag);
    }

    onPropertyToken(bag: ParseBag, property: string): boolean {
        if (this.items === undefined) this.items = [];
        this.items.push(new VehicleItem(bag, property));
        return true;
    }

    get label(): string {
        return 'items';
    }
}

import { Script } from '../Script';
import { ParseBag } from '../util/ParseBag';

/**
 * **VehicleDoor**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehicleDoor extends Script {
    constructor(bag: ParseBag) {
        super(bag, '=', false, true);
        this.parse(bag);
    }

    get label(): string {
        return 'door';
    }
}

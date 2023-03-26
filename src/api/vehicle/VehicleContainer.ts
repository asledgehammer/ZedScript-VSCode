import { getBoolean, getInt, getString, Script, ScriptBoolean, ScriptInt, ScriptString } from '../Script';
import { ParseBag } from '../util/ParseBag';

/**
 * **VehicleContainer**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehicleContainer extends Script {
    capacity: ScriptInt;
    conditionAffectsCapacity: ScriptBoolean;
    contentType: ScriptString;
    seat: ScriptString;
    test: ScriptString;

    constructor(bag: ParseBag) {
        super(bag, '=', false, true);
        this.parse(bag);
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase().trim()) {
            case 'capacity':
                this.capacity = getInt(value);
                return true;
            case 'conditionaffectscapacity':
                this.conditionAffectsCapacity = getBoolean(value);
                return true;
            case 'contenttype':
                this.contentType = getString(value);
                return true;
            case 'seat':
                this.seat = getString(value);
                return true;
            case 'test':
                this.test = getString(value);
                return true;
        }
        return false;
    }

    get label(): string {
        return 'container';
    }
}

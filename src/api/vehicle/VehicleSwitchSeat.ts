import { getFloat, getString, Script, ScriptFloat, ScriptString } from '../Script';
import { ParseBag } from '../util/ParseBag';

/**
 * **VehicleSwitchSeat**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehicleSwitchSeat extends Script {
    anim: ScriptString;
    rate: ScriptFloat;
    sound: ScriptString;

    constructor(bag: ParseBag) {
        super(bag, '=', false);
        this.parse(bag);
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase().trim()) {
            case 'anim':
                this.anim = getString(value);
                return true;
            case 'rate':
                this.rate = getFloat(value);
                return true;
            case 'sound':
                this.sound = getString(value);
                return true;
        }
        return false;
    }

    get label(): string {
        return 'switchseat';
    }
}

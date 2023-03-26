import { ParseBag } from '../util/ParseBag';
import { getString, Script, ScriptString } from '../Script';

/**
 * **VehicleSound**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehicleSound extends Script {
    backSignal: ScriptString;
    engine: ScriptString;
    engineStart: ScriptString;
    engineTurnOff: ScriptString;
    horn: ScriptString;
    ignitionFail: ScriptString;

    constructor(bag: ParseBag) {
        super(bag, '=', false, true);
        this.parse(bag);
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.trim().toLowerCase()) {
            case 'backsignal':
                this.backSignal = getString(value);
                return true;
            case 'engine':
                this.engine = getString(value);
                return true;
            case 'enginestart':
                this.engineStart = getString(value);
                return true;
            case 'engineturnoff':
                this.engineTurnOff = getString(value);
                return true;
            case 'horn':
                this.horn = getString(value);
                return true;
            case 'ignitionfail':
                this.ignitionFail = getString(value);
                return true;
        }
        return false;
    }

    get label(): string {
        return 'sound';
    }
}

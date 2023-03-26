import { getInt, Script, ScriptInt } from '../Script';
import { ParseBag } from '../util/ParseBag';

/**
 * **VehicleEngineData**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehicleEngineData extends Script {
    afterGearChange: ScriptInt;
    gearChange: ScriptInt;

    constructor(bag: ParseBag) {
        super(bag, '=', false, true);

        this.parse(bag);
    }

    onPropertyValue(property: string, value: string): boolean {
        property = property.trim();
        value = value.trim();
        switch (property.toLowerCase()) {
            case 'aftergearchange':
                this.afterGearChange = getInt(value);
                return true;
            case 'gearchange':
                this.gearChange = getInt(value);
                return true;
        }
        return false;
    }

    get label(): string {
        return 'data';
    }
}

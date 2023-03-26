import { getBoolean, Script, ScriptBoolean } from '../Script';
import { ParseBag } from '../util/ParseBag';

/**
 * **VehicleWindow**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehicleWindow extends Script {
    openable: ScriptBoolean;

    constructor(bag: ParseBag) {
        super(bag, '=', false, true);
        this.parse(bag);
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase().trim()) {
            case 'openable':
                this.openable = getBoolean(value);
                return true;
        }
        return false;
    }

    get label(): string {
        return 'window';
    }
}

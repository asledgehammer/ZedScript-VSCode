import { getBoolean, getInt, getString, Script, ScriptBoolean, ScriptInt, ScriptString } from '../Script';
import { ParseBag } from '../util/ParseBag';

/**
 * **VehicleItem**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehicleItem extends Script {
    count: ScriptInt;
    equip: ScriptString;
    keep: ScriptBoolean;
    type: ScriptString;

    constructor(bag: ParseBag, name: string) {
        super(bag, '=', false, true);
        this.__name = name;
        this.parse(bag);
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase().trim()) {
            case 'count':
                this.count = getInt(value);
                return true;
            case 'equip':
                this.equip = getString(value);
                return true;
            case 'keep':
                this.keep = getBoolean(value);
                return true;
            case 'type':
                this.type = getString(value);
                return true;
        }
        return false;
    }

    get label(): string {
        return '';
    }
}

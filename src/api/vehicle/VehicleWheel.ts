import { getVector3, ScriptVector3 } from '../util/Math';
import { getBoolean, getFloat, Script, ScriptBoolean, ScriptFloat } from '../Script';
import { ParseBag } from '../util/ParseBag';

/**
 * **VehicleWheel**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehicleWheel extends Script {
    front: ScriptBoolean;
    offset: ScriptVector3;
    radius: ScriptFloat;
    width: ScriptFloat;

    constructor(bag: ParseBag) {
        super(bag, '=', false);
        this.parse(bag);
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase().trim()) {
            case 'front':
                this.front = getBoolean(value);
                return true;
            case 'offset':
                this.offset = getVector3(value);
                return true;
            case 'radius':
                this.radius = getFloat(value);
                return true;
            case 'width':
                this.width = getFloat(value);
                return true;
        }
        return false;
    }

    get label(): string {
        return 'wheel';
    }
}

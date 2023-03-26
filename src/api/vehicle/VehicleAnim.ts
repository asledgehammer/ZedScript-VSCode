import { getVector3, ScriptVector3 } from '../util/Math';
import { getBoolean, getFloat, getString, Script, ScriptBoolean, ScriptFloat, ScriptString } from '../Script';
import { ParseBag } from '../util/ParseBag';

/**
 * **VehicleAnim**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehicleAnim extends Script {
    angle: ScriptVector3;
    anim: ScriptString;
    animate: ScriptBoolean;
    rate: ScriptFloat;
    reverse: ScriptBoolean;
    sound: ScriptString;

    constructor(bag: ParseBag) {
        super(bag, '=', false);
        this.parse(bag);
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase().trim()) {
            case 'angle':
                this.angle = getVector3(value);
                return true;
            case 'anim':
                this.anim = getString(value);
                return true;
            case 'animate':
                this.animate = getBoolean(value);
                return true;
            case 'rate':
                this.rate = getFloat(value);
                return true;
            case 'reverse':
                this.reverse = getBoolean(value);
                return true;
            case 'sound':
                this.sound = getString(value);
                return true;
        }
        return false;
    }

    get label(): string {
        return 'anim';
    }
}

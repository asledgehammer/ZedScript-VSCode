import { getVector3, ScriptVector3 } from '../util/Math';
import { ParseBag } from '../util/ParseBag';
import { getFloat, Script, ScriptFloat } from '../Script';

/**
 * **VehiclePhysics**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehiclePhysics extends Script {
    extents: ScriptVector3;
    offset: ScriptVector3;
    radius: ScriptFloat;
    rotate: ScriptVector3;

    constructor(bag: ParseBag) {
        super(bag, '=', false);
        this.parse(bag);
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.trim().toLowerCase()) {
            case 'extents':
                this.extents = getVector3(value);
                return true;
            case 'offset':
                this.offset = getVector3(value);
                return true;
            case 'radius':
                this.radius = getFloat(value);
                return true;
            case 'rotate':
                this.rotate = getVector3(value);
                return true;
        }
        return false;
    }

    get label(): string {
        return 'physics';
    }
}

import { getVector3, ScriptVector3 } from '../util/Math';
import { getString, Script, ScriptString } from '../Script';
import { ParseBag } from '../util/ParseBag';

/**
 * **VehiclePosition**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehiclePosition extends Script {
    area: ScriptString;
    offset: ScriptVector3;
    rotate: ScriptVector3;

    constructor(bag: ParseBag) {
        super(bag, '=', false);
        this.parse(bag);
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase().trim()) {
            case 'area':
                this.area = getString(value);
                return true;
            case 'offset':
                this.offset = getVector3(value);
                return true;
            case 'rotate':
                this.offset = getVector3(value);
                return true;
        }
        return false;
    }

    get label(): string {
        return 'position';
    }
}

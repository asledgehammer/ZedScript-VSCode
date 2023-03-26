import { ParseBag } from '../util/ParseBag';
import { getFloat, getURI, Script, ScriptFloat, ScriptString } from '../Script';
import { getVector3, ScriptVector3 } from '../util/Math';

/**
 * **VehiclePartModel**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehiclePartModel extends Script {
    file: ScriptString;
    offset: ScriptVector3;
    rotate: ScriptVector3;
    scale: ScriptFloat;

    constructor(bag: ParseBag) {
        super(bag, '=', false);
        this.parse(bag);
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase()) {
            case 'file':
                this.file = getURI(value);
                return true;
            case 'scale':
                this.scale = getFloat(value);
                return true;
            case 'offset':
                this.offset = getVector3(value);
                return true;
            case 'rotate':
                this.rotate = getVector3(value);
                return true;
        }
        return false;
    }

    get label(): string {
        return 'model';
    }
}

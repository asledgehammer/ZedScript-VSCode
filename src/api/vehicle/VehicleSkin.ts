import { ParseBag } from '../util/ParseBag';
import { getURI, Script, ScriptString } from '../Script';

/**
 * **VehicleSkin**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehicleSkin extends Script {
    texture: ScriptString;

    constructor(bag: ParseBag) {
        super(bag, '=', false, true);
        this.parse(bag);
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.trim().toLowerCase()) {
            case 'texture':
                this.texture = getURI(value).trim();
                return true;
        }
        return false;
    }

    get label(): string {
        return 'skin';
    }
}

import { DelimiterArray, ScriptDelimiterArray } from '../util/Array';
import { getFloat, getString, Script, ScriptFloatArray, ScriptString } from '../Script';
import { ParseBag } from '../util/ParseBag';

/**
 * **VehicleLightBar**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehicleLightBar extends Script {
    leftCol: ScriptDelimiterArray<number>;
    rightCol: ScriptDelimiterArray<number>;
    soundSiren: ScriptString;
    texture: ScriptString;

    constructor(bag: ParseBag) {
        super(bag, '=', false, true);
        this.parse(bag);
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase().trim()) {
            case 'leftcol':
                this.leftCol = new DelimiterArray(';');
                getString(value)
                    .split(';')
                    .forEach((o) => {
                        this.leftCol!.values.push(getFloat(o.trim()));
                    });
                return true;
            case 'rightcol':
                this.rightCol = new DelimiterArray(';');
                getString(value)
                    .split(';')
                    .forEach((o) => {
                        this.rightCol!.values.push(getFloat(o.trim()));
                    });
                return true;
            case 'soundsiren':
                this.soundSiren = getString(value);
                return true;
            case 'texture':
                this.texture = getString(value);
                return true;
        }
        return false;
    }

    get label(): string {
        return 'lightbar';
    }
}

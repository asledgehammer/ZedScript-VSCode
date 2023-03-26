import { ParseBag } from '../util/ParseBag';
import { getInt, getString, Script, ScriptInt, ScriptString } from '../Script';
import { getVector3, ScriptVector3 } from '../util/Math';

/**
 * **ModelAttachment**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class Attachment extends Script {
    bone: ScriptString;
    offset: ScriptVector3;
    rotate: ScriptVector3;
    zOffset: ScriptInt;

    constructor(bag: ParseBag) {
        super(bag, '=');
    }

    onPropertyValue(property: string, value: string): boolean {
        property = property.trim();
        value = value.trim();
        switch (property.toLowerCase()) {
            case 'bone':
                this.bone = getString(value);
                return true;
            case 'offset':
                this.offset = getVector3(value);
                return true;
            case 'rotate':
                this.rotate = getVector3(value);
                return true;
            case 'zoffset':
                this.zOffset = getInt(value);
                return true;
        }
        return false;
    }

    get label(): string {
        return 'attachment';
    }
}

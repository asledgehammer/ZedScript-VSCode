import { getInt, getString, ScriptInt, ScriptString } from '../Script';
import { ParseBag } from '../util/ParseBag';
import { Script } from '../Script';

/**
 * *ScriptCopyFrameArray*
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export type ScriptCopyFrameArray = CopyFrame[] | undefined;

/**
 * **CopyFrame**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class CopyFrame extends Script {
    frame: ScriptInt;
    source: ScriptString;
    sourceFrame: ScriptInt;

    constructor(bag: ParseBag) {
        super(bag, '=', false, true);
        this.parse(bag);
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase().trim()) {
            case 'frame':
                this.frame = getInt(value);
                return true;
            case 'source':
                this.source = getString(value);
                return true;
            case 'sourceframe':
                this.sourceFrame = getInt(value);
                return true;
        }
        return false;
    }

    get label(): string {
        return 'copyframe';
    }
}

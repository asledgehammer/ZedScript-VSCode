import { getInt, getString, ScriptInt, ScriptString } from '../Script';
import { ParseBag } from '../util/ParseBag';
import { Script } from '../Script';

/**
 * *ScriptCopyFramesArray*
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export type ScriptCopyFramesArray = CopyFrames[] | undefined;

/**
 * **CopyFrames**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class CopyFrames extends Script {
    frame: ScriptInt;
    source: ScriptString;
    sourceFrame1: ScriptInt;
    sourceFrame2: ScriptInt;

    constructor(bag: ParseBag) {
        super(bag, '=', false, true);
        this.parse(bag);
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.trim().toLowerCase()) {
            case 'frame':
                this.frame = getInt(value);
                return true;
            case 'source':
                this.source = getString(value);
                return true;
            case 'sourceframe1':
                this.sourceFrame1 = getInt(value);
                return true;
            case 'sourceframe2':
                this.sourceFrame2 = getInt(value);
                return true;
        }
        return false;
    }

    get label(): string {
        return 'copyframes';
    }
}

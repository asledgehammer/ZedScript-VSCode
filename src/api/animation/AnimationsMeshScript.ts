import { ParseBag } from '../util/ParseBag';
import { getString, Script, ScriptString } from '../Script';

/**
 * **AnimationsMeshScript**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class AnimationsMeshScript extends Script {
    meshFile: ScriptString;
    animationDirectory: ScriptString;

    constructor(bag: ParseBag) {
        super(bag, '=');
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase()) {
            case 'meshfile':
                this.meshFile = getString(value);
                return true;
            case 'animationdirectory':
                this.animationDirectory = getString(value);
                return true;
        }
        return false;
    }

    get label(): string {
        return 'animationsmesh';
    }
}

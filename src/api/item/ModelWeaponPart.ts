/**
 * *ScriptModelWeaponPart*
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export type ScriptModelWeaponPart = ModelWeaponPart | undefined;

/**
 * **ModelWeaponPart**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class ModelWeaponPart {
    partType: string;
    modelName: string;
    attachmentNameSelf: string;
    attachmentParent: string;

    constructor(partType: string, modelName: string, attachmentNameSelf: string, attachmentParent: string) {
        this.partType = partType;
        this.modelName = modelName;
        this.attachmentNameSelf = attachmentNameSelf;
        this.attachmentParent = attachmentParent;
    }

    toScript(prefix = ''): string {
        return `${this.partType} ${this.modelName} ${this.attachmentNameSelf} ${this.attachmentParent}`;
    }
}

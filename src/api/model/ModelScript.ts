/* eslint-disable no-case-declarations */
import { ParseBag } from '../util/ParseBag';
import { BoneWeight } from './BoneWeight';
import { getBoolean, getFloat, getString, getURI, Script, ScriptBoolean, ScriptFloat, ScriptString } from '../Script';
import { Attachment } from './ModelAttachment';
import { DelimiterArray, ScriptDelimiterArray } from '../util/Array';

/**
 * **ModelScript**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class ModelScript extends Script {
    animationsMesh: ScriptString;
    attachments: Attachment[] | undefined;
    boneWeight: ScriptDelimiterArray<BoneWeight>;
    invertX: ScriptBoolean;
    mesh: ScriptString;
    scale: ScriptFloat;
    shader: ScriptString;
    static: ScriptBoolean;
    texture: ScriptString;

    constructor(bag: ParseBag) {
        super(bag, '=');
    }

    onPropertyToken(bag: ParseBag, property: string): boolean {
        switch (property.toLowerCase()) {
            case 'attachment':
                if (this.attachments == null) this.attachments = [];
                this.attachments.push(new Attachment(bag));

                return true;
        }
        return false;
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase()) {
            case 'animationsmesh':
                this.animationsMesh = getString(value);
                return true;
            case 'boneweight':
                this.boneWeight = new DelimiterArray(' ');
                const raw = getString(value)?.trim();
                if (raw == null) return true;

                if (raw.indexOf(' ') !== -1) {
                    const split = raw.split(' ');
                    this.boneWeight.values.push(new BoneWeight(split[0], parseFloat(split[1])));
                } else {
                    this.boneWeight.values.push(new BoneWeight(raw, 1.0));
                }
                return true;
            case 'invertx':
                this.invertX = getBoolean(value);
                return true;
            case 'mesh':
                this.mesh = getURI(value);
                return true;
            case 'scale':
                this.scale = getFloat(value);
                return true;
            case 'shader':
                this.shader = getURI(value);
                return true;
            case 'static':
                this.static = getBoolean(value);
                return true;
            case 'texture':
                this.texture = getURI(value);
                return true;
        }
        return false;
    }

    get label(): string {
        return 'model';
    }
}

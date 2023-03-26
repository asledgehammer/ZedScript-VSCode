import { ParseBag } from '../util/ParseBag';
import { getBoolean, getInt, getString, Script, ScriptBoolean, ScriptInt, ScriptString } from '../Script';
import { SoundClip } from './SoundClip';
import { DelimiterArray, ScriptDelimiterArray } from '../util/Array';

/**
 * *MasterVolume*
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export type MasterVolume = 'Primary' | 'Ambient' | 'Music' | 'VehicleEngine';

/**
 * *ScriptMasterVolume*
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export type ScriptMasterVolume = MasterVolume | undefined;

/**
 * *ScriptSoundClip*
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export type ScriptSoundClip = SoundClip | undefined;

/**
 * **SoundScript**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class SoundScript extends Script {
    category: ScriptString;
    is3D: ScriptBoolean;
    loop: ScriptBoolean;
    master: ScriptMasterVolume;
    maxInstancesPerEmitter: ScriptInt;
    clips: SoundClip[] | undefined;

    constructor(bag: ParseBag) {
        super(bag, '=');
    }

    onPropertyToken(bag: ParseBag, property: string): boolean {
        switch (property.toLowerCase()) {
            case 'clip':
                if (this.clips === undefined) this.clips = [];
                this.clips.push(new SoundClip(bag));
                return true;
        }
        return false;
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase()) {
            case 'category':
                this.category = getString(value);
                return true;
            case 'is3d':
                this.is3D = getBoolean(value);
                return true;
            case 'loop':
                this.loop = getBoolean(value);
                return true;
            case 'master':
                this.master = getString(value) as MasterVolume;
                return true;
            case 'maxinstancesperemitter':
                this.maxInstancesPerEmitter = getInt(value);
                return true;
        }
        return false;
    }

    toJSON(): any {
        const o: any = {};
        const thisKeys: string[] = Object.keys(this);

        /* (Sort all keys alphanumerically) */
        thisKeys.sort((a, b) => a.localeCompare(b));

        for (const key of thisKeys) {
            if (key === 'ignoreProperties') continue;

            /* (Ignore keys that specific objects define) */
            if (this.ignoreProperties[key]) continue;

            /* (Only add custom properties if populated) */
            if (key === 'customProperties' && Object.keys(this.__properties!).length === 0) {
                continue;
            }

            if (key === 'clips') {
                o['clips'] = this.clips!.map((p) => {
                    return p.toJSON();
                });
            }

            /* (Add property to the exported JSON object) */
            o[key as string] = (this as any)[key];
        }
        return o;
    }

    toScript(prefix = ''): string {
        let s = `${prefix}`;
        if (this.label !== '') s += `${this.label} `;
        if (this.__name !== undefined) {
            if (this.__name === '') {
                throw new Error(`The name of the object is empty: ${this.label}`);
            }
            s += `${this.__name} `;
        }
        s += '{\n\n';

        const maxLenKey = this.getMaxLengthKey();
        const { __operator: operator } = this;

        function processValue(key: string, value: any) {
            if (Array.isArray(value)) {
                processArray(key, value);
            } else if (typeof value === 'object') {
                if (value.toScript === undefined) {
                    throw new Error(`Key '${key}': Object doesn't have 'toScript(): '${value.constructor.name}'`);
                }
                s += `${prefix}    ${key + ' '.repeat(maxLenKey - key.length)} ${operator} ${value.toScript()},\n`;
            } else {
                s += `${prefix}    ${key + ' '.repeat(maxLenKey - key.length)} ${operator} ${value.toString()},\n`;
            }
        }

        function processArray(key: string, array: any[]) {
            s += `${prefix}    ${key + ' '.repeat(maxLenKey - key.length)} ${operator} `;
            for (let index = 0; index < array.length; index++) {
                const value = array[index];
                processValue(`${index}`, value);
            }
        }

        function processDictionary(dict: { [name: string]: any }) {
            const keys = Object.keys(dict);
            keys.sort((a, b) => a.localeCompare(b));
            for (const key of keys) {
                if (key === '__name') continue;
                if (key === '__properties') continue;
                if (key === '__operator') continue;
                if (key === 'ignoreProperties') continue;
                if (key === 'clips') continue;

                const value = dict[key];
                processValue(key, value);
            }
        }

        processDictionary(this);

        if (this.clips !== undefined) {
            for (const clip of this.clips) {
                s += '\n' + clip.toScript(`${prefix}    `);
            }
        }

        if (this.__properties !== undefined) {
            s += `\n${prefix}    /* Custom Properties */\n\n`;
            processDictionary(this.__properties);
        }

        const result = `${s}\n${prefix}}\n`;
        return result;
    }

    get label(): string {
        return 'sound';
    }
}

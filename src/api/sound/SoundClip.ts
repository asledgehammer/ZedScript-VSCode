import { ParseBag } from '../util/ParseBag';
import { getFloat, getInt, getString, Script, ScriptFloat, ScriptInt, ScriptString } from '../Script';
import { DelimiterArray, ScriptDelimiterArray } from '../util/Array';

/**
 * **SoundClip**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class SoundClip extends Script {
    distanceMin: ScriptInt;
    distanceMax: ScriptInt;
    events: ScriptDelimiterArray<string>;
    file: ScriptString;
    pitch: ScriptFloat;
    volume: ScriptFloat;
    reverbFactor: ScriptFloat;
    reverbMaxRange: ScriptFloat;

    constructor(bag: ParseBag) {
        super(bag, '=', true, true);
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase()) {
            case 'distancemin':
                this.distanceMin = getInt(value);
                return true;
            case 'distancemax':
                this.distanceMax = getInt(value);
                return true;
            case 'event':
                this.events = new DelimiterArray('/', getString(value));
                return true;
            case 'file':
                this.file = getString(value);
                return true;
            case 'pitch':
                this.pitch = getFloat(value);
                return true;
            case 'volume':
                this.volume = getFloat(value);
                return true;
            case 'reverbfactor':
                this.reverbFactor = getFloat(value);
                return true;
            case 'reverbmaxrange':
                this.reverbMaxRange = getFloat(value);
                return true;
        }
        return false;
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
                if (key === 'events') continue;

                const value = dict[key];
                processValue(key, value);
            }
        }

        processDictionary(this);

        if (this.events !== undefined) {
            s += `${prefix}    events = `;
            for (const event of this.events.values) {
                s += `${event} / `;
            }
            s = s.substring(0, s.length - 2) + '\n';
        }

        if (this.__properties !== undefined) {
            s += `\n${prefix}    /* Custom Properties */\n\n`;
            processDictionary(this.__properties);
        }

        const result = `${s}\n${prefix}}\n`;
        return result;
    }

    get label(): string {
        return 'clip';
    }
}

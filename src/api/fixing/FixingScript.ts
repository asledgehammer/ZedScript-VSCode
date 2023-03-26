import { Fixer, ScriptFixer, ScriptFixerArray } from './Fixer';
import { getFloat, getString, Script, ScriptFloat, ScriptStringArray } from '../Script';
import { FixerSkill } from './FixerSkill';
import { ParseBag } from '../util/ParseBag';

/**
 * **FixingScript**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class FixingScript extends Script {
    require: ScriptStringArray;
    fixers: ScriptFixerArray;
    globalItem: ScriptFixer;
    conditionModifier: ScriptFloat;

    constructor(bag: ParseBag) {
        super(bag, ':');
    }

    onPropertyValue(property: string, value: string): boolean {
        let raw: string | null | undefined;
        let split: string[] = [];

        switch (property.toLowerCase()) {
            case 'require':
                this.require = getString(value)?.split(';');
                return true;
            case 'conditionmodifier':
                this.conditionModifier = getFloat(value);
                return true;
            case 'globalitem':
                raw = getString(value)!;
                if (raw.indexOf('=') !== -1) {
                    const split = raw.split('=');
                    const item = split[0];
                    const amount = parseInt(split[1].trim());
                    this.globalItem = new Fixer(item, amount);
                } else {
                    this.globalItem = new Fixer(raw.trim(), 1);
                }
                return true;
            case 'fixer':
                if (this.fixers == null) this.fixers = [];
                raw = getString(value);
                if (raw == null) return true;

                if (raw.indexOf(';') !== -1) {
                    split = raw.split(';');

                    for (const entry of split) {
                        if (entry.indexOf('=') !== -1) {
                            const split = entry.split('=');
                            const item = split[0].trim();
                            const amount = parseInt(split[1].trim());
                            this.fixers.push(new Fixer(item, amount));
                        } else {
                            this.fixers.push(new Fixer(entry.trim(), 1));
                        }
                    }
                } else {
                    split = raw.split(';');

                    let item = '';
                    let amount = 1;

                    if (raw.indexOf('=') !== -1) {
                        const ssplit = split[0].split('=');
                        item = ssplit[0].trim();
                        amount = parseInt(ssplit[1].trim());
                    } else {
                        item = raw;
                    }

                    const fixer = new Fixer(item, amount);

                    for (let index = 1; index < split.length; index++) {
                        const ssplit = split[index].split('=');

                        const skill = ssplit[0].trim();
                        const level = parseInt(ssplit[1].trim());

                        if (fixer.skills == null) fixer.skills = [];
                        fixer.skills.push(new FixerSkill(skill, level));
                    }

                    this.fixers.push(fixer);
                }
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
                if (key === 'fixers') continue;
                if (key === 'require') continue;

                const value = dict[key];
                processValue(key, value);
            }
        }

        if (this.require !== undefined) {
            s += `${prefix}    require${' '.repeat(maxLenKey - 'require'.length)}: ${this.require},\n`;
        }

        if (this.fixers !== undefined) {
            for (const fixer of this.fixers) {
                s += `${prefix}    fixer${' '.repeat(maxLenKey - 'fixer'.length)}: ${fixer.toScript()},\n`;
            }
        }

        processDictionary(this);

        if (this.__properties !== undefined) {
            s += `${prefix}\n/* Custom Properties */\n\n`;
            processDictionary(this.__properties);
        }

        const result = `${s}\n${prefix}}\n`;
        return result;
    }

    get label(): string {
        return 'fixing';
    }
}

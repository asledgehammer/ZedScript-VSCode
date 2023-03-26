import {
    getBoolean,
    getInt,
    getString,
    Script,
    ScriptBoolean,
    ScriptInt,
    ScriptString,
    ScriptStringArray,
} from '../Script';
import { ParseBag } from '../util/ParseBag';
import { VehicleItems } from './VehicleItems';
import { VehicleItem } from './VehicleItem';
import { DelimiterArray, ScriptDelimiterArray } from '../util/Array';

/**
 * **VehicleTable**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehicleTable extends Script {
    area: ScriptString;
    complete: ScriptString;
    door: ScriptString;
    items: VehicleItem[] | undefined;
    mechanicRequireKey: ScriptBoolean;
    professions: ScriptString;
    recipes: ScriptDelimiterArray<string>;
    requireEmpty: ScriptBoolean;
    requireInstalled: ScriptDelimiterArray<string>;
    requireUninstalled: ScriptDelimiterArray<string>;
    skills: ScriptString;
    test: ScriptString;
    time: ScriptInt;
    traits: ScriptString;

    constructor(bag: ParseBag) {
        super(bag, '=', false);
        this.parse(bag);
    }

    onPropertyToken(bag: ParseBag, property: string): boolean {
        switch (property.toLowerCase().trim()) {
            case 'items':
                this.items = new VehicleItems(bag).items;
                return true;
        }
        return false;
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase().trim()) {
            case 'area':
                this.area = getString(value);
                return true;
            case 'complete':
                this.complete = getString(value);
                return true;
            case 'door':
                this.door = getString(value);
                return true;
            case 'mechanicrequirekey':
                this.mechanicRequireKey = getBoolean(value);
                return true;
            case 'professions':
                this.professions = getString(value);
                return true;
            case 'recipes':
                this.recipes = new DelimiterArray(';', getString(value));
                return true;
            case 'requireempty':
                this.requireEmpty = getBoolean(value);
                return true;
            case 'requireinstalled':
                this.requireInstalled = new DelimiterArray(';', getString(value));
                return true;
            case 'requireuninstalled':
                this.requireUninstalled = new DelimiterArray(';', getString(value));
                return true;
            case 'skills':
                this.skills = getString(value);
                return true;
            case 'test':
                this.test = getString(value);
                return true;
            case 'time':
                this.time = getInt(value);
                return true;
            case 'traits':
                this.traits = getString(value);
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

                /* Table Objects */
                if (key === 'items') continue;

                const value = dict[key];
                processValue(key, value);
            }
        }

        processDictionary(this);

        let hasNewLined = false;

        /* Items */
        if (this.items !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            s += `${prefix}    items {\n\n`;
            for (const item of this.items) {
                s += item.toScript(`${prefix}        `) + '\n';
            }
            s += `${prefix}    }\n`;
        }

        // /* Recipes */
        // if (this.recipes !== undefined) {
        //     if (!hasNewLined) {
        //         s += '\n';
        //         hasNewLined = true;
        //     }
        //     s += `${prefix}    items {\n\n`;
        //     for (const item of this.items) {
        //         s += item.toScript(`${prefix}        `) + '\n';
        //     }
        //     s += `${prefix}    }\n`;
        // }

        /* CUSTOM PROPERTIES */
        if (this.__properties !== undefined) {
            s += `\n${prefix}    /* Custom Properties */\n\n`;
            processDictionary(this.__properties);
        }

        const result = `${s}\n${prefix}}\n`;
        return result;
    }

    get label(): string {
        return 'table';
    }
}

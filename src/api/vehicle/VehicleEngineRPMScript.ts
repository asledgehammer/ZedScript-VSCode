import { ParseBag } from '../util/ParseBag';
import { getString, Script, ScriptString } from '../Script';
import { VehicleEngineData } from './VehicleEngineData';

/**
 * **VehicleEngineRPMScript**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehicleEngineRPMScript extends Script {
    data: VehicleEngineData[] | undefined;
    version: ScriptString;

    constructor(bag: ParseBag) {
        super(bag, '=');
    }

    onPropertyToken(bag: ParseBag, property: string): boolean {
        switch (property.toLowerCase()) {
            case 'data':
                if (this.data === undefined) this.data = [];
                this.data.push(new VehicleEngineData(bag));
                return true;
        }
        return false;
    }

    onPropertyValue(property: string, value: string): boolean {
        property = property.trim();
        value = value.trim();
        switch (property.toLowerCase()) {
            case 'version':
                this.version = getString(value);
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

                /* Vehicle Objects */
                if (key === 'data') continue;

                const value = dict[key];
                processValue(key, value);
            }
        }

        processDictionary(this);

        let hasNewLined = false;

        /* Data */
        if (this.data !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            for (const d of this.data) {
                s += d.toScript(`${prefix}    `) + '\n';
            }
        }

        /* CUSTOM PROPERTIES */
        if (this.__properties !== undefined) {
            s += `\n${prefix}    /* Custom Properties */\n\n`;
            processDictionary(this.__properties);
        }

        const result = `${s}\n${prefix}}\n`;
        return result;
    }

    get label(): string {
        return 'vehicleenginerpm';
    }
}

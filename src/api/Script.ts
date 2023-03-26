import { ParseBag } from './util/ParseBag';
import { ParseError } from './util/ParseError';

export type ScriptBoolean = boolean | undefined;
export type ScriptFloat = number | undefined;
export type ScriptInt = number | undefined;
export type ScriptString = string | null | undefined;
export type ScriptIntArray = number[] | undefined;
export type ScriptFloatArray = number[] | undefined;
export type ScriptStringArray = string[] | undefined;

export function getString(value: string): string {
    return value;
}

export function getURI(value: string): string {
    return getString(value).replace(/\\/g, '/');
}

export function getInt(value: string): number {
    const val = parseInt(value.trim());
    if (isNaN(val)) throw new Error();
    else if (!isFinite(val)) throw new Error();
    return val;
}

export function getFloat(value: string): number {
    const val = parseFloat(value.replace(/f/g, '').trim());
    if (isNaN(val)) throw new Error();
    else if (!isFinite(val)) throw new Error();
    return val;
}

export function getBoolean(value: string): ScriptBoolean {
    return value.toLowerCase() === 'true';
}

/**
 * **Script**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export abstract class Script {
    __properties: { [name: string]: string } | undefined;
    protected readonly ignoreProperties: { [name: string]: boolean } = {};

    __name: string | undefined;
    readonly __operator: '=' | ':';

    constructor(bag: ParseBag, operator: '=' | ':', parseImmediately = true, noName = false) {
        if (!noName) this.__name = bag.next();
        this.__operator = operator;
        this.ignoreProperties['__operator'] = true;

        if (this.__name !== undefined && this.__name === '') {
            throw new Error(`Name is empty.`);
        }

        if (bag.next() !== '{') {
            throw new ParseError(`Expected '{'`);
        }

        if (parseImmediately) this.parse(bag);
    }

    parse(bag: ParseBag) {
        while (!bag.isEOF()) {
            const curr = bag.peek();
            if (curr === '}') {
                bag.next();
                return;
            }
            this.onParse(bag);
        }
    }

    onParse(bag: ParseBag): void {
        const curr = bag.next().trim();
        if (curr.indexOf(this.__operator) !== -1) {
            const [property, value] = curr.split(this.__operator).map((o) => {
                return o.trim();
            });

            /* (Continuity Check) */
            if (property.startsWith('//')) {
                return;
            }

            if (!this.onPropertyValue(property, value)) {
                this.addCustomProperty(property, value);
            }
        } else {
            if (!this.onPropertyToken(bag, curr)) {
                throw new ParseError(`${this.__name} :: Unknown property object: '${curr}'`);
            }
        }
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
            if (key === '__properties') {
                const propKeys = Object.keys(this.__properties!);
                if (propKeys.length === 0) continue;
                o.__properties = {};
                propKeys.sort((a, b) => a.localeCompare(b));
                for (const key of propKeys) {
                    o.__properties[key] = this.__properties![key];
                }
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

                const value = dict[key];
                processValue(key, value);
            }
        }

        processDictionary(this);

        if (this.__properties !== undefined) {
            s += `\n${prefix}    /* Custom Properties */\n\n`;
            processDictionary(this.__properties);
        }

        const result = `${s}\n${prefix}}\n`;
        return result;
    }

    addCustomProperty(property: string, value: string): void {
        if (this.__properties == undefined) {
            this.__properties = {};
        }
        this.__properties[property] = value;
    }

    hasCustomProperty(property: string): boolean {
        return this.__properties != undefined && this.__properties[property] != undefined;
    }

    onPropertyToken(bag: ParseBag, property: string): boolean {
        return false;
    }

    onPropertyValue(property: string, value: string): boolean {
        return false;
    }

    getMaxLengthKey() {
        const keys = [...Object.keys(this), ...(this.__properties !== undefined ? Object.keys(this.__properties) : [])];
        keys.sort((a, b) => a.localeCompare(b));

        let maxLenKey = 0;
        for (const key of keys) {
            if (key === '__name') continue;
            if (key === '__properties') continue;
            if (key === '__operator') continue;
            if (key === 'ignoreProperties') continue;

            if (key.length > maxLenKey) maxLenKey = key.length;
        }

        return maxLenKey;
    }

    abstract get label(): string;

    // get label(): string {
    //     return 'unknown';
    // }
}

import { getBoolean, getString, Script, ScriptBoolean, ScriptString } from '../Script';
import { ParseBag } from '../util/ParseBag';
import { VehiclePosition } from './VehiclePosition';
import { VehicleSwitchSeat } from './VehicleSwitchSeat';
import { VehicleAnim } from './VehicleAnim';

/**
 * **VehiclePassenger**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehiclePassenger extends Script {
    anims: VehicleAnim[] | undefined;
    area: ScriptString;
    door: ScriptString;
    door2: ScriptString;
    hasRoof: ScriptBoolean;
    positions: VehiclePosition[] | undefined;
    switchSeats: VehicleSwitchSeat[] | undefined;

    constructor(bag: ParseBag) {
        super(bag, '=', false);
        this.parse(bag);
    }

    onPropertyToken(bag: ParseBag, property: string): boolean {
        switch (property.toLowerCase().trim()) {
            case 'anim':
                if (this.anims === undefined) this.anims = [];
                this.anims.push(new VehicleAnim(bag));
                return true;
            case 'position':
                if (this.positions === undefined) this.positions = [];
                this.positions.push(new VehiclePosition(bag));
                return true;
            case 'switchseat':
                if (this.switchSeats === undefined) this.switchSeats = [];
                this.switchSeats.push(new VehicleSwitchSeat(bag));
                return true;
        }
        return false;
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase().trim()) {
            case 'area':
                this.area = getString(value);
                return true;
            case 'door':
                this.door = getString(value);
                return true;
            case 'door2':
                this.door2 = getString(value);
                return true;
            case 'hasroof':
                this.hasRoof = getBoolean(value);
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

                /* Passenger Objects */
                if (key === 'anims') continue;
                if (key === 'positions') continue;
                if (key === 'switchSeats') continue;

                const value = dict[key];
                processValue(key, value);
            }
        }

        processDictionary(this);

        let hasNewLined = false;

        /* Anims */
        if (this.anims !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            for (const entry of this.anims) {
                s += entry.toScript(`${prefix}    `) + '\n';
            }
        }

        /* Positions */
        if (this.positions !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            for (const entry of this.positions) {
                s += entry.toScript(`${prefix}    `) + '\n';
            }
        }

        /* Switchseats */
        if (this.switchSeats !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            for (const entry of this.switchSeats) {
                s += entry.toScript(`${prefix}    `) + '\n';
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
        return 'passenger';
    }
}

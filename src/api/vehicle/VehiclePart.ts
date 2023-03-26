/* eslint-disable no-fallthrough */
import { DelimiterArray, ScriptDelimiterArray } from '../util/Array';
import { ParseBag } from '../util/ParseBag';
import { getBoolean, getString, Script, ScriptBoolean, ScriptString, ScriptStringArray } from '../Script';
import { VehicleAnim } from './VehicleAnim';
import { VehicleContainer } from './VehicleContainer';
import { VehicleDoor } from './VehicleDoor';
import { VehicleInstall } from './VehicleInstall';
import { VehicleLua } from './VehicleLua';
import { VehiclePartModel } from './VehiclePartModel';
import { VehiclePassenger } from './VehiclePassenger';
import { VehicleTable } from './VehicleTable';
import { VehicleUninstall } from './VehicleUninstall';
import { VehicleWindow } from './VehicleWindow';

/**
 * **VehiclePart**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehiclePart extends Script {
    anims: VehicleAnim[] | undefined;
    area: ScriptString;
    category: ScriptString;
    containers: VehicleContainer[] | undefined;
    doors: VehicleDoor[] | undefined;
    hasLightsRear: ScriptBoolean;
    install: VehicleInstall | undefined;
    itemType: ScriptDelimiterArray<string>;
    lua: VehicleLua | undefined;
    mechanicRequireKey: ScriptBoolean;
    models: VehiclePartModel[] | undefined;
    parent: ScriptString;
    passengers: VehiclePassenger[] | undefined;
    recipes: ScriptStringArray;
    repairMechanic: ScriptBoolean;
    specificItem: ScriptBoolean;
    tables: VehicleTable[] | undefined;
    uninstall: VehicleUninstall | undefined;
    wheel: ScriptString;
    windows: VehicleWindow[] | undefined;

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
            case 'container':
                if (this.containers === undefined) this.containers = [];
                this.containers.push(new VehicleContainer(bag));
                return true;
            case 'door':
                if (this.doors === undefined) this.doors = [];
                this.doors.push(new VehicleDoor(bag));
                return true;
            case 'install':
                this.install = new VehicleInstall(bag);
                return true;
            case 'model':
                if (this.models === undefined) this.models = [];
                this.models.push(new VehiclePartModel(bag));
                return true;
            case 'passenger':
                if (this.passengers === undefined) this.passengers = [];
                this.passengers.push(new VehiclePassenger(bag));
                return true;
            case 'table':
                if (this.tables === undefined) this.tables = [];
                this.tables.push(new VehicleTable(bag));
                return true;
            case 'lua':
                this.lua = new VehicleLua(bag);
                return true;
            case 'uninstall':
                this.uninstall = new VehicleUninstall(bag);
                return true;
            case 'window':
                if (this.windows === undefined) this.windows = [];
                this.windows.push(new VehicleWindow(bag));
                return true;
        }
        return false;
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase().trim()) {
            case 'area':
                this.area = getString(value);
                return true;
            case 'category':
                this.category = getString(value);
                return true;
            case 'door':
                // FIXME: There's no clear way to interpret this situation ATM. -Jab, 3/5/2023
                // this.door = getString(value);
                return true;
            case 'haslightsrear':
                this.hasLightsRear = getBoolean(value);
                return true;
            case 'itemtype':
                this.itemType = new DelimiterArray(';', getString(value));
                return true;
            case 'mechanicrequirekey':
                this.mechanicRequireKey = getBoolean(value);
                return true;
            case 'parent':
                this.parent = getString(value);
                return true;
            case 'recipes':
                this.recipes = getString(value)
                    .split(';')
                    .map((o) => {
                        return o.trim();
                    });
            case 'repairmechanic':
                this.repairMechanic = getBoolean(value);
                return true;
            case 'specificitem':
                this.specificItem = getBoolean(value);
                return true;
            case 'wheel':
                this.wheel = getString(value);
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

                /* Part Objects */
                if (key === 'anims') continue;
                if (key === 'containers') continue;
                if (key === 'doors') continue;
                if (key === 'install') continue;
                if (key === 'models') continue;
                if (key === 'passengers') continue;
                if (key === 'tables') continue;
                if (key === 'lua') continue;
                if (key === 'uninstall') continue;
                if (key === 'windows') continue;

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

        /* Containers */
        if (this.containers !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            for (const entry of this.containers) {
                s += entry.toScript(`${prefix}    `) + '\n';
            }
        }

        /* Doors */
        if (this.doors !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            for (const entry of this.doors) {
                s += entry.toScript(`${prefix}    `) + '\n';
            }
        }

        /* Install */
        if (this.install !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            s += this.install.toScript(`${prefix}    `) + '\n';
        }

        /* Models */
        if (this.models !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            for (const entry of this.models) {
                s += entry.toScript(`${prefix}    `) + '\n';
            }
        }

        /* Passengers */
        if (this.passengers !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            for (const passenger of this.passengers) {
                s += passenger.toScript(`${prefix}    `) + '\n';
            }
        }

        /* Tables */
        if (this.tables !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            for (const entry of this.tables) {
                s += entry.toScript(`${prefix}    `) + '\n';
            }
        }

        /* Lua */
        if (this.lua !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            s += this.lua.toScript(`${prefix}    `) + '\n';
        }

        /* Uninstall */
        if (this.uninstall !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            s += this.uninstall.toScript(`${prefix}    `) + '\n';
        }

        /* Windows */
        if (this.windows !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            for (const entry of this.windows) {
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

    getMaxLengthKey() {
        const keys = [...Object.keys(this), ...(this.__properties !== undefined ? Object.keys(this.__properties) : [])];
        keys.sort((a, b) => a.localeCompare(b));

        let maxLenKey = 0;
        for (const key of keys) {
            if (key === '__name') continue;
            if (key === '__properties') continue;
            if (key === '__operator') continue;
            if (key === 'ignoreProperties') continue;

            /* Part Objects */
            if (key === 'anims') continue;
            if (key === 'containers') continue;
            if (key === 'doors') continue;
            if (key === 'install') continue;
            if (key === 'models') continue;
            if (key === 'passengers') continue;
            if (key === 'tables') continue;
            if (key === 'lua') continue;
            if (key === 'uninstall') continue;
            if (key === 'windows') continue;

            if (key.length > maxLenKey) maxLenKey = key.length;
        }

        return maxLenKey;
    }

    get label(): string {
        return 'part';
    }
}

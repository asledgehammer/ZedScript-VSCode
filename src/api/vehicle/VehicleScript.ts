import {
    getBoolean,
    getFloat,
    getInt,
    getString,
    Script,
    ScriptBoolean,
    ScriptFloat,
    ScriptInt,
    ScriptString,
    ScriptStringArray,
} from '../Script';
import { ParseBag } from '../util/ParseBag';
import { VehicleModel } from './VehicleModel';
import { VehicleSkin } from './VehicleSkin';
import { VehicleLightBar } from './VehicleLightBar';
import { VehicleWheel } from './VehicleWheel';
import { VehiclePassenger } from './VehiclePassenger';
import { VehicleSound } from './VehicleSound';
import { VehicleArea } from './VehicleArea';
import { VehiclePart } from './VehiclePart';
import { VehiclePhysics } from './VehiclePhysics';
import { VehicleAttachment } from './VehicleAttachment';
import { getVector2, getVector3, ScriptVector2, ScriptVector3 } from '../util/Math';

/**
 * **VehicleScript**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehicleScript extends Script {
    areas: VehicleArea[] | undefined;
    attachments: VehicleAttachment[] | undefined;
    brakingForce: ScriptInt;
    centerOfMassOffset: ScriptVector3;
    engineForce: ScriptInt;
    engineLoudness: ScriptInt;
    engineQuality: ScriptInt;
    engineRepairLevel: ScriptInt;
    engineRPMType: ScriptString;
    extents: ScriptVector3;
    extentsOffset: ScriptVector2;
    frontEndHealth: ScriptInt;
    isSmallVehicle: ScriptBoolean;
    lightBar: VehicleLightBar | undefined;
    mass: ScriptFloat;
    maxSpeed: ScriptFloat;
    maxSuspensionTravelCm: ScriptInt;
    mechanicType: ScriptInt;
    model: VehicleModel | undefined;
    offRoadEfficiency: ScriptFloat;
    parts: VehiclePart[] | undefined;
    passengers: VehiclePassenger[] | undefined;
    playerDamageProtection: ScriptFloat;
    physicsChassisShape: ScriptVector3;
    physics: VehiclePhysics[] | undefined;
    rearEndHealth: ScriptInt;
    rollInfluence: ScriptFloat;
    seatNumber: ScriptInt;
    seats: ScriptInt;
    shadowExtents: ScriptVector2;
    shadowOffset: ScriptVector2;
    skin: VehicleSkin | undefined;
    sound: VehicleSound | undefined;
    spawnOffsetY: ScriptFloat;
    steeringIncrement: ScriptFloat;
    steeringClamp: ScriptFloat;
    stoppingMovementForce: ScriptFloat;
    suspensionStiffness: ScriptInt;
    suspensionCompression: ScriptFloat;
    suspensionDamping: ScriptFloat;
    suspensionRestLength: ScriptFloat;

    'template!': ScriptString;
    templates: ScriptStringArray;

    textureDamage1Overlay: ScriptString;
    textureDamage1Shell: ScriptString;
    textureDamage2Overlay: ScriptString;
    textureDamage2Shell: ScriptString;
    textureLights: ScriptString;
    textureMask: ScriptString;
    textureRust: ScriptString;

    wheelFriction: ScriptFloat;
    wheels: VehicleWheel[] | undefined;

    gearRatioCount: ScriptInt;
    gearRatioR: ScriptFloat;
    gearRatio1: ScriptFloat;
    gearRatio2: ScriptFloat;
    gearRatio3: ScriptFloat;
    gearRatio4: ScriptFloat;
    gearRatio5: ScriptFloat;

    constructor(bag: ParseBag) {
        super(bag, '=');
    }

    onPropertyToken(bag: ParseBag, property: string): boolean {
        switch (property.trim().toLowerCase()) {
            case 'area':
                if (this.areas === undefined) this.areas = [];
                this.areas.push(new VehicleArea(bag));
                return true;
            case 'attachment':
                if (this.attachments === undefined) this.attachments = [];
                this.attachments.push(new VehicleAttachment(bag));
                return true;
            case 'lightbar':
                this.lightBar = new VehicleLightBar(bag);
                return true;
            case 'model':
                this.model = new VehicleModel(bag);
                return true;
            case 'part':
                if (this.parts === undefined) this.parts = [];
                this.parts.push(new VehiclePart(bag));
                return true;
            case 'passenger':
                if (this.passengers === undefined) this.passengers = [];
                this.passengers.push(new VehiclePassenger(bag));
                return true;
            case 'physics':
                if (this.physics === undefined) this.physics = [];
                this.physics.push(new VehiclePhysics(bag));
                return true;
            case 'skin':
                this.skin = new VehicleSkin(bag);
                return true;
            case 'sound':
                this.sound = new VehicleSound(bag);
                return true;
            case 'wheel':
                if (this.wheels === undefined) this.wheels = [];
                this.wheels.push(new VehicleWheel(bag));
                return true;
        }
        return false;
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase()) {
            case 'brakingforce':
                this.brakingForce = getInt(value);
                return true;
            case 'centerofmassoffset': {
                this.centerOfMassOffset = getVector3(value);
                return true;
            }
            case 'engineforce':
                this.engineForce = getInt(value);
                return true;
            case 'enginerpmtype':
                this.engineRPMType = getString(value);
                return true;
            case 'engineloudness':
                this.engineLoudness = getInt(value);
                return true;
            case 'enginequality':
                this.engineQuality = getInt(value);
                return true;
            case 'enginerepairlevel':
                this.engineRepairLevel = getInt(value);
                return true;
            case 'extents': {
                this.extents = getVector3(value);
                return true;
            }
            case 'extentsoffset': {
                this.extentsOffset = getVector2(value);
                return true;
            }
            case 'frontendhealth':
                this.frontEndHealth = getInt(value);
                return true;
            case 'gearratiocount':
                this.gearRatioCount = getInt(value);
                return true;
            case 'gearratior':
                this.gearRatioR = getFloat(value);
                return true;
            case 'gearratio1':
                this.gearRatio1 = getFloat(value);
                return true;
            case 'gearratio2':
                this.gearRatio2 = getFloat(value);
                return true;
            case 'gearratio3':
                this.gearRatio3 = getFloat(value);
                return true;
            case 'gearratio4':
                this.gearRatio4 = getFloat(value);
                return true;
            case 'gearratio5':
                this.gearRatio5 = getFloat(value);
                return true;
            case 'issmallvehicle': {
                this.isSmallVehicle = getBoolean(value);
                return true;
            }
            case 'mass': {
                this.mass = getInt(value);
                return true;
            }
            case 'maxspeed':
                this.maxSpeed = getFloat(value);
                return true;
            case 'maxsuspensiontravelcm':
                this.maxSuspensionTravelCm = getInt(value);
                return true;
            case 'mechanictype':
                this.mechanicType = getInt(value);
                return true;
            case 'offroadefficiency':
                this.offRoadEfficiency = getFloat(value);
                return true;
            case 'playerdamageprotection':
                this.playerDamageProtection = getFloat(value);
                return true;
            case 'physicschassisshape': {
                this.physicsChassisShape = getVector3(value);
                return true;
            }
            case 'rearendhealth':
                this.rearEndHealth = getInt(value);
                return true;
            case 'rollinfluence':
                this.rollInfluence = getFloat(value);
                return true;

            /* (Possible issue with vanilla scripts referring to the same variable) */
            case 'seatnumber':
                this.seatNumber = getInt(value);
                return true;
            case 'seats':
                this.seats = getInt(value);
                return true;
            /******************************************/

            case 'shadowextents': {
                const [x, y] = getString(value)
                    .split(' ')
                    .map((o) => {
                        return getFloat(o.trim());
                    });
                this.shadowExtents = getVector2(value);
                return true;
            }
            case 'shadowoffset': {
                this.shadowOffset = getVector2(value);
                return true;
            }
            case 'spawnoffsety': {
                this.spawnOffsetY = getFloat(value);
                return true;
            }
            case 'stoppingmovementforce':
                this.stoppingMovementForce = getFloat(value);
                return true;

            case 'steeringincrement':
                this.steeringIncrement = getFloat(value);
                return true;
            case 'steeringclamp':
                this.steeringClamp = getFloat(value);
                return true;
            case 'suspensionstiffness':
                this.suspensionStiffness = getInt(value);
                return true;
            case 'suspensioncompression':
                this.suspensionCompression = getFloat(value);
                return true;
            case 'suspensiondamping':
                this.suspensionDamping = getFloat(value);
                return true;
            case 'suspensionrestlength':
                this.suspensionRestLength = getFloat(value);
                return true;

            case 'template':
                if (this.templates == null) this.templates = [];
                this.templates.push(getString(value));
                return true;
            case 'template!':
                this['template!'] = getString(value);
                return true;
            case 'texturedamage1overlay':
                this.textureDamage1Overlay = getString(value);
                return true;
            case 'texturedamage1shell':
                this.textureDamage1Shell = getString(value);
                return true;
            case 'texturedamage2overlay':
                this.textureDamage2Overlay = getString(value);
                return true;
            case 'texturedamage2shell':
                this.textureDamage2Shell = getString(value);
                return true;
            case 'texturelights':
                this.textureLights = getString(value);
                return true;
            case 'texturemask':
                this.textureMask = getString(value);
                return true;
            case 'texturerust':
                this.textureRust = getString(value);
                return true;
            case 'wheelfriction':
                this.wheelFriction = getFloat(value);
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

        const { templates } = this;

        function processDictionary(dict: { [name: string]: any }) {
            const keys = Object.keys(dict);
            keys.sort((a, b) => a.localeCompare(b));
            for (const key of keys) {
                if (key === '__name') continue;
                if (key === '__properties') continue;
                if (key === '__operator') continue;
                if (key === 'ignoreProperties') continue;

                /* Vehicle Objects */
                if (key === 'areas') continue;
                if (key === 'attachments') continue;
                if (key === 'lightBar') continue;
                if (key === 'model') continue;
                if (key === 'parts') continue;
                if (key === 'passengers') continue;
                if (key === 'physics') continue;
                if (key === 'skin') continue;
                if (key === 'sound') continue;
                if (key === 'wheels') continue;

                /* Vehicle Arrays */
                if (key === 'templates') {
                    for (const entry of templates!) {
                        s += `${prefix}    template${' '.repeat(maxLenKey - 'template'.length)} = ${entry}` + ',\n';
                    }
                    continue;
                }

                const value = dict[key];
                processValue(key, value);
            }
        }

        processDictionary(this);

        let hasNewLined = false;

        /* Areas */
        if (this.areas !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            for (const area of this.areas) {
                s += area.toScript(`${prefix}    `) + '\n';
            }
        }

        /* Attachments */
        if (this.attachments !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            for (const attachment of this.attachments) {
                s += attachment.toScript(`${prefix}    `) + '\n';
            }
        }

        /* LightBar */
        if (this.lightBar !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            s += this.lightBar.toScript(`${prefix}    `) + '\n';
        }

        /* Model */
        if (this.model !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            s += this.model.toScript(`${prefix}    `) + '\n';
        }

        /* Parts */
        if (this.parts !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            for (const part of this.parts) {
                s += part.toScript(`${prefix}    `) + '\n';
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

        /* Physics */
        if (this.physics !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            for (const physic of this.physics) {
                s += physic.toScript(`${prefix}    `) + '\n';
            }
        }

        /* Skin */
        if (this.skin !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            s += this.skin.toScript(`${prefix}    `) + '\n';
        }

        /* Sound */
        if (this.sound !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            s += this.sound.toScript(`${prefix}    `) + '\n';
        }

        /* Wheels */
        if (this.wheels !== undefined) {
            if (!hasNewLined) {
                s += '\n';
                hasNewLined = true;
            }
            for (const wheel of this.wheels) {
                s += wheel.toScript(`${prefix}    `) + '\n';
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

            /* Vehicle Objects */
            if (key === 'area') continue;
            if (key === 'attachments') continue;
            if (key === 'lightbar') continue;
            if (key === 'model') continue;
            if (key === 'parts') continue;
            if (key === 'passengers') continue;
            if (key === 'physics') continue;
            if (key === 'skin') continue;
            if (key === 'sound') continue;
            if (key === 'wheels') continue;

            if (key.length > maxLenKey) maxLenKey = key.length;
        }

        return maxLenKey;
    }

    get label(): string {
        return 'vehicle';
    }
}

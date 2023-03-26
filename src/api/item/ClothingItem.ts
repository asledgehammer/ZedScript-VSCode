import {
    getBoolean,
    getFloat,
    getInt,
    getString,
    ScriptBoolean,
    ScriptFloat,
    ScriptInt,
    ScriptString,
} from '../Script';
import { ItemScript } from './ItemScript';
import { ParseBag } from '../util/ParseBag';

/**
 * **ClothingItem**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class ClothingItem extends ItemScript {
    biteDefense: ScriptFloat;
    bulletDefense: ScriptFloat;
    canHaveHoles: ScriptBoolean;
    chanceToFall: ScriptInt;
    combatSpeedModifier: ScriptFloat;
    conditionLowerChanceOneIn: ScriptInt;
    cosmetic: ScriptBoolean;
    insulation: ScriptFloat;
    neckProtectionModifier: ScriptFloat;
    removeOnBroken: ScriptBoolean;
    runSpeedModifier: ScriptFloat;
    scratchDefense: ScriptFloat;
    spriteName: ScriptString;
    stompPower: ScriptFloat;
    temperature: ScriptFloat;
    waterResistance: ScriptFloat;
    weightWet: ScriptFloat;
    windResistance: ScriptFloat;
    worldRender: ScriptBoolean;

    constructor(bag: ParseBag, type = 'Clothing') {
        super(bag, '=', type);
    }

    onPropertyToken(bag: ParseBag, property: string): boolean {
        return super.onPropertyToken(bag, property);
    }

    onPropertyValue(property: string, value: string): boolean {
        property = property.trim();
        value = value.trim();
        switch (property.toLowerCase()) {
            case 'bitedefense':
                this.biteDefense = getFloat(value);
                return true;
            case 'bulletdefense':
                this.bulletDefense = getFloat(value);
                return true;
            case 'canhaveholes':
                this.canHaveHoles = getBoolean(value);
                return true;
            case 'chancetofall':
                this.chanceToFall = getInt(value);
                return true;
            case 'combatspeedmodifier':
                this.combatSpeedModifier = getFloat(value);
                return true;
            case 'conditionlowerchanceonein':
                this.conditionLowerChanceOneIn = getInt(value);
                return true;
            case 'cosmetic':
                this.cosmetic = getBoolean(value);
                return true;
            case 'neckprotectionmodifier':
                this.neckProtectionModifier = getFloat(value);
                return true;
            case 'removeonbroken':
                this.removeOnBroken = getBoolean(value);
                return true;
            case 'runspeedmodifier':
                this.runSpeedModifier = getFloat(value);
                return true;
            case 'scratchdefense':
                this.scratchDefense = getFloat(value);
                return true;
            case 'spritename':
                this.spriteName = getString(value);
                return true;
            case 'stomppower':
                this.stompPower = getFloat(value);
                return true;
            case 'temperature':
                this.temperature = getFloat(value);
                return true;
            case 'insulation':
                this.insulation = getFloat(value);
                return true;
            case 'waterresistance':
                this.waterResistance = getFloat(value);
                return true;
            case 'weightwet':
                this.weightWet = getFloat(value);
                return true;
            case 'windresistance':
                this.windResistance = getFloat(value);
                return true;
            case 'worldrender':
                this.worldRender = getBoolean(value);
                return true;
        }
        return super.onPropertyValue(property, value);
    }
}

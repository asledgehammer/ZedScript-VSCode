/* eslint-disable no-fallthrough */
/* eslint-disable no-case-declarations */
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
import { ModelWeaponPart } from './ModelWeaponPart';
import { ParseBag } from '../util/ParseBag';
import { DelimiterArray, ScriptDelimiterArray } from '../util/Array';

/**
 * **WeaponItem**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class WeaponItem extends ItemScript {
    aimingMod: ScriptFloat;
    aimingPerkCritModifier: ScriptInt;
    aimingPerkHitChanceModifier: ScriptFloat;
    aimingPerkMinAngleModifier: ScriptFloat;
    aimingPerkRangeModifier: ScriptFloat;
    aimingTime: ScriptInt;
    alwaysKnockdown: ScriptBoolean;
    ammoBox: ScriptString;
    angleFalloff: ScriptBoolean;
    baseSpeed: ScriptFloat;
    bringToBearSound: ScriptString;
    bulletOutSound: ScriptString;
    canBarricade: ScriptBoolean;
    canBePlaced: ScriptBoolean;
    canBeReused: ScriptBoolean;
    cantAttackWithLowestEndurance: ScriptBoolean;
    clickSound: ScriptString;
    clipSize: ScriptInt;
    categories: ScriptDelimiterArray<string>;
    conditionLowerChanceOneIn: ScriptInt;
    critDmgMultiplier: ScriptFloat;
    criticalChance: ScriptFloat;
    damageCategory: ScriptString;
    damageMakeHole: ScriptBoolean;
    doorDamage: ScriptInt;
    doorHitSound: ScriptString;
    ejectAmmoSound: ScriptString;
    ejectAmmoStartSound: ScriptString;
    ejectAmmoStopSound: ScriptString;
    enduranceMod: ScriptFloat;
    equipSound: ScriptString;
    explosionPower: ScriptInt;
    explosionRange: ScriptInt;
    explosionTimer: ScriptInt;
    extraDamage: ScriptFloat;
    fireMode: ScriptString;
    fireModePossibilities: ScriptDelimiterArray<string>;
    firePower: ScriptInt;
    fireRange: ScriptInt;
    haveChamber: ScriptBoolean;
    hitAngleMod: ScriptFloat;
    hitChance: ScriptInt;
    hitFloorSound: ScriptString;
    hitSound: ScriptString;
    idleAnim: ScriptString;
    insertAllBulletsReload: ScriptBoolean;
    insertAmmoSound: ScriptString;
    insertAmmoStartSound: ScriptString;
    insertAmmoStopSound: ScriptString;
    impactSound: ScriptString;
    isAimedFirearm: ScriptBoolean;
    isAimedHandWeapon: ScriptBoolean;
    jamGunChance: ScriptFloat;
    knockBackOnNoDeath: ScriptBoolean;
    knockdownMod: ScriptFloat;
    magazineType: ScriptString;
    manuallyRemoveSpentRounds: ScriptBoolean;
    maxDamage: ScriptFloat;
    maxHitCount: ScriptInt;
    maxRange: ScriptFloat;
    minAngle: ScriptFloat;
    minDamage: ScriptFloat;
    minimumSwingTime: ScriptFloat;
    minRange: ScriptFloat;
    modelWeaponParts: ScriptDelimiterArray<ModelWeaponPart>;
    multipleHitConditionAffected: ScriptBoolean;
    noiseDuration: ScriptInt;
    noiseRange: ScriptInt;
    npcSoundBoost: ScriptFloat;
    otherHandRequire: ScriptString;
    otherHandUse: ScriptBoolean;
    physicsObject: ScriptString;
    piercingBullets: ScriptBoolean;
    placedSprite: ScriptString;
    projectileCount: ScriptInt;
    pushBackMod: ScriptFloat;
    rackAfterShoot: ScriptBoolean;
    rackSound: ScriptString;
    ranged: ScriptBoolean;
    rangeFalloff: ScriptBoolean;
    recoilDelay: ScriptInt;
    reloadTime: ScriptInt;
    runAnim: ScriptString;
    sensorRange: ScriptInt;
    shareDamage: ScriptBoolean;
    shareEndurance: ScriptBoolean;
    shellFallSound: ScriptString;
    smokeRange: ScriptInt;
    soundGain: ScriptFloat;
    soundMap: ScriptDelimiterArray<string>;
    soundVolume: ScriptInt;
    splatBloodOnNoDeath: ScriptBoolean;
    splatNumber: ScriptInt;
    splatSize: ScriptFloat;
    stopPower: ScriptInt;
    subCategory: ScriptString;
    swingAmountBeforeImpact: ScriptFloat;
    swingSound: ScriptString;
    swingTime: ScriptFloat;
    toHitModifier: ScriptFloat;
    treeDamage: ScriptInt;
    triggerExplosionTimer: ScriptInt;
    twoHandWeapon: ScriptBoolean;
    unequipSound: ScriptString;
    useEndurance: ScriptBoolean;
    useSelf: ScriptBoolean;
    weaponLength: ScriptFloat;
    weaponReloadType: ScriptString;
    weaponSprite: ScriptString;
    weaponWeight: ScriptFloat;

    constructor(bag: ParseBag) {
        super(bag, '=', 'Weapon');
    }

    onPropertyToken(_: ParseBag, __: string): boolean {
        return super.onPropertyToken(_, __);
    }

    onPropertyValue(property: string, value: string): boolean {
        property = property.trim();
        value = value.trim();
        switch (property.toLowerCase()) {
            case 'aimingmod':
                this.aimingMod = getFloat(value);
                return true;
            case 'aimingperkcritmodifier':
                this.aimingPerkCritModifier = getInt(value);
                return true;
            case 'aimingperkhitchancemodifier':
                this.aimingPerkHitChanceModifier = getFloat(value);
                return true;
            case 'aimingperkminanglemodifier':
                this.aimingPerkMinAngleModifier = getFloat(value);
                return true;
            case 'aimingperkrangemodifier':
                this.aimingPerkRangeModifier = getFloat(value);
                return true;
            case 'aimingtime':
                this.aimingTime = getInt(value);
                return true;
            case 'alwaysknockdown':
                this.alwaysKnockdown = getBoolean(value);
                return true;
            case 'ammobox':
                this.ammoBox = getString(value);
                return true;
            case 'anglefalloff':
                this.angleFalloff = getBoolean(value);
                return true;
            case 'basespeed':
                this.baseSpeed = getFloat(value);
                return true;
            case 'bringtobearsound':
                this.bringToBearSound = getString(value);
                return true;
            case 'bulletoutsound':
                this.bulletOutSound = getString(value);
                return true;
            case 'canbarricade':
                this.canBarricade = getBoolean(value);
                return true;
            case 'canbeplaced':
                this.canBePlaced = getBoolean(value);
                return true;
            case 'canbereused':
                this.canBeReused = getBoolean(value);
                return true;
            case 'cantattackwithlowestendurance':
                this.cantAttackWithLowestEndurance = getBoolean(value);
                return true;
            case 'categories':
                this.categories = new DelimiterArray(';', value);
                return true;
            case 'clicksound':
                this.clickSound = getString(value);
                return true;
            case 'clipsize':
                this.clipSize = getInt(value);
                return true;
            case 'conditionlowerchanceonein':
                this.conditionLowerChanceOneIn = getInt(value);
                return true;
            case 'critdmgmultiplier':
                this.critDmgMultiplier = getFloat(value);
                return true;
            case 'criticalchance':
                this.criticalChance = getFloat(value);
                return true;
            case 'damagecategory':
                this.damageCategory = getString(value);
                return true;
            case 'damagemakehole':
                this.damageMakeHole = getBoolean(value);
                return true;
            case 'doordamage':
                this.doorDamage = getInt(value);
                return true;
            case 'doorhitsound':
                this.doorHitSound = getString(value);
                return true;
            case 'ejectammosound':
                this.ejectAmmoSound = getString(value);
                return true;
            case 'ejectammostartsound':
                this.ejectAmmoStartSound = getString(value);
                return true;
            case 'ejectammostopsound':
                this.ejectAmmoStartSound = getString(value);
                return true;
            case 'endurancemod':
                this.enduranceMod = getFloat(value);
                return true;
            case 'equipsound':
                this.equipSound = getString(value);
                return true;
            case 'explosionpower':
                this.explosionPower = getInt(value);
                return true;
            case 'explosionrange':
                this.explosionRange = getInt(value);
                return true;
            case 'explosiontimer':
                this.explosionTimer = getInt(value);
                return true;
            case 'extradamage':
                this.extraDamage = getFloat(value);
                return true;
            case 'firemode':
                this.fireMode = getString(value);
                return true;
            case 'firemodepossibilities':
                this.fireModePossibilities = new DelimiterArray('/', getString(value)); // getString(value)?.split('/');
                return true;
            case 'firepower':
                this.firePower = getInt(value);
                return true;
            case 'firerange':
                this.fireRange = getInt(value);
                return true;
            case 'havechamber':
                this.haveChamber = getBoolean(value);
                return true;
            case 'hitanglemod':
                this.hitAngleMod = getFloat(value);
                return true;
            case 'hitchance':
                this.hitChance = getInt(value);
                return true;
            case 'hitfloorsound':
                this.hitFloorSound = getString(value);
                return true;
            case 'hitsound':
                this.hitSound = getString(value);
                return true;
            case 'idleanim':
                this.idleAnim = getString(value);
                return true;
            case 'impactsound':
                this.impactSound = getString(value);
                return true;
            case 'insertallbulletsreload':
                this.insertAllBulletsReload = getBoolean(value);
                return true;
            case 'insertammosound':
                this.insertAmmoSound = getString(value);
                return true;
            case 'insertammostartsound':
                this.insertAmmoStartSound = getString(value);
                return true;
            case 'insertammostopsound':
                this.insertAmmoStopSound = getString(value);
                return true;
            case 'isaimedfirearm':
                this.isAimedFirearm = getBoolean(value);
                return true;
            case 'isaimedhandweapon':
                this.isAimedHandWeapon = getBoolean(value);
                return true;
            case 'jamgunchance':
                this.jamGunChance = getFloat(value);
                return true;
            case 'knockbackonnodeath':
                this.knockBackOnNoDeath = getBoolean(value);
                return true;
            case 'knockdownmod':
                this.knockdownMod = getFloat(value);
                return true;
            case 'magazinetype':
                this.magazineType = getString(value);
                return true;
            case 'manuallyremovespentrounds':
                this.manuallyRemoveSpentRounds = getBoolean(value);
                return true;
            case 'maxdamage':
                this.maxDamage = getFloat(value);
                return true;
            case 'maxhitcount':
                this.maxHitCount = getInt(value);
                return true;
            case 'maxrange':
                this.maxRange = getFloat(value);
                return true;
            case 'minangle':
                this.minAngle = getFloat(value);
                return true;
            case 'mindamage':
                this.minDamage = getFloat(value);
                return true;
            case 'minimumswingtime':
                this.minimumSwingTime = getFloat(value);
                return true;
            case 'minrange':
                this.minRange = getFloat(value);
                return true;
            case 'modelweaponpart':
                const [partType, modelName, attachmentNameSelf, attachmentParent] = getString(value)!.split(' ');
                const mwp = new ModelWeaponPart(partType, modelName, attachmentNameSelf, attachmentParent);
                if (this.modelWeaponParts == null) {
                    this.modelWeaponParts = new DelimiterArray(' ');
                }
                this.modelWeaponParts.values.push(mwp);
            case 'multiplehitconditionaffected':
                this.multipleHitConditionAffected = getBoolean(value);
                return true;
            case 'noiseduration':
                this.noiseDuration = getInt(value);
                return true;
            case 'noiserange':
                this.noiseRange = getInt(value);
                return true;
            case 'npcsoundboost':
                this.npcSoundBoost = getFloat(value);
                return true;
            case 'otherhandrequire':
                this.otherHandRequire = getString(value);
                return true;
            case 'otherhanduse':
                this.otherHandUse = getBoolean(value);
                return true;
            case 'physicsobject':
                this.physicsObject = getString(value);
                return true;
            case 'piercingbullets':
                this.piercingBullets = getBoolean(value);
                return true;
            case 'placedsprite':
                this.placedSprite = getString(value);
                return true;
            case 'projectilecount':
                this.projectileCount = getInt(value);
                return true;
            case 'pushbackmod':
                this.pushBackMod = getFloat(value);
                return true;
            case 'rackaftershoot':
                this.rackAfterShoot = getBoolean(value);
                return true;
            case 'racksound':
                this.rackSound = getString(value);
                return true;
            case 'ranged':
                this.ranged = getBoolean(value);
                return true;
            case 'rangefalloff':
                this.rangeFalloff = getBoolean(value);
                return true;
            case 'recoildelay':
                this.recoilDelay = getInt(value);
                return true;
            case 'reloadtime':
                this.reloadTime = getInt(value);
                return true;
            case 'runanim':
                this.runAnim = getString(value);
                return true;
            case 'sensorrange':
                this.sensorRange = getInt(value);
                return true;
            case 'sharedamage':
                this.shareDamage = getBoolean(value);
                return true;
            case 'shareendurance':
                this.shareEndurance = getBoolean(value);
                return true;
            case 'shellfallsound':
                this.shellFallSound = getString(value);
                return true;
            case 'smokerange':
                this.smokeRange = getInt(value);
                return true;
            case 'soundgain':
                this.soundGain = getFloat(value);
                return true;
            case 'soundmap':
                this.soundMap = new DelimiterArray(' ', getString(value));
                return true;
            case 'soundvolume':
                this.soundVolume = getInt(value);
                return true;
            case 'splatbloodonnodeath':
                this.splatBloodOnNoDeath = getBoolean(value);
                return true;
            case 'splatnumber':
                this.splatNumber = getInt(value);
                return true;
            case 'splatsize':
                this.splatSize = getFloat(value);
                return true;
            case 'stoppower':
                this.stopPower = getInt(value);
                return true;
            case 'subcategory':
                this.subCategory = getString(value);
                return true;
            case 'swingamountbeforeimpact':
                this.swingAmountBeforeImpact = getFloat(value);
                return true;
            case 'swingsound':
                this.swingSound = getString(value);
                return true;
            case 'swingtime':
                this.swingTime = getFloat(value);
                return true;
            case 'tohitmodifier':
                this.toHitModifier = getFloat(value);
                return true;
            case 'treedamage':
                this.treeDamage = getInt(value);
                return true;
            case 'triggerexplosiontimer':
                this.triggerExplosionTimer = getInt(value);
                return true;
            case 'twohandweapon':
                this.twoHandWeapon = getBoolean(value);
                return true;
            case 'unequipsound':
                this.unequipSound = getString(value);
                return true;
            case 'useendurance':
                this.useEndurance = getBoolean(value);
                return true;
            case 'useself':
                this.useSelf = getBoolean(value);
                return true;
            case 'weaponlength':
                this.weaponLength = getFloat(value);
                return true;
            case 'weaponreloadtype':
                this.weaponReloadType = getString(value);
                return true;
            case 'weaponsprite':
                this.weaponSprite = getString(value);
                return true;
            case 'weaponweight':
                this.weaponWeight = getFloat(value);
                return true;
        }
        return super.onPropertyValue(property, value);
    }
}

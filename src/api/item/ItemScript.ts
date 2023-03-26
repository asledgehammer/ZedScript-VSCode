/* eslint-disable no-case-declarations */
import { DelimiterArray, ScriptDelimiterArray } from '../util/Array';
import { ParseBag } from '../util/ParseBag';
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
} from '../Script';
import { BloodClothingType } from './BloodClothingType';
import { ItemReplaceType as ItemReplaceType } from './ReplaceType';

/**
 * **ItemScript**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export abstract class ItemScript extends Script {
    activatedItem: ScriptBoolean;
    alarmSound: ScriptString;
    alcohol: ScriptBoolean;
    alcoholic: ScriptBoolean;
    alcoholPower: ScriptFloat;
    alwaysWelcomeGift: ScriptBoolean;
    ammoType: ScriptString;
    attachmentReplacement: ScriptString;
    attachmentsProvided: ScriptDelimiterArray<string>; // ScriptStringArray;
    attachmentType: ScriptString;
    bandagePower: ScriptFloat;
    bloodLocation: ScriptDelimiterArray<BloodClothingType>; //ScriptBloodClothingTypes;
    bodyLocation: ScriptString;
    boredomChange: ScriptInt;
    brakeForce: ScriptInt;
    breakSound: ScriptString;
    calories: ScriptInt;
    canBandage: ScriptBoolean;
    canBeRemote: ScriptBoolean;
    canHaveHoles: ScriptBoolean;
    canStack: ScriptBoolean;
    canStoreWater: ScriptBoolean;
    carbohydrates: ScriptInt;
    chanceToSpawnDamaged: ScriptInt;
    closeKillMove: ScriptString;
    clothingExtraSubmenu: ScriptString;
    clothingItem: ScriptString;
    clothingItemExtra: ScriptDelimiterArray<string>; // ScriptStringArray;
    clothingItemExtraOption: ScriptDelimiterArray<string>; // ScriptStringArray;
    colorBlue: ScriptInt;
    colorGreen: ScriptInt;
    colorRed: ScriptInt;
    conditionAffectsCapacity: ScriptBoolean;
    conditionLowerNormal: ScriptFloat;
    conditionLowerOffroad: ScriptFloat;
    conditionLowerStandard: ScriptFloat;
    conditionMax: ScriptInt;
    count: ScriptInt;
    countDownSound: ScriptString;
    customContextMenu: ScriptString;
    customEatSound: ScriptString;
    disappearOnUse: ScriptBoolean;
    displayCategory: ScriptString;
    displayName: ScriptString;
    eatType: ScriptString;
    engineLoudness: ScriptFloat;
    equippedNoSprint: ScriptBoolean;
    evolvedRecipeName: ScriptString;
    explosionSound: ScriptString;
    fabricType: ScriptString;
    fatigueChange: ScriptFloat;
    fishingLure: ScriptBoolean;
    foodType: ScriptString;
    gunType: ScriptString;
    icon: ScriptString;
    iconsForTexture: ScriptDelimiterArray<string>; // ScriptStringArray;
    isCookable: ScriptBoolean;
    isWaterSource: ScriptBoolean;
    itemWhenDry: ScriptString;
    keepOnDeplete: ScriptBoolean;
    lightDistance: ScriptInt;
    lightStrength: ScriptFloat;
    lipids: ScriptInt;
    makeUpType: ScriptString;
    maxAmmo: ScriptInt;
    maxCapacity: ScriptInt;
    mechanicsItem: ScriptBoolean;
    mediaCategory: ScriptString;
    medical: ScriptBoolean;
    metalValue: ScriptFloat;
    onCreate: ScriptString;
    obsolete: ScriptBoolean;
    placeMultipleSound: ScriptString;
    placeOneSound: ScriptString;
    poison: ScriptBoolean;
    poisonDetectionLevel: ScriptInt;
    primaryAnimMask: ScriptString;
    protectFromRainWhenEquipped: ScriptBoolean;
    proteins: ScriptInt;
    rainFactor: ScriptFloat;
    reduceInfectionPower: ScriptFloat;
    remoteController: ScriptBoolean;
    remoteRange: ScriptInt;
    replaceOnUse: ScriptString;
    replaceOnUseOn: ScriptString;
    replaceTypes: ScriptDelimiterArray<ItemReplaceType>;
    requireInHandOrInventory: ScriptDelimiterArray<string>; // ScriptStringArray;
    replaceInPrimaryHand: ScriptDelimiterArray<string>; // ScriptStringArray;
    replaceInSecondHand: ScriptDelimiterArray<string>; // ScriptStringArray;
    requiresEquippedBothHands: ScriptBoolean;
    runSpeedModifier: ScriptFloat;
    scaleWorldIcon: ScriptFloat;
    secondaryAnimMask: ScriptString;
    soundRadius: ScriptInt;
    staticModel: ScriptString;
    stressChange: ScriptInt;
    survivalGear: ScriptBoolean;
    suspensionCompression: ScriptFloat;
    suspensionDamping: ScriptFloat;
    swingAnim: ScriptString;
    tags: ScriptDelimiterArray<string>;
    tooltip: ScriptString;
    torchCone: ScriptBoolean;
    torchDot: ScriptFloat;
    trap: ScriptBoolean;
    unhappyChange: ScriptInt;
    useDelta: ScriptFloat;
    useWhileEquipped: ScriptBoolean;
    useWorldItem: ScriptBoolean;
    vehicleType: ScriptInt;
    weight: ScriptFloat;
    weightEmpty: ScriptFloat;
    wet: ScriptBoolean;
    wetCooldown: ScriptFloat;
    wheelFriction: ScriptFloat;
    worldObjectSprite: ScriptString;
    worldStaticModel: ScriptString;

    readonly type: string;

    constructor(bag: ParseBag, operator: '=' | ':', type: string) {
        super(bag, operator);
        this.type = type;
    }

    onPropertyValue(property: string, value: string): boolean {
        property = property.trim();
        value = value.trim();
        switch (property.toLowerCase()) {
            case 'activateditem':
                this.activatedItem = getBoolean(value);
                return true;
            case 'alarmsound':
                this.alarmSound = getString(value);
                return true;
            case 'alcohol':
                this.alcohol = getBoolean(value);
                return true;
            case 'alcoholic':
                this.alcoholic = getBoolean(value);
                return true;
            case 'alcoholpower':
                this.alcoholPower = getFloat(value);
                return true;
            case 'alwayswelcomegift':
                this.alwaysWelcomeGift = getBoolean(value);
                return true;
            case 'bodylocation':
                this.bodyLocation = getString(value);
                return true;
            case 'boredomchange':
                this.boredomChange = getInt(value);
                return true;
            case 'calories':
                this.calories = getInt(value);
                return true;
            case 'canbandage':
                this.canBandage = getBoolean(value);
                return true;
            case 'canhaveholes':
                this.canHaveHoles = getBoolean(value);
                return true;
            case 'carbohydrates':
                this.carbohydrates = getInt(value);
                return true;
            case 'clothingextrasubmenu':
                this.clothingExtraSubmenu = getString(value);
                return true;
            case 'clothingitem':
                this.clothingItem = getString(value);
                return true;
            case 'clothingitemextra':
                this.clothingItemExtra = new DelimiterArray(';', getString(value));
                return true;
            case 'clothingitemextraoption':
                this.clothingItemExtraOption = new DelimiterArray(';', getString(value));
                return true;
            case 'conditionaffectscapacity':
                this.conditionAffectsCapacity = getBoolean(value);
                return true;
            case 'conditionlowerstandard':
                this.conditionLowerStandard = getFloat(value);
                return true;
            case 'conditionmax':
                this.conditionMax = getInt(value);
                return true;
            case 'count':
                this.count = getInt(value);
                return true;
            case 'customeatsound':
                this.customEatSound = getString(value);
                return true;
            case 'disappearonuse':
                this.disappearOnUse = getBoolean(value);
                return true;
            case 'displayname':
                this.displayName = getString(value);
                return true;
            case 'eattype':
                this.eatType = getString(value);
                return true;
            case 'equippednosprint':
                this.equippedNoSprint = getBoolean(value);
                return true;
            case 'fabrictype':
                this.fabricType = getString(value);
                return true;
            case 'fishinglure':
                this.fishingLure = getBoolean(value);
                return true;
            case 'iscookable':
                this.isCookable = getBoolean(value);
                return true;
            case 'lightdistance':
                this.lightDistance = getInt(value);
                return true;
            case 'lightstrength':
                this.lightStrength = getFloat(value);
                return true;
            case 'lipids':
                this.lipids = getInt(value);
                return true;
            case 'makeuptype':
                this.makeUpType = getString(value);
                return true;
            case 'maxcapacity':
                this.maxCapacity = getInt(value);
                return true;
            case 'mechanicsitem':
                this.mechanicsItem = getBoolean(value);
                return true;
            case 'mediacategory':
                this.mediaCategory = getString(value);
                return true;
            case 'medical':
                this.medical = getBoolean(value);
                return true;
            case 'oncreate':
                this.onCreate = getString(value);
                return true;
            case 'placemultiplesound':
                this.placeMultipleSound = getString(value);
                return true;
            case 'placeonesound':
                this.placeOneSound = getString(value);
                return true;
            case 'primaryanimmask':
                this.primaryAnimMask = getString(value);
                return true;
            case 'protectfromrainwhenequipped':
                this.protectFromRainWhenEquipped = getBoolean(value);
                return true;
            case 'proteins':
                this.proteins = getInt(value);
                return true;
            case 'replacetypes':
                this.replaceTypes = new DelimiterArray(';');
                const entries = getString(value).split(';');
                for (const entry of entries) {
                    const [key, value] = entry.split(' ').map((a) => {
                        return a.trim();
                    });
                    this.replaceTypes.values.push(new ItemReplaceType(key, value));
                }
                return true;
            case 'runspeedmodifier':
                this.runSpeedModifier = getFloat(value);
                return true;
            case 'scaleworldicon':
                this.scaleWorldIcon = getFloat(value);
                return true;
            case 'secondaryanimmask':
                this.secondaryAnimMask = getString(value);
                return true;
            case 'soundradius':
                this.soundRadius = getInt(value);
                return true;
            case 'stresschange':
                this.stressChange = getInt(value);
                return true;
            case 'torchcone':
                this.torchCone = getBoolean(value);
                return true;
            case 'torchdot':
                this.torchDot = getFloat(value);
                return true;
            case 'unhappychange':
                this.unhappyChange = getInt(value);
                return true;
            case 'useworlditem':
                this.useWorldItem = getBoolean(value);
                return true;
            case 'vehicletype':
                this.vehicleType = getInt(value);
                return true;
            case 'replaceonuseon':
                this.replaceOnUseOn = getString(value);
                return true;
            case 'requireinhandorinventory':
                this.requireInHandOrInventory = new DelimiterArray('/', getString(value));
                return true;
            case 'replaceinprimaryhand':
                this.replaceInPrimaryHand = new DelimiterArray(' ', getString(value));
                return true;
            case 'replaceinsecondhand':
                this.replaceInSecondHand = new DelimiterArray(' ', getString(value));
                return true;
            case 'trap':
                this.trap = getBoolean(value);
                return true;
            case 'usedelta':
                this.useDelta = getFloat(value);
                return true;
            case 'usewhileequipped':
                this.useWhileEquipped = getBoolean(value);
                return true;
            case 'weight':
                this.weight = getFloat(value);
                return true;
            case 'weightempty':
                this.weightEmpty = getFloat(value);
                return true;
            case 'worldobjectsprite':
                this.worldStaticModel = getString(value);
                return true;
            case 'attachmentsprovided':
                this.attachmentsProvided = new DelimiterArray(';', getString(value));
                return true;
            case 'attachmentreplacement':
                this.attachmentReplacement = getString(value);
                return true;
            case 'iswatersource':
                this.isWaterSource = getBoolean(value);
                return true;
            case 'canstorewater':
                this.canStoreWater = getBoolean(value);
                return true;
            case 'canstack':
                this.canStack = getBoolean(value);
                return true;
            case 'poison':
                this.poison = getBoolean(value);
                return true;
            case 'foodtype':
                this.foodType = getString(value);
                return true;
            case 'fatiguechange':
                this.fatigueChange = getFloat(value); // fatigueChange /= 100 in PZ.
                return true;
            case 'posiondetectionlevel':
                this.poisonDetectionLevel = getInt(value);
                return true;
            case 'tooltip':
                this.tooltip = getString(value);
                return true;
            case 'displaycategory':
                this.displayCategory = getString(value);
                return true;
            case 'requiresequippedbothhands':
                this.requiresEquippedBothHands = getBoolean(value);
                return true;
            case 'breaksound':
                this.breakSound = getString(value);
                return true;
            case 'replaceonuse':
                this.replaceOnUse = getString(value);
                return true;
            case 'bandagepower':
                this.bandagePower = getFloat(value);
                return true;
            case 'reduceinfectionpower':
                this.reduceInfectionPower = getFloat(value);
                return true;
            case 'canberemote':
                this.canBeRemote = getBoolean(value);
                return true;
            case 'remotecontroller':
                this.remoteController = getBoolean(value);
                return true;
            case 'remoterange':
                this.remoteRange = getInt(value);
                return true;
            case 'countdownsound':
                this.countDownSound = getString(value);
                return true;
            case 'explosionsound':
                this.explosionSound = getString(value);
                return true;
            case 'colorred':
                this.colorRed = getInt(value);
                return true;
            case 'colorgreen':
                this.colorGreen = getInt(value);
                return true;
            case 'colorblue':
                this.colorBlue = getInt(value);
                return true;
            case 'evolvedrecipename':
                this.evolvedRecipeName = getString(value);
                return true;
            case 'metalvalue':
                this.metalValue = getFloat(value);
                return true;
            case 'wet':
                this.wet = getBoolean(value);
                return true;
            case 'wetcooldown':
                this.wetCooldown = getFloat(value);
                return true;
            case 'itemwhendry':
                this.itemWhenDry = getString(value);
                return true;
            case 'keepondeplete':
                this.keepOnDeplete = getBoolean(value);
                return true;
            case 'brakeforce':
                this.brakeForce = getInt(value);
                return true;
            case 'chancetospawndamaged':
                this.chanceToSpawnDamaged = getInt(value);
                return true;
            case 'conditionlowernormal':
                this.conditionLowerNormal = getFloat(value);
                return true;
            case 'conditionloweroffroad':
                this.conditionLowerOffroad = getFloat(value);
                return true;
            case 'wheelfriction':
                this.wheelFriction = getFloat(value);
                return true;
            case 'suspensioncompression':
                this.suspensionCompression = getFloat(value);
                return true;
            case 'engineloudness':
                this.engineLoudness = getFloat(value);
                return true;
            case 'suspensiondamping':
                this.suspensionDamping = getFloat(value);
                return true;
            case 'customcontextmenu':
                this.customContextMenu = getString(value); // ContextMenu_${CustomContextMenu}
                return true;
            case 'iconsfortexture':
                this.iconsForTexture = new DelimiterArray(';', getString(value));
                return true;
            case 'bloodlocation':
                this.bloodLocation = new DelimiterArray(';', getString(value));
                return true;
            case 'closekillmove':
                this.closeKillMove = getString(value);
                return true;
            case 'ammotype':
                this.ammoType = getString(value); // PZ code doesn't trim this for some reason..
                return true;
            case 'maxammo':
                this.maxAmmo = getInt(value);
                return true;
            case 'guntype':
                this.gunType = getString(value); // PZ code doesn't trim this for some reason..
                return true;
            case 'attachmenttype':
                this.attachmentType = getString(value);
                return true;
            case 'icon':
                this.icon = getString(value);
                return true;
            case 'survivalgear':
                this.survivalGear = getBoolean(value);
                return true;
            case 'swinganim':
                this.swingAnim = getString(value);
                return true;
            case 'tags':
                this.tags = new DelimiterArray(';', getString(value));
                return true;
            case 'type':
                return true;
            case 'worldstaticmodel':
                this.worldStaticModel = getString(value);
                return true;
            case 'obsolete':
                this.obsolete = getBoolean(value);
                return true;
            case 'staticmodel':
                this.staticModel = getString(value);
                return true;
            case 'rainfactor':
                this.rainFactor = getFloat(value);
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

        const { modelWeaponParts, replaceTypes } = this as any;

        function processDictionary(dict: { [name: string]: any }) {
            const keys = Object.keys(dict);
            keys.sort((a, b) => a.localeCompare(b));
            for (const key of keys) {
                if (key === '__name') continue;
                if (key === '__properties') continue;
                if (key === '__operator') continue;
                if (key === 'ignoreProperties') continue;
                if (key === 'modelWeaponParts') {
                    for (const entry of modelWeaponParts!.values) {
                        s += `${prefix}    modelWeaponPart${' '.repeat(
                            maxLenKey - 'modelWeaponPart'.length
                        )} = ${entry.toScript('')},\n`;
                    }
                    continue;
                }

                const value = dict[key];
                processValue(key, value);
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
        return 'item';
    }
}

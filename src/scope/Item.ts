import { CODE, DESC, EXAMPLE, HEAD, LUA_EXAMPLE, Property as Property, PropertyDelimiter, Scope } from './Scope';

export const ITEM_TYPES = [
    'AlarmClock',
    'AlarmClockClothing',
    'Clothing',
    'Container',
    'Drainable',
    'Food',
    'Key',
    'KeyRing',
    'Literature',
    'Map',
    'Moveable',
    'Normal',
    'Radio',
    'Weapon',
    'WeaponPart',
];

export type ItemType =
    | 'AlarmClock'
    | 'AlarmClockClothing'
    | 'Clothing'
    | 'Container'
    | 'Drainable'
    | 'Food'
    | 'Key'
    | 'KeyRing'
    | 'Literature'
    | 'Map'
    | 'Moveable'
    | 'Normal'
    | 'Radio'
    | 'Weapon'
    | 'WeaponPart';

/**
 * Templates, documents, and completes types properties for items in ZedScript.
 *
 * Translated Documentation from PZWIKI:
 * https://pzwiki.net/wiki/Scripts_guide/Item_Script_Parameters
 *
 * @author Jab
 */
export class ItemScope extends Scope {
    delimiter: PropertyDelimiter = '=';
    properties: { [name: string]: Property } = {
        Alcoholic: {
            type: 'boolean',
            description: `
                The parameter indicates that the item contains alcohol. Used for alcoholic drinks and alcohol-sterilized
                bandages.
            `,
            example: 'Alcoholic = true,',
        },
        BandagePower: {
            type: 'int',
            description: `
                The modifier affects how long the medical bandage stays clean, the ability to clear a burn, and the
                ability to apply the item as a bandage.
            `,
            example: 'BandagePower = 4,',
        },
        BrakeForce: {
            type: 'int',
            description: 'Vehicle part brake power modifier.',
            example: 'BrakeForce = 25,',
        },
        CanBandage: {
            type: 'boolean',
            description: 'Indicates whether this item can apply a bandage to a wound.',
            example: 'CanBandage = true,',
        },
        CanStoreWater: {
            type: 'boolean',
            description: 'If the parameter is true, then the item will be able to store water.',
            example: 'CanStoreWater = true,',
        },
        ChanceToSpawnDamaged: {
            type: 'int',
            description: `
                Parameter for vehicle parts. The parameter sets a modifier for the chance of spawning a damaged part.
            `,
            example: 'ChanceToSpawnDamaged = 25,',
        },
        ColorBlue: {
            type: 'int',
            range: [0, 255],
            description: `
                Sets the blue color parameter (0-255) to use in the tint of the item's icon and to determine the color
                of the light bulb's glow.
            `,
            example: 'ColorBlue = 0,',
        },
        ColorGreen: {
            type: 'int',
            range: [0, 255],
            description: `
                Sets the green color parameter (0-255) to use in the tint of the item's icon and to determine the color
                of the light bulb's glow.
            `,
            example: 'ColorGreen = 0,',
        },
        ColorRed: {
            type: 'int',
            range: [0, 255],
            description: `
                Sets the red color parameter (0-255) to use in the tint of the item's icon and to determine the color of
                the light bulb's glow.
            `,
            example: 'ColorRed = 0,',
        },
        ConditionAffectsCapacity: {
            type: 'boolean',
            description: 'If the parameter is true, then the state of the item will affect the capacity of the item.',
            example: 'ConditionAffectsCapacity = true,',
        },
        ConditionLowerOffroad: {
            type: 'float',
            description: 'A modifier for the Vehicle Part that affects how badly the part will be damaged off-road.',
            example: 'ConditionLowerOffroad = 0.35,',
        },
        ConditionLowerStandard: {
            type: 'float',
            description: `
                A modifier for the Vehicle Part that affects how badly the part will be damaged on a normal road.
            `,
            example: 'ConditionLowerStandard = 0.04,',
        },
        ConditionMax: {
            type: 'int',
            description: 'Sets maximum durability.',
            example: 'ConditionMax = 10,',
        },
        Count: {
            type: 'int',
            description: 'Determines how many items of this type will appear when spawning/crafting this type of item.',
            example: 'Count = 5,',
        },
        DisplayCategory: {
            type: 'string',
            description: 'Specifies the category of the item to display. (In the list of items)',
            example: 'DisplayCategory = Camping,',
        },
        DisplayName: {
            type: 'string',
            description: `
                The item's display name.

                > NOTE: Translations for the item's name overrides this parameter.
            `,
            example: 'DisplayName = Opened Canned Tomato,',
        },
        EngineLoudness: {
            type: 'int',
            description: 'Vehicle engine noise modifier.',
            example: 'EngineLoudness = 120,',
        },
        EquippedNoSprint: {
            type: 'boolean',
            description: `
                If this parameter is set to true, then the player will not be able to run fast when this item is
                equipped.
            `,
            example: 'EquippedNoSprint = true,',
        },
        FishingLure: {
            type: 'boolean',
            description: 'Determines if the item is a Fishing lure.',
            example: 'FishingLure = true,',
        },
        GunType: {
            type: 'string',
            description: 'Determines the weapon that this item will fit.',
            example: 'GunType = Base.Pistol2,',
        },
        Icon: {
            type: 'string',
            description: `
                The icon for the item. The file must:
                - Start with **Item_**
                - Use the extension **png**
                - Be located in the **media/textures/** directory.
                
                Example: **media/textures/Item_JarBox.png**

                ${HEAD} Food Icons
                You can specify icons for rotten, cooked, overdone, and
                burnt food by adding the suffix **Rotten**, **Cooked**,
                **Overdone**, **Burnt**.
                
                Example: **media/textures/Item_PikeCooked.png**
            `,
        },
        ItemWhenDry: {
            type: 'string',
            description: `
                The parameter specifies the item that the original item will be replaced with after drying.
            `,
            example: 'ItemWhenDry = Base.BathTowel,',
        },
        MaxAmmo: {
            type: 'int',
            description: `
                Parameter for weapons. Determines the number of ammo that can fit in the item.
            `,
            example: 'MaxAmmo = 15,',
        },
        MaxCapacity: {
            type: 'int',
            description: 'Max capacity for vehicle part.',
            example: 'MaxCapacity = 40,',
        },
        MechanicsItem: {
            type: 'boolean',
            description: 'Set "ItemType" to "Mechanic".',
            example: 'MechanicsItem = true,',
        },
        MediaCategory: {
            type: 'boolean',
            description: 'Specifies the item type that will be used to determine the playback device.',
            example: 'MediaCategory = Retail-VHS,',
        },
        Medical: {
            type: 'boolean',
            description: 'Set "ItemType" to "Medical".',
            example: 'Medical = true,',
        },
        MetalValue: {
            type: 'boolean',
            description: 'Sets the amount of metal in the item. Affects the operation of the microwave.',
            example: 'MetalValue = 150,',
        },
        OnCreate: {
            type: 'lua',
            description: `
            Specifies a Lua function that will be called when the item spawns. An object is passed to the function
            as an argument. It is convenient to use to set the parameters of an object when it appears in the world.
            `,
            example: 'OnCreate = Fishing.OnCreateFish,',
            luaPrefix: 'Item.OnCreate',
            luaExample: `
                Fishing.OnCreateFish = function(_item)
                    if not _item then return end
                    -- [CODE]
                end
            `,
        },
        PlaceMultipleSound: {
            type: 'string',
            description: 'Specifies the sound that will be played when multiple items are placed on the ground.',
            example: 'PlaceMultipleSound = BoxOfRoundsPlaceAll,',
        },
        PlaceOneSound: {
            type: 'string',
            description: 'Specifies the sound that will play when an item is placed on the ground.',
            example: 'PlaceOneSound = BoxOfRoundsPlaceOne,',
        },
        PrimaryAnimMask: {
            type: 'string',
            description: `
                Specifies the animation mask that will be applied to the animation when the item is in the main hand.
            `,
            example: 'PrimaryAnimMask = HoldingTorchRight,',
        },
        ProtectFromRainWhenEquipped: {
            type: 'boolean',
            description: `
                If this parameter is true, then the player is protected from rain if the item is equipped.
            `,
            example: 'ProtectFromRainWhenEquipped = true,',
        },
        RainFactor: {
            type: 'float',
            description: `
                Modifier for the rate at which water enters this item when it rains. The object must be able to store
                water.
            `,
            example: 'RainFactor = 0.8,',
        },
        RemoteController: {
            type: 'boolean',
            description: 'Determines if the item is a trap remote control.',
            example: 'RemoteController = true,',
        },
        ReplaceOnUse: {
            type: 'string',
            description: `
                The parameter specifies the type of item that the player will receive after using the original item.
            `,
            example: 'ReplaceOnUse = TinCanEmpty,',
        },
        ReplaceOnUseOn: {
            type: 'string',
            description: `
                Used to specify an item to replace when the item is filled with something. 
                
                > Written in the format: **"SourceItem" - "ResultItem"**
            `,
            example: 'ReplaceOnUseOn = WaterSource-WaterPot,',
        },
        ReplaceTypes: {
            type: 'string',
            description: `
                Used to specify an item to replace when the item is filled with something. 
                
                > Written in the format: **"Source ResultItem; Source2 ResultItem2"**
            `,
            example: 'ReplaceTypes = PetrolSource WaterBottlePetrol ; WaterSource WaterBottleFull,',
        },
        RequiresEquippedBothHands: {
            type: 'boolean',
            description: 'If the parameter is true, then the item must be held in both hands to use it.',
            example: 'RequiresEquippedBothHands = true,',
        },
        SecondaryAnimMaskPage: {
            type: 'string',
            description: `
                Specifies the animation mask that will be applied to the animation when the item is in the secondary
                hand.
            `,
            example: 'SecondaryAnimMask = HoldingTorchLeft,',
        },
        SurvivalGear: {
            type: 'boolean',
            description: 'Set "ItemType" to "SurvivalGear".',
            example: 'SurvivalGear = true,',
        },
        SuspensionCompression: {
            type: 'float',
            description: 'Defines a modifier for suspension compression.',
            example: 'SuspensionCompression = 1.83,',
        },
        SuspensionDamping: {
            type: 'float',
            description: 'Specifies a modifier for suspension damping.',
            example: 'SuspensionDamping = 1.88,',
        },
        Tags: {
            type: 'string',
            description: `
                Tags are specified in the parameter. With their help, it is easy to select a group of items by a
                specific tag. (E.G: Recipes)
            `,
            example: 'Tags = Hammer;RemoveBarricade,',
        },
        Tooltip: {
            type: 'string',
            description: 'Specifies a Tooltip string. Specifies the line ID from the translation file.',
            example: 'Tooltip = Tooltip_item_Campfire,',
        },
        Trap: {
            type: 'boolean',
            description: 'This parameter is used to check if the item is a trap.',
            example: 'Trap = true,',
        },
        Type: {
            type: 'enum',
            values: ITEM_TYPES,
            example: 'Type = Weapon,',
        },
        VehicleType: {
            type: 'enum',
            values: {
                1: 'Standard',
                2: 'HeavyDuty',
                3: 'Sport',
            },
        },
        Weight: {
            type: 'float',
            description: 'Sets the weight of the item.',
            example: 'Weight = 1.25,',
        },
        WetCooldown: {
            type: 'int',
            description: 'Cooldown wetness modifier for item.',
            example: 'WetCooldown = 8000,',
        },
        WheelFriction: {
            type: 'float',
            description: 'Modifier friction of wheel for vehicle part.',
            example: 'WheelFriction = 1.8,',
        },
        WorldStaticModel: {
            type: 'string',
            description: 'Used to display an item on the ground.',
            example: 'WorldStaticModel = BookYellowBrown_Ground,',
        },
    };
}

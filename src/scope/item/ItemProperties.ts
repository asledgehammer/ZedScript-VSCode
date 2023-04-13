import { SKILL_VALUES, ScopeProperty } from '../Scope';
import { HEAD } from '../Scope';

export type ItemProperty = ScopeProperty & {
    itemTypes: ItemType[];
};

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

const ATTACHMENTS_VALUES = ['SmallBeltLeft', 'SmallBeltRight', 'HolsterLeft', 'HolsterRight', 'Back', 'Bag'];

const BLOOD_CLOTHING_TYPE_VALUES = [
    'Jacket',
    'LongJacket',
    'Trousers',
    'ShortsShort',
    'Shirt',
    'ShirtLongSleeves',
    'ShirtNoSleeves',
    'Jumper',
    'JumperNoSleeves',
    'Shoes',
    'FullHelmet',
    'Apron',
    'Bag',
    'Hands',
    'Head',
    'Neck',
    'UpperBody',
    'LowerBody',
    'LowerLegs',
    'UpperLegs',
    'LowerArms',
    'UpperArms',
    'Groin',
];

const BODY_LOCATION_VALUES = [
    'Bandage',
    'Wound',
    'BeltExtra',
    'Belt',
    'BellyButton',
    'MakeUp_FullFace',
    'MakeUp_Eyes',
    'MakeUp_EyesShadow',
    'MakeUp_Lips',
    'Mask',
    'MaskEyes',
    'MaskFull',
    'Underwear',
    'UnderwearBottom',
    'UnderwearTop',
    'UnderwearExtra1',
    'UnderwearExtra2',
    'Hat',
    'FullHat',
    'Ears',
    'EarTop',
    'Nose',
    'Torso1',
    'Torso1Legs1',
    'TankTop',
    'Tshirt',
    'ShortSleeveShirt',
    'LeftWrist',
    'RightWrist',
    'Shirt',
    'Neck',
    'Necklace',
    'Necklace_Long',
    'Right_MiddleFinger',
    'Left_MiddleFinger',
    'Left_RingFinger',
    'Right_RingFinger',
    'Hands',
    'HandsLeft',
    'HandsRight',
    'Socks',
    'Legs1',
    'Pants',
    'Skirt',
    'Legs5',
    'Dress',
    'BodyCostume',
    'Sweater',
    'SweaterHat',
    'Jacket',
    'Jacket_Down',
    'Jacket_Bulky',
    'JacketHat',
    'JacketHat_Bulky',
    'JacketSuit',
    'FullSuit',
    'Boilersuit',
    'FullSuitHead',
    'FullTop',
    'BathRobe',
    'Shoes',
    'FannyPackFront',
    'FannyPackBack',
    'AmmoStrap',
    'TorsoExtra',
    'TorsoExtraVest',
    'Tail',
    'Back',
    'LeftEye',
    'RightEye',
    'Eyes',
    'Scarf',
    'ZedDmg',
];

const FABRIC_TYPE_VALUES = ['Cotton', 'Denim', 'Leather'];

const MAKE_UP_VALUES: string[] = ['FullFace', 'Eyes', 'EyesShadow', 'Lips'];

export const properties: { [name: string]: ItemProperty } = {
    /** NORMAL *************************************************************************/
    AlwaysWelcomeGift: {
        itemTypes: ['Normal'],
        type: 'boolean',
        deprecated: true,
    },

    Alcoholic: {
        itemTypes: ['Normal'],
        type: 'boolean',
        description: `
                    The parameter indicates that the item contains alcohol. Used for alcoholic drinks and alcohol-sterilized
                    bandages.
                `,
        example: 'Alcoholic = true,',
    },
    BandagePower: {
        itemTypes: ['Normal'],
        type: 'int',
        description: `
                    The modifier affects how long the medical bandage stays clean, the ability to clear a burn, and the
                    ability to apply the item as a bandage.
                `,
        example: 'BandagePower = 4,',
    },
    BrakeForce: {
        itemTypes: ['Normal'],
        type: 'int',
        description: 'Vehicle part brake power modifier.',
        example: 'BrakeForce = 25,',
    },
    CanBandage: {
        itemTypes: ['Normal'],
        type: 'boolean',
        description: 'Indicates whether this item can apply a bandage to a wound.',
        example: 'CanBandage = true,',
    },
    CanStoreWater: {
        itemTypes: ['Normal'],
        type: 'boolean',
        description: 'If the parameter is true, then the item will be able to store water.',
        example: 'CanStoreWater = true,',
    },
    ChanceToSpawnDamaged: {
        itemTypes: ['Normal'],
        type: 'int',
        description: `
                    Parameter for vehicle parts. The parameter sets a modifier for the chance of spawning a damaged part.
                `,
        example: 'ChanceToSpawnDamaged = 25,',
    },
    ColorBlue: {
        itemTypes: ['Normal'],
        type: 'int',
        range: [0, 255],
        description: `
                    Sets the blue color parameter (0-255) to use in the tint of the item's icon and to determine the color
                    of the light bulb's glow.
                `,
        example: 'ColorBlue = 0,',
    },
    ColorGreen: {
        itemTypes: ['Normal'],
        type: 'int',
        range: [0, 255],
        description: `
                    Sets the green color parameter (0-255) to use in the tint of the item's icon and to determine the color
                    of the light bulb's glow.
                `,
        example: 'ColorGreen = 0,',
    },
    ColorRed: {
        itemTypes: ['Normal'],
        type: 'int',
        range: [0, 255],
        description: `
                    Sets the red color parameter (0-255) to use in the tint of the item's icon and to determine the color of
                    the light bulb's glow.
                `,
        example: 'ColorRed = 0,',
    },
    ConditionAffectsCapacity: {
        itemTypes: ['Normal'],
        type: 'boolean',
        description: 'If the parameter is true, then the state of the item will affect the capacity of the item.',
        example: 'ConditionAffectsCapacity = true,',
    },
    ConditionLowerOffroad: {
        itemTypes: ['Normal'],
        type: 'float',
        description: 'A modifier for the Vehicle Part that affects how badly the part will be damaged off-road.',
        example: 'ConditionLowerOffroad = 0.35,',
    },
    ConditionLowerStandard: {
        itemTypes: ['Normal'],
        type: 'float',
        description: `
                    A modifier for the Vehicle Part that affects how badly the part will be damaged on a normal road.
                `,
        example: 'ConditionLowerStandard = 0.04,',
    },
    ConditionMax: {
        itemTypes: ['Normal'],
        type: 'int',
        description: 'Sets maximum durability.',
        example: 'ConditionMax = 10,',
    },
    Count: {
        itemTypes: ['Normal'],
        type: 'int',
        description: 'Determines how many items of this type will appear when spawning/crafting this type of item.',
        example: 'Count = 5,',
    },
    DisplayCategory: {
        itemTypes: ['Normal'],
        type: 'string',
        description: 'Specifies the category of the item to display. (In the list of items)',
        example: 'DisplayCategory = Camping,',
    },
    DisplayName: {
        itemTypes: ['Normal'],
        type: 'string',
        description: `
                    The item's display name.
    
                    > NOTE: Translations for the item's name overrides this parameter.
                `,
        example: 'DisplayName = Opened Canned Tomato,',
    },
    EngineLoudness: {
        itemTypes: ['Normal'],
        type: 'int',
        description: 'Vehicle engine noise modifier.',
        example: 'EngineLoudness = 120,',
    },
    EquippedNoSprint: {
        itemTypes: ['Normal'],
        type: 'boolean',
        description: `
                    If this parameter is set to true, then the player will not be able to run fast when this item is
                    equipped.
                `,
        example: 'EquippedNoSprint = true,',
    },
    FishingLure: {
        itemTypes: ['Normal'],
        type: 'boolean',
        description: 'Determines if the item is a Fishing lure.',
        example: 'FishingLure = true,',
    },
    GunType: {
        itemTypes: ['Normal'],
        type: 'string',
        description: 'Determines the weapon that this item will fit.',
        example: 'GunType = Base.Pistol2,',
    },
    Icon: {
        itemTypes: ['Normal'],
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
        itemTypes: ['Normal'],
        type: 'string',
        description: `
                    The parameter specifies the item that the original item will be replaced with after drying.
                `,
        example: 'ItemWhenDry = Base.BathTowel,',
    },
    KnockdownMod: {
        itemTypes: ['Normal'],
        type: 'int',
        deprecated: true,
    },
    /** Note: I don't think this should be a normal property but apparently magazines uses this. */
    MaxAmmo: {
        itemTypes: ['Normal'],
        type: 'int',
        description: `
                    Parameter for weapons. Determines the number of ammo that can fit in the item.
                `,
        example: 'MaxAmmo = 15,',
    },
    MaxCapacity: {
        itemTypes: ['Normal'],
        type: 'int',
        description: 'Max capacity for vehicle part.',
        example: 'MaxCapacity = 40,',
    },
    MechanicsItem: {
        itemTypes: ['Normal'],
        type: 'boolean',
        description: 'Set "ItemType" to "Mechanic".',
        example: 'MechanicsItem = true,',
    },
    MediaCategory: {
        itemTypes: ['Normal'],
        type: 'boolean',
        description: 'Specifies the item type that will be used to determine the playback device.',
        example: 'MediaCategory = Retail-VHS,',
    },
    Medical: {
        itemTypes: ['Normal'],
        type: 'boolean',
        description: 'Set "ItemType" to "Medical".',
        example: 'Medical = true,',
    },
    MetalValue: {
        itemTypes: ['Normal'],
        type: 'boolean',
        description: 'Sets the amount of metal in the item. Affects the operation of the microwave.',
        example: 'MetalValue = 150,',
    },
    OnCreate: {
        itemTypes: ['Normal'],
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
        itemTypes: ['Normal'],
        type: 'string',
        description: 'Specifies the sound that will be played when multiple items are placed on the ground.',
        example: 'PlaceMultipleSound = BoxOfRoundsPlaceAll,',
    },
    PlaceOneSound: {
        itemTypes: ['Normal'],
        type: 'string',
        description: 'Specifies the sound that will play when an item is placed on the ground.',
        example: 'PlaceOneSound = BoxOfRoundsPlaceOne,',
    },
    PrimaryAnimMask: {
        itemTypes: ['Normal'],
        type: 'string',
        description: `
                    Specifies the animation mask that will be applied to the animation when the item is in the main hand.
                `,
        example: 'PrimaryAnimMask = HoldingTorchRight,',
    },
    ProtectFromRainWhenEquipped: {
        itemTypes: ['Normal'],
        type: 'boolean',
        description: `
                    If this parameter is true, then the player is protected from rain if the item is equipped.
                `,
        example: 'ProtectFromRainWhenEquipped = true,',
    },
    RainFactor: {
        itemTypes: ['Normal'],
        type: 'float',
        description: `
                    Modifier for the rate at which water enters this item when it rains. The object must be able to store
                    water.
                `,
        example: 'RainFactor = 0.8,',
    },
    RemoteController: {
        itemTypes: ['Normal'],
        type: 'boolean',
        description: 'Determines if the item is a trap remote control.',
        example: 'RemoteController = true,',
    },
    ReplaceOnUse: {
        itemTypes: ['Normal'],
        type: 'string',
        description: `
                    The parameter specifies the type of item that the player will receive after using the original item.
                `,
        example: 'ReplaceOnUse = TinCanEmpty,',
    },
    ReplaceOnUseOn: {
        itemTypes: ['Normal'],
        type: 'string',
        description: `
                    Used to specify an item to replace when the item is filled with something. 
                    
                    > Written in the format: **"SourceItem" - "ResultItem"**
                `,
        example: 'ReplaceOnUseOn = WaterSource-WaterPot,',
    },
    ReplaceTypes: {
        itemTypes: ['Normal'],
        type: 'string',
        description: `
                    Used to specify an item to replace when the item is filled with something. 
                    
                    > Written in the format: **"Source ResultItem; Source2 ResultItem2"**
                `,
        example: 'ReplaceTypes = PetrolSource WaterBottlePetrol ; WaterSource WaterBottleFull,',
    },
    RequiresEquippedBothHands: {
        itemTypes: ['Normal'],
        type: 'boolean',
        description: 'If the parameter is true, then the item must be held in both hands to use it.',
        example: 'RequiresEquippedBothHands = true,',
    },
    SecondaryAnimMask: {
        itemTypes: ['Normal'],
        type: 'string',
        description: `
           Specifies the animation mask that will be applied to the animation when the item is in the secondary
           hand.
        `,
        example: 'SecondaryAnimMask = HoldingTorchLeft,',
    },
    SecondaryAnimMaskPage: {
        itemTypes: ['Normal'],
        type: 'string',
        description: `
                    Specifies the animation mask that will be applied to the animation when the item is in the secondary
                    hand.
                `,
        example: 'SecondaryAnimMask = HoldingTorchLeft,',
    },
    StaticModel: {
        itemTypes: ['Normal'],
        type: 'string',
        description: 'Used to display the item in hands.',
        example: 'StaticModel = Book,',
    },
    SurvivalGear: {
        itemTypes: ['Normal'],
        type: 'boolean',
        description: 'Set "ItemType" to "SurvivalGear".',
        example: 'SurvivalGear = true,',
    },
    SuspensionCompression: {
        itemTypes: ['Normal'],
        type: 'float',
        description: 'Defines a modifier for suspension compression.',
        example: 'SuspensionCompression = 1.83,',
    },
    SuspensionDamping: {
        itemTypes: ['Normal'],
        type: 'float',
        description: 'Specifies a modifier for suspension damping.',
        example: 'SuspensionDamping = 1.88,',
    },
    Tags: {
        itemTypes: ['Normal'],
        type: 'string',
        description: `
                    Tags are specified in the parameter. With their help, it is easy to select a group of items by a
                    specific tag. (E.G: Recipes)
                `,
        example: 'Tags = Hammer;RemoveBarricade,',
    },
    Tooltip: {
        itemTypes: ['Normal'],
        type: 'string',
        description: 'Specifies a Tooltip string. Specifies the line ID from the translation file.',
        example: 'Tooltip = Tooltip_item_Campfire,',
    },
    Trap: {
        itemTypes: ['Normal'],
        type: 'boolean',
        description: 'This parameter is used to check if the item is a trap.',
        example: 'Trap = true,',
    },
    Type: {
        itemTypes: ['Normal'],
        type: 'enum',
        values: ITEM_TYPES,
        example: 'Type = Weapon,',
    },
    VehicleType: {
        itemTypes: ['Normal'],
        type: 'enum',
        values: {
            1: 'Standard',
            2: 'HeavyDuty',
            3: 'Sport',
        },
    },
    Weight: {
        itemTypes: ['Normal'],
        type: 'float',
        description: 'Sets the weight of the item.',
        example: 'Weight = 1.25,',
    },
    WetCooldown: {
        itemTypes: ['Normal'],
        type: 'int',
        description: 'Cooldown wetness modifier for item.',
        example: 'WetCooldown = 8000,',
    },
    WheelFriction: {
        itemTypes: ['Normal'],
        type: 'float',
        description: 'Modifier friction of wheel for vehicle part.',
        example: 'WheelFriction = 1.8,',
    },
    WorldStaticModel: {
        itemTypes: ['Normal'],
        type: 'string',
        description: 'Used to display an item on the ground.',
        example: 'WorldStaticModel = BookYellowBrown_Ground,',
    },

    /* NON-NORMAL COMBO ****************************************************************/

    AlarmSound: {
        itemTypes: ['AlarmClock', 'AlarmClockClothing', 'Clothing'],
        type: 'string',
        description: 'Sets the alarm sound.',
        example: 'AlarmSound = WatchAlarmLoop,',
    },
    BoredomChange: {
        itemTypes: ['Food', 'Literature'],
        type: 'int',
        description: `
            Indicates how much boredom the use of the item will remove. If the number is negative, boredom will
            decrease, if positive, it will increase.
        `,
        example: 'BoredomChange = -50,',
    },
    CanHaveHoles: {
        itemTypes: ['Clothing', 'Container'],
        type: 'boolean',
        description: 'Specifies whether an item can have holes.',
        example: 'CanHaveHoles = false,',
    },
    ClothingItem: {
        itemTypes: ['Clothing', 'Container'],
        type: 'string',
        description: 'Specifies the .xml name of the clothing element script.',
        example: 'ClothingItem = Bag_SurvivorBag,',
    },
    StressChange: {
        itemTypes: ['Food', 'Literature'],
        type: 'int',
        description: `
            Indicates how much stress the use of the item will remove. If the number is negative, stress will
            decrease, if it is positive, it will increase.
        `,
        example: 'StressChange = -15,',
    },
    UnhappyChange: {
        itemTypes: ['Food', 'Literature'],
        type: 'int',
        description: `
            Indicates how much unhappy the use of the item will remove. If the number is negative, unhappy will
            decrease, if it is positive, it will increase.
        `,
        example: 'UnhappyChange = -10,',
    },

    /* CLOTHING & ALARMCLOCKCLOTHING ***************************************************/

    AttachmentsProvided: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'enum',
        values: ATTACHMENTS_VALUES,
        description: 'Sets the equipment slots the item occupies. (Multiple entries are possible)',
        example: 'AttachmentsProvided = HolsterLeft; HolsterRight,',
    },
    BiteDefense: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'int',
        description: 'Specifies the bite protection modifier.',
        example: 'BiteDefense = 20,',
    },
    BloodLocation: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'enum',
        values: BLOOD_CLOTHING_TYPE_VALUES,
        description: 'Specifies the zones where blood will be displayed on this item of clothing.',
        example: 'BloodLocation = FullHelmet; Neck,',
    },
    BodyLocation: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'enum',
        values: BODY_LOCATION_VALUES,
        description: `
            Indicates the part of the body that the clothing is worn.

            All locations are defined here: \`media/lua/shared/NPCs/BodyLocations.lua\`'
        `,
        example: 'BodyLocation = Hat,',
    },
    ChanceToFall: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'int',
        description: 'Chance modifier for clothing item to drop.',
        example: 'ChanceToFall = 60,',
    },
    ClothingExtraSubmenu: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'string',
        description: `
            The parameter specifies an additional option for the context menu of how the item can be equipped by
            default.
        `,
        example: 'ClothingExtraSubmenu = ForwardCap,',
    },
    ClothingItemExtra: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'string',
        description: `
            Indicates an additional option of how the item can be worn.
        `,
        example: 'ClothingItemExtra = Hat_BaseballCap_Reverse,',
    },
    ClothingItemExtraOption: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'string',
        description: `
            Specifies an option for the context menu for the ClothingItemExtra parameter.
        `,
        example: 'ClothingItemExtraOption = ReverseCap,',
    },
    CombatSpeedModifier: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'float',
        description: 'Affects weapon attack speed.',
        example: 'CombatSpeedModifier = 0.9,',
    },
    Cosmetic: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'boolean',
        description: `
            If true, the item will not render a 3D model.
            
            (The exception is an item that is worn on the Eye part of the body)
        `,
        example: 'Cosmetic = true,',
    },
    FabricType: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'enum',
        values: FABRIC_TYPE_VALUES,
        description: 'Specifies the material from which the clothes is made.',
        example: 'FabricType = Denim,',
    },
    IconsForTexture: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'string',
        description: `
            The names of the icons are specified, which in order correspond to the possible textures of the item.

            (As specified in the .xml file of the clothing)
        `,
        example: 'IconsForTexture = BandanaBlack; BandanaBlue; BandanaRed,',
    },
    Insulation: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'float',
        description: 'Modifier for Insulation which is involved in determining cold protection.',
        example: 'Insulation = 0.75,',
    },
    NeckProtectionModifier: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'float',
        range: [0.0, 1.0],
        description: `
            Specifies a modifier that affects the chance of a successful wound to the neck. Max value: 1.0
        `,
        example: 'NeckProtectionModifier = 0.5,',
    },
    RemoveOnBroken: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'boolean',
        description: 'Specifies whether to delete the item when the state becomes zero.',
        example: 'RemoveOnBroken = true,',
    },
    ScratchDefense: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'int',
        description: 'Specifies the scratch protection modifier.',
        example: 'ScratchDefense = 30,',
    },
    StompPower: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'float',
        description: `
            Used for shoes. This parameter specifies the damage modifier for a kick attack against a prone opponent.
        `,
        example: 'StompPower = 2.1,',
    },
    WaterResistance: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'float',
        description: 'Modifier that is involved in determining the protection against moisture.',
        example: 'WaterResistance = 0.45,',
    },
    WeightWet: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'float',
        description: `
            Sets the weight when clothes are wet. 
            
            (The game dynamically calculates the weight depending on how wet the clothes are)
        `,
        example: 'WeightWet = 1.5,',
    },
    WindResistance: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'float',
        description: 'A modifier that is involved in determining wind protection.',
        example: 'WindResistance = 0.15,',
    },
    WorldRender: {
        itemTypes: ['AlarmClockClothing', 'Clothing'],
        type: 'boolean',
        description: 'If false, the item will NOT appear on the ground as a 3D item.',
        example: 'WorldRender = false,',
    },

    /** CONTAINER **********************************************************************/

    AcceptItemFunction: {
        itemTypes: ['Container'],
        type: 'lua',
        luaPrefix: 'AcceptItemFunction.',
        description: `
            Specifies the name of a Lua function that is called to check if the given item can be placed in the
            container. The original item is passed as a parameter and a boolean value is returned.
        `,
        example: 'AcceptItemFunction = AcceptItemFuncForFannyPack,',
        luaExample: `
            function AcceptItemFunction.FannyPack(item)
                return item:getActualWeight() < 0.5;
            end
        `,
    },
    AttachmentReplacement: {
        itemTypes: ['Container'],
        type: 'string',
        description: 'Determines which slot will replace the item.',
        example: 'AttachmentReplacement = Bag,',
    },
    CanBeEquipped: {
        itemTypes: ['Container'],
        type: 'string',
        description: `
            The area on the body where the object will be placed. 
            
            All locations are located here: \`media/lua/shared/NPCs/BodyLocations.lua\`
        `,
        example: 'CanBeEquipped = FannyPackFront,',
    },
    Capacity: {
        itemTypes: ['Container'],
        type: 'int',
        description: 'The inventory capacity of the container.',
        example: 'Capacity = 22,',
    },
    CloseSound: {
        itemTypes: ['Container'],
        type: 'string',
        description: 'The sound that is played when the container is closed.',
        example: 'CloseSound = CloseBag,',
    },
    OnlyAcceptCategory: {
        itemTypes: ['Container'],
        type: 'enum',
        values: ITEM_TYPES,
        example: 'Determines what category of items can be put into the container.',
    },
    OpenSound: {
        itemTypes: ['Container'],
        type: 'string',
        description: 'The sound that will be played when the container is opened.',
        example: 'OpenSound = OpenBag,',
    },
    PutInSound: {
        itemTypes: ['Container'],
        type: 'string',
        deprecated: true,
    },
    ReplaceInPrimaryHand: {
        itemTypes: ['Container'],
        type: 'string',
        description: 'The model that replaces the main hand item with a certain animation.',
        example: 'ReplaceInPrimaryHand = Bag_PistolCase_RHand holdingbagright,',
    },
    ReplaceInSecondHand: {
        itemTypes: ['Container'],
        type: 'string',
        description: 'The model that replaces the second hand item with a specific animation.',
        example: 'ReplaceInSecondHand = Bag_PistolCase_LHand holdingbagleft,',
    },
    RunSpeedModifier: {
        itemTypes: ['Container'],
        type: 'float',
        description: `
            Affects the player's running speed.

            (NOTE: This option only works on backpacks and containers that are worn or carried)
        `,
        example: '',
    },
    // TODO: Implement as enum.
    SoundParameter: {
        itemTypes: ['Container'],
        type: 'string',
        description: `
            A modifier that affects the noise from the container when it is equipped. 
            First parameter is EquippedBaggageContainer, second parameter is: (Values: None, HikingBag, DuffleBag, PlasticBag, SchoolBag, ToteBag, GarbageBag)
        `,
        example: 'SoundParameter = EquippedBaggageContainer HikingBag,',
    },
    WeightReduction: {
        itemTypes: ['Container'],
        type: 'int',
        description: `
            The parameter sets a modifier for reducing the perceived weight of items that are in this ItemContainer.
        `,
        example: 'WeightReduction = 30,',
    },

    /** DRAINABLE **********************************************************************/

    ActivatedItem: {
        itemTypes: ['Drainable'],
        type: 'boolean',
        description: 'The parameter specifies whether the item can be activated. For example, a lighter.',
        example: 'ActivatedItem = true,',
    },
    AlcoholPower: {
        itemTypes: ['Drainable'],
        type: 'int',
        description: `
            A modifier for a medical item that affects the ability to disinfect a wound and the pain from applying
            the item.
        `,
        example: 'AlcoholPower = 4,',
    },
    CantBeConsolided: {
        itemTypes: ['Drainable'],
        type: 'boolean',
        description: `
            If this parameter is true, then this item (Drainable) cannot be combined with an item of a similar type.
        `,
        example: 'CantBeConsolided = true,',
    },
    ConsolidateOption: {
        itemTypes: ['Drainable'],
        type: 'string',
        description: 'Specifies the translation ID for the merging items option.',
        example: 'ConsolidateOption = ContextMenu_Merge,',
    },
    FillFromDispenserSound: {
        itemTypes: ['Drainable'],
        type: 'string',
        description: `
            Specifies the sound that will be played when water is poured into the item from the dispenser.
        `,
        example: 'FillFromDispenserSound = GetWaterFromDispenserPlasticMedium,',
    },
    FillFromTapSound: {
        itemTypes: ['Drainable'],
        type: 'string',
        description: 'Specifies the sound that will be played when tap water is poured into an item.',
        example: 'FillFromTapSound = GetWaterFromTapPlasticBig,',
    },
    HairDye: {
        itemTypes: ['Drainable'],
        type: 'boolean',
        description: 'Indicates that the item is hair dye.',
        example: 'HairDye = true,',
    },
    IsWaterSource: {
        itemTypes: ['Drainable'],
        type: 'boolean',
        description: 'If true, the item can be used as a source of water.',
        example: 'IsWaterSource = true,',
    },
    KeepOnDeplete: {
        itemTypes: ['Drainable'],
        type: 'boolean',
        description: 'Keep an item when used up.',
        example: 'KeepOnDeplete = true,',
    },
    LightDistance: {
        itemTypes: ['Drainable'],
        type: 'int',
        description: 'Specifies the range of the glow of the item.',
        example: 'LightDistance = 25,',
    },
    LightStrength: {
        itemTypes: ['Drainable'],
        type: 'float',
        description: `Determines the strength of the item's glow.`,
        example: 'LightStrength = 2.3,',
    },
    MakeUpType: {
        itemTypes: ['Drainable'],
        type: 'enum',
        values: MAKE_UP_VALUES,
        description: `
            Specifies the location of make up. 
            
            All make up locations are defined here:
            \`media/lua/shared/Definitions/MakeUpDefinitions.lua\`
        `,
        example: 'MakeUpType = Lips,',
    },
    ReplaceOnDeplete: {
        itemTypes: ['Drainable'],
        type: 'string',
        description: `
            Used for Drainable items. Specifies the item that the original item will be replaced with when depleted.
        `,
        example: 'ReplaceOnDeplete = PaintbucketEmpty,',
    },
    TicksPerEquipUse: {
        itemTypes: ['Drainable'],
        type: 'int',
        description: 'The parameter sets the value of how many ticks must pass for the item to spend one use.',
        example: 'TicksPerEquipUse = 110,',
    },
    TorchCone: {
        itemTypes: ['Drainable'],
        type: 'boolean',
        description: 'If the parameter is true, then the item will shine with a cone.',
        example: 'TorchCone = true,',
    },
    TorchDot: {
        itemTypes: ['Drainable'],
        type: 'float',
        description: 'Determines the sector on which the object will shine.',
        example: 'TorchDot = 0.66,',
    },
    UseDelta: {
        itemTypes: ['Drainable'],
        type: 'float',
        description: `Determines how much the Drainable item's value will be spent on a single use.`,
        example: 'UseDelta = 0.16,',
    },
    UseWhileEquipped: {
        itemTypes: ['Drainable'],
        type: 'boolean',
        description: `If true, the drainable item's charge is spent when activated and equipped.`,
        example: 'UseWhileEquipped = false,',
    },
    WeightEmpty: {
        itemTypes: ['Drainable'],
        type: 'float',
        description: `
            Sets the weight for an item when it is empty. 
            (The game calculates the weight depending on how much charge remains)
        `,
        example: 'WeightEmpty = 3.3,',
    },

    /* FOOD ****************************************************************************/

    BadCold: {
        itemTypes: ['Food'],
        type: 'boolean',
        description: 'Food will give more unhappiness if the food is cold.',
        example: 'BadCold = true,',
    },
    BadInMicrowave: {
        itemTypes: ['Food'],
        type: 'boolean',
        description: `If true, microwave cooking will add unhappiness and boredom.`,
        example: 'BadInMicrowave = true,',
    },
    Calories: {
        itemTypes: ['Food'],
        type: 'float',
        description: 'Specifies the number of calories in an item.',
        example: 'Calories = 10.5,',
    },
    CannedFood: {
        itemTypes: ['Food'],
        type: 'boolean',
        description: 'Sets **ItemType** to **CannedFood**.',
        example: 'CannedFood = true,',
    },
    CantBeFrozen: {
        itemTypes: ['Food'],
        type: 'boolean',
        description: 'If true, then the item cannot be frozen in the refrigerator.',
        example: 'CantBeFrozen = true,',
    },
    CantEat: {
        itemTypes: ['Food'],
        type: 'boolean',
        description: 'If true, then the food cannot be eaten.',
        example: 'CantEat = true,',
    },
    Carbohydrates: {
        itemTypes: ['Food'],
        type: 'int',
        description: 'Specifies the number of carbohydrates in the item.',
        example: 'Carbohydrates = 28,',
    },
    CookingSound: {
        itemTypes: ['Food'],
        type: 'string',
        description: 'Determines the sound that will be used when cooking.',
        example: 'CookingSound = BoilingFood,',
    },
    CustomContextMenu: {
        itemTypes: ['Food'],
        type: 'string',
        description: 'Changes the context menu item "Eat" of the food to the one specified in the parameter.',
        example: 'CustomContextMenu = Smoke,',
    },
    CustomEatSound: {
        itemTypes: ['Food'],
        type: 'string',
        description: 'Specifies the sound that will play when eaten.',
        example: 'CustomEatSound = EatingFruit,',
    },
    DangerousUncooked: {
        itemTypes: ['Food'],
        type: 'boolean',
        description: 'If true, there is a chance to get an infection. (Not the zombie virus)',
        example: 'DangerousUncooked = true,',
    },
    DaysFresh: {
        itemTypes: ['Food'],
        type: 'int',
        description: 'The number of days the food will be fresh.',
        example: 'DaysFresh = 3,',
    },
    DaysTotallyRotten: {
        itemTypes: ['Food'],
        type: 'int',
        description: 'The number of days the food will be totally rotten.',
        example: 'DaysTotallyRotten = 8,',
    },
    EatType: {
        itemTypes: ['Food'],
        type: 'string',
        description: `
            Sets the animation variable that will be used when the item is eaten. (FoodType Variable in .xml files)
        `,
        example: 'EatType = Kettle,',
    },
    EnduranceChange: {
        itemTypes: ['Food'],
        type: 'int',
        description: `
            Indicates how much endurance the food will remove. If the number is negative, endurance will decrease,
            if positive, it will increase.
        `,
        example: 'EnduranceChange = 2,',
    },
    FatigueChange: {
        itemTypes: ['Food'],
        type: 'string',
        description: `
            Indicates how much fatigue the food will take away. If the number is negative, fatigue will decrease, if
            it is positive, it will increase.
        `,
        example: 'FatigueChange = -50,',
    },
    FluReduction: {
        itemTypes: ['Food'],
        type: 'int',
        description: 'A modifier that determines how much the disease level will decrease when the item is eaten.',
        example: 'FluReduction = 5,',
    },
    FoodType: {
        itemTypes: ['Food'],
        type: 'string',
        description: 'Specifies the type of food. (Used in some recipes)',
        example: 'FoodType = Meat,',
    },
    GoodHot: {
        itemTypes: ['Food'],
        type: 'boolean',
        description: 'If true, the food will give less unhappiness if warmed up.',
        example: '',
    },
    HerbalistType: {
        itemTypes: ['Food'],
        type: 'string',
        description: `Sets the food's herbalist type. (For Herbalist recipes)`,
        example: 'HerbalistType = Mushroom,',
    },
    HungerChange: {
        itemTypes: ['Food'],
        type: 'int',
        description: `
            Indicates how much hunger the food will satisfy if the item is completely eaten. If the number is
            negative, hunger will decrease, if positive, it will increase.
        `,
        example: 'HungerChange = -20,',
    },
    IsCookable: {
        itemTypes: ['Food'],
        type: 'boolean',
        description: 'If true, The food can be cooked.',
        example: 'IsCookable = true,',
    },
    Lipids: {
        itemTypes: ['Food'],
        type: 'int',
        description: 'The amount of lipids in an item.',
        example: 'Lipids = 0,',
    },
    MinutesToBurn: {
        itemTypes: ['Food'],
        type: 'int',
        description: 'Indicates how many minutes must elapse from the start of cooking for the food to burn.',
        example: 'MinutesToBurn = 60,',
    },
    MinutesToCook: {
        itemTypes: ['Food'],
        type: 'int',
        description: `
            Used for food. Indicates how many minutes must elapse from the start of cooking for the food to cook.
        `,
        example: 'MinutesToCook = 30,',
    },
    OnCooked: {
        itemTypes: ['Food'],
        type: 'lua',
        luaPrefix: 'OnCooked.',
        example: 'OnCooked = OnCooked.CannedFood,',
        luaExample: `
            function OnCooked.CannedFood(cannedFood)
                local aged = cannedFood:getAge() / cannedFood:getOffAgeMax();
                cannedFood:setOffAgeMax(90);
                cannedFood:setOffAge(60);
                cannedFood:setAge(cannedFood:getOffAgeMax() * aged);
            end
        `,
    },
    OnEat: {
        itemTypes: ['Food'],
        type: 'lua',
        luaPrefix: 'OnEat.',
        description: `
            Specifies a Lua function to be called when an item is eaten. Food, character and percent of food eaten
            is passed as parameters.
        `,
        example: 'OnEat = OnEat.Cigarettes,',
        luaExample: `
            function OnEat.Cigarettes(food, character, percent)
                -- ...
            end
        `,
    },
    Packaged: {
        itemTypes: ['Food'],
        type: 'boolean',
        description: `
            If true, the tooltip of the item will display the number of calories, lipids, proteins and 
            carbohydrates.
        `,
        example: 'Packaged = true,',
    },
    PainReduction: {
        itemTypes: ['Food'],
        type: 'int',
        description: `
            A modifier that determines how much the pain level will decrease after eating the item.
        `,
        example: 'PainReduction = 7,',
    },
    Poison: {
        itemTypes: ['Food'],
        type: 'boolean',
        description: 'Indicates if a food item is poisonous.',
        example: 'Poison = true,',
    },
    PoisonDetectionLevel: {
        itemTypes: ['Food'],
        type: 'int',
        description: `
            Indicates what level of cooking it will be clear that the food is poisonous. 
            
            The formula for calculating the level of cooking skill that will determine if food is poisonous: 
            **CookingSkillLevel >= 10 - PoisonDetectionLevel**
        `,
        example: 'PoisonDetectionLevel = 7,',
    },
    PoisonPower: {
        itemTypes: ['Food'],
        type: 'int',
        description: 'A factor for the strength of the poison in an item. (Affects the rate of poisoning)',
        example: 'PoisonPower = 75,',
    },
    Proteins: {
        itemTypes: ['Food'],
        type: 'int',
        description: 'Specifies the number of proteins in the item.',
        example: 'Proteins = 0,',
    },
    ReduceFoodSickness: {
        itemTypes: ['Food'],
        type: 'int',
        description: 'A modifier that determines how much the level of food poisoning will decrease.',
        example: 'ReduceFoodSickness = 12,',
    },
    ReduceInfectionPower: {
        itemTypes: ['Food'],
        type: 'int',
        description: `
            A modifier that affects the speed of healing from an infection. (From a normal infection, not from a
            zombie virus)
        `,
        example: 'ReduceInfectionPower = 50,',
    },
    RemoveNegativeEffectOnCooked: {
        itemTypes: ['Food'],
        type: 'boolean',
        description: `
            If this parameter is true, then the item will remove the negative effects of thirst, boredom and
            unhappiness after cooking.
        `,
        example: 'RemoveNegativeEffectOnCooked = true,',
    },
    RemoveUnhappinessWhenCooked: {
        itemTypes: ['Food'],
        type: 'boolean',
        description: `
            Used for food. If the parameter is true, then after cooking the item will not give unhappiness.
        `,
        example: 'RemoveUnhappinessWhenCooked = true,',
    },
    ReplaceOnCooked: {
        itemTypes: ['Food'],
        type: 'string',
        description: 'Replaces the item with the specified one after cooking.',
        example: 'ReplaceOnCooked = GrilledCheese,',
    },
    ReplaceOnRotten: {
        itemTypes: ['Food'],
        type: 'string',
        description: 'Indicates what item the original item will turn into after it rotten.',
        example: 'ReplaceOnRotten = IcecreamMelted,',
    },
    RequireInHandOrInventory: {
        itemTypes: ['Food'],
        type: 'string',
        description: `
            The parameter specifies the item that the player must have in order to use the original item. You can
            select multiple items.
        `,
        example: 'RequireInHandOrInventory = Matches/Matchbox/LighterDisposable/Lighter,',
    },
    Spice: {
        itemTypes: ['Food'],
        type: 'boolean',
        description: 'Determines if the item is a spice.',
        example: 'Spice = true,',
    },
    ThirstChange: {
        itemTypes: ['Food'],
        type: 'int',
        description: `
            Indicates how much thirst the food will quench if the item is completely consumed. If the number is 
            negative, thirst will decrease, if positive, it will increase.
        `,
        example: 'ThirstChange = -4,',
    },
    UseForPoison: {
        itemTypes: ['Food'],
        type: 'int',
        description: 'Used as a multiplier for poison strength in recipes with this item.',
        example: 'UseForPoison = 38,',
    },

    /* KEY *****************************************************************************/

    DigitalPadlock: {
        itemTypes: ['Key'],
        type: 'boolean',
        description: 'Set item as digital padlock.',
        example: 'DigitalPadlock = true,',
    },
    Padlock: {
        itemTypes: ['Key'],
        type: 'boolean',
        description: 'Set item as padlock.',
        example: 'Padlock = true,',
    },

    /* KEYRING *************************************************************************/

    /* LITERATURE **********************************************************************/

    CanBeWrite: {
        itemTypes: ['Literature'],
        type: 'boolean',
        description: 'Determines whether it is possible to write in the given item.',
        example: 'CanBeWrite = true,',
    },
    LvlSkillTrained: {
        itemTypes: ['Literature'],
        type: 'int',
        description: 'Max skill level when book item can be read.',
        example: 'LvlSkillTrained = 3,',
    },
    NumLevelsTrained: {
        itemTypes: ['Literature'],
        type: 'int',
        description: 'Used to set how much levels will be boost. (Formula: levelNum - 1)',
        example: 'NumLevelsTrained = 2,',
    },
    NumberOfPages: {
        itemTypes: ['Literature'],
        type: 'int',
        description: 'Specifies the number of pages in the item.',
        example: 'NumberOfPages = 220,',
    },
    PageToWrite: {
        itemTypes: ['Literature'],
        type: 'int',
        description: 'The number of pages that can be written on in the item.',
        example: 'PageToWrite = 12,',
    },
    SkillTrained: {
        itemTypes: ['Literature'],
        type: 'enum',
        values: SKILL_VALUES,
        description: 'Determines the skill that will receive the experience boost.',
        example: 'SkillTrained = Trapping,',
    },
    TeachedRecipes: {
        itemTypes: ['Literature'],
        type: 'string',
        description: 'The names of the recipes that the player will learn after reading the literature.',
        example: 'TeachedRecipes = Make Fishing Net;Get Wire Back,',
    },

    /* MAP *****************************************************************************/

    Map: {
        itemTypes: ['Map'],
        type: 'string',
        description: 'Specifies the map name to be used in the item.',
        example: 'Map = LouisvilleMap3,',
    },

    /* MOVEABLE ************************************************************************/

    WorldObjectSprite: {
        itemTypes: ['Moveable'],
        type: 'string',
        description: 'Specifies the tile that is used when placing the item on a tile.',
        example: 'WorldObjectSprite = furniture_storage_02_8,',
    },

    /* RADIO ***************************************************************************/

    BaseVolumeRange: {
        itemTypes: ['Radio'],
        type: 'int',
        description: 'A modifier that affects the base volume of the device.',
        example: 'BaseVolumeRange = 12,',
    },
    DisappearOnUse: {
        itemTypes: ['Radio'],
        type: 'boolean',
        description: 'If false, there will be no waste of using the item. (In normal use)',
        example: 'DisappearOnUse = false,',
    },
    IsHighTier: {
        itemTypes: ['Radio'],
        type: 'boolean',
        description: 'If true, the chance of the appearance of preset radio stations is higher.',
        example: 'IsHighTier = false,',
    },
    IsPortable: {
        itemTypes: ['Radio'],
        type: 'boolean',
        description: 'If true, the player can use the radio as a portable item.',
        example: 'IsPortable = true,',
    },
    IsTelevision: {
        itemTypes: ['Radio'],
        type: 'boolean',
        description: 'Determines if the item is a TV.',
        example: 'IsTelevision = true,',
    },
    MaxChannel: {
        itemTypes: ['Radio'],
        type: 'int',
        description: 'The maximum channel available for the radio.',
        example: 'MaxChannel = 1000000,',
    },
    MicRange: {
        itemTypes: ['Radio'],
        type: 'int',
        description: `The radius at which the item's microphone will pick up the player's voice.`,
        example: 'MicRange = 5,',
    },
    MinChannel: {
        itemTypes: ['Radio'],
        type: 'int',
        description: 'Minimum channel available for the radio.',
        example: 'MinChannel = 200,',
    },
    NoTransmit: {
        itemTypes: ['Radio'],
        type: 'boolean',
        description: 'Indicates that the radio is not transmitting or receiving a signal.',
        example: 'NoTransmit = true,',
    },
    TransmitRange: {
        itemTypes: ['Radio'],
        type: 'int',
        description: `The radio's range of reception and transmission of a signal.`,
        example: 'TransmitRange = 7500,',
    },
    TwoWay: {
        itemTypes: ['Radio'],
        type: 'boolean',
        description: `
            If true, the item can receive and transmit signals. If false, the radio can only receive signals.
        `,
        example: 'TwoWay = true,',
    },
    UsesBattery: {
        itemTypes: ['Radio'],
        type: 'boolean',
        description: 'Sets whether the item uses a battery.',
        example: 'UsesBattery = true,',
    },

    /* WEAPON **************************************************************************/

    AimingPerkCritModifier: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: `
            Parameter for weapons. A modifier that determines how much the Aim skill affects critical hits.
        `,
        example: 'AimingPerkCritModifier = 12,',
    },
    AimingPerkHitChanceModifier: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: `
            Parameter for weapons. A modifier that determines how much the Aim skill affects the chance to hit the
            target.
        `,
        example: 'AimingPerkHitChanceModifier = 5,',
    },
    AimingPerkMinAngleModifier: {
        itemTypes: ['Weapon'],
        type: 'float',
        description: `
            Parameter for weapons. A modifier that determines how much the Aim skill affects the aiming angle.
        `,
        example: 'AimingPerkMinAngleModifier = 0.05,',
    },
    AimingPerkRangeModifier: {
        itemTypes: ['Weapon'],
        type: 'float',
        description: `
        Parameter for weapons. A modifier that determines how much the Aim skill affects the maximum firing range.
        `,
        example: 'AimingPerkRangeModifier = 1.5,',
    },
    AimingTime: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'Time required to aim.',
        example: 'AimingTime = 20,',
    },
    AlwaysKnockdown: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: 'If the parameter is true, then each hit will be a critical hit.',
        example: 'AlwaysKnockdown = true,',
    },
    AmmoBox: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: 'Parameter for weapons. Indicates what type of ammo box the weapon uses.',
        example: 'AmmoBox = 308Box,',
    },
    AmmoType: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: 'Parameter for firearms. Specifies the ammo type.',
        example: 'AmmoType = Base.ShotgunShells,',
    },
    AttachmentType: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: `
            Specifies the type of place, where will be attached item.
            
            All attachments you can find in:
            "media/lua/client/Hotbar/ISHotbarAttachDefinition.lua"
        `,
        example: 'AttachmentType = Rifle,',
    },
    BaseSpeed: {
        itemTypes: ['Weapon'],
        type: 'float',
        description: 'Used for weapons. Affects weapon attack speed.',
        example: 'BaseSpeed = 0.93,',
    },
    BreakSound: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: 'Specifies the sound that will play when the item breaks.',
        example: 'BreakSound = HammerBreak,',
    },
    BringToBearSound: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: `
            Parameter for weapons. The parameter specifies the sound that will be played when aiming starts.
        `,
        example: 'BringToBearSound = M1911BringToBear,',
    },
    CanBePlaced: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: 'If the parameter is true, then the trap can be placed on the ground.',
        example: 'CanBePlaced = true,',
    },
    CanBeRemote: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: 'Specifies that the trap is controlled remotely.',
        example: 'CanBeRemote = true,',
    },
    CanBeReused: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: `
            Determines if the trap can be picked up and used again. Does not work with sensory traps.
        `,
        example: 'CanBeReused = true,',
    },
    CantAttackWithLowestEndurance: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: `
            If this parameter is set to true, then the player will not be able to attack with this item if endurance
            is very low.
        `,
        example: 'CantAttackWithLowestEndurance = true,',
    },
    Categories: {
        itemTypes: ['Weapon'],
        type: 'enum',
        values: ['Axe', 'Spear', 'SmallBlade', 'LongBlade', 'Blunt', 'SmallBlunt'],
        description: 'Specifies the category for the game to correctly recognize the skill for this weapon.',
        example: 'Categories = SmallBlade,',
    },
    ClickSound: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: 'The parameter specifies the sound that will be played when the trigger is pressed.',
        example: 'ClickSound = M9Jam,',
    },
    ClipSize: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'Firearm magazine capacity.',
        example: 'ClipSize = 6,',
    },
    CloseKillMove: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: 'Sets the kill animation up close.',
        example: 'CloseKillMove = Jaw_Stab,',
    },
    ConditionLowerChanceOneIn: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: `This parameter specifies the item's breakage modifier when item used.`,
        example: 'ConditionLowerChanceOneIn = 25,',
    },
    CountDownSound: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: 'The sound that will be played while the trap is running before the explosion.',
        example: 'CountDownSound = ticking,',
    },
    CritDmgMultiplier: {
        itemTypes: ['Weapon'],
        type: 'float',
        description: `
            Used for weapons. Indicates a modifier to a critical hit that is used in calculating the damage of a
            critical hit.
        `,
        example: 'CritDmgMultiplier = 1.7,',
    },
    CriticalChance: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: `
            Used for weapons. Specifies the critical strike modifier that is used in the calculation of the chance
            of a critical strike.
        `,
        example: 'CriticalChance = 20,',
    },
    DamageCategory: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: `
            Parameter for weapons. Specifies what type of damage will be displayed on the enemy that we hit with
            this weapon.
        `,
        example: 'DamageCategory = Slash,',
    },
    DamageMakeHole: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: `
            Parameter for weapons. Determines if the weapon will inflict damage to clothing, which will leave a
            hole.
        `,
        example: 'DamageMakeHole = true,',
    },
    DoorDamage: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: `
            Parameter for weapons. A modifier that affects how much damage is dealt to a door/vehicle with a given
            weapon.
        `,
        example: 'DoorDamage = 9,',
    },
    DoorHitSound: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: 'Used for weapons. Indicates the sound when hitting a door.',
        example: 'DoorHitSound = HammerHit,',
    },
    EjectAmmoSound: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: `
            Parameter for weapons. This parameter specifies the sound that will be played when the weapon is
            unloaded.
        `,
        example: 'EjectAmmoSound = DoubleBarrelShotgunEjectAmmo,',
    },
    EjectAmmoStartSound: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: `
            Parameter for weapons. This parameter specifies the sound that will be played when the weapon starts to
            unload.
        `,
        example: 'EjectAmmoStartSound = DoubleBarrelShotgunEjectAmmoStart,',
    },
    EjectAmmoStopSound: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: `
            Parameter for weapons. The parameter specifies the sound that will be played when the weapon is
            unloaded.
        `,
        example: 'EjectAmmoStopSound = DoubleBarrelShotgunEjectAmmoStop,',
    },
    EnduranceMod: {
        itemTypes: ['Weapon'],
        type: 'float',
        description: 'A modifier that affects how endurance is spent during an attack.',
        example: 'EnduranceMod = 1.4,',
    },
    EquipSound: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: `
            Parameter for weapons. The parameter specifies the sound that will be played when the weapon is
            equipped.
        `,
        example: 'EquipSound = M14Equip,',
    },
    ExplosionPower: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: `The item's explosion strength modifier.`,
        example: 'ExplosionPower = 70,',
    },
    ExplosionRange: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'Explosion radius.',
        example: 'ExplosionRange = 6,',
    },
    ExplosionSound: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: 'The sound that will be played when the object explodes.',
        example: 'ExplosionSound = FlameTrapExplode,',
    },
    ExplosionTimer: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'The time before the trap explodes.',
        example: 'ExplosionTimer = 5,',
    },
    ExtraDamage: {
        itemTypes: ['Weapon'],
        type: 'float',
        description: 'The additional damage dealt by a thrown item hit.',
        example: 'ExtraDamage = 0.001,',
    },
    FireMode: {
        itemTypes: ['Weapon'],
        type: 'enum',
        values: ['Auto', 'Single'],
        description: 'Parameter for weapons. Specifies which firing mode the weapon has. (Auto or Single)',
        example: 'FireMode = Auto,',
    },
    FireModePossibilities: {
        itemTypes: ['Weapon'],
        type: 'enum',
        values: ['Auto', 'Single', 'Auto/Single'],
        description: 'Sets the possible weapon firing modes that can be switched between.',
        example: 'FireModePossibilities = Auto/Single,',
    },
    FirePower: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'Modifier for the strength of the fire that will appear after the explosion.',
        example: 'FirePower = 97,',
    },
    FireRange: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'Fire spread radius.',
        example: 'FireRange = 6,',
    },
    HaveChamber: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: 'Parameter for weapons. Indicates if the weapon has a chamber for bullet.',
        example: 'HaveChamber = false,',
    },
    HitAngleMod: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: `
            A parameter that affects the attack sector (how many targets will be captured in one hit). The default
            value is zero. The smaller, the larger the range.
        `,
        example: 'HitAngleMod = -30,',
    },
    HitChance: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'Modifier for firearms. Affects the chance to hit the target.',
        example: 'HitChance = 20,',
    },
    HitFloorSound: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: 'Used for weapons. Indicates the sound that will be played when the item hits the floor.',
        example: 'HitFloorSound = AxeHit,',
    },
    HitSound: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: `
            Used for weapons. Indicates the sound that will be played when the item hits. You can set the value to
            'null'. (To remove the sound)
        `,
        example: 'HitSound = BaseballBatHit,',
    },
    IdleAnim: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: 'The parameter sets the idle animation with the weapon.',
        example: 'IdleAnim = Idle_Weapon2,',
    },
    InsertAllBulletsReload: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: `
            Parameter for weapons. If the parameter is true, then the player loads ammo directly into the weapon.
        `,
        example: 'InsertAllBulletsReload = true,',
    },
    InsertAmmoSound: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: `
            Parameter for weapons. The parameter specifies the sound that will be played during reloading.
        `,
        example: 'InsertAmmoSound = DoubleBarrelShotgunInsertAmmo,',
    },
    InsertAmmoStartSound: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: `
            Parameter for weapons. The parameter specifies the sound that will be played when the reload starts.
        `,
        example: 'InsertAmmoStartSound = DoubleBarrelShotgunInsertAmmoStart,',
    },
    InsertAmmoStopSound: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: `
            Parameter for weapons. The parameter specifies the sound that will be played at the end of reloading.
        `,
        example: 'InsertAmmoStopSound = DoubleBarrelShotgunInsertAmmoStop,',
    },
    IsAimedFirearm: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: 'The parameter specifies that the item is a firearm.',
        example: 'IsAimedFirearm = true,',
    },
    JamGunChance: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'Parameter for weapons. Chance for gun jam.',
        example: 'JamGunChance = 2,',
    },
    KnockBackOnNoDeath: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: `
            If the parameter is set to true, then when hit with this weapon, the player will receive a small amount
            of experience in the strength skill.
        `,
        example: 'KnockBackOnNoDeath = true,',
    },
    MagazineType: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: 'Parameter for weapons. The parameter specifies the magazine type for the weapon.',
        example: 'MagazineType = Base.9mmClip,',
    },
    ManuallyRemoveSpentRounds: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: `
            Parameter for weapons. If the parameter is true, then the shells will not fall to the ground after being
            fired.
        `,
        example: 'ManuallyRemoveSpentRounds = true,',
    },
    MaxDamage: {
        itemTypes: ['Weapon'],
        type: 'float',
        description: 'Used for weapons. Sets the maximum damage factor, which affects the resulting damage.',
        example: 'MaxDamage = 1.5,',
    },
    MaxHitCount: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: `
            The parameter determines the maximum number of targets that a player can hit with this weapon in one
            hit.
        `,
        example: 'MaxHitCount = 2,',
    },
    MaxRange: {
        itemTypes: ['Weapon'],
        type: 'float',
        description: `
            Used for weapons. Sets the weapon's maximum attack range. Range affects the chance of hitting a target.
        `,
        example: 'MaxRange = 1.55,',
    },
    MinAngle: {
        itemTypes: ['Weapon'],
        type: 'float',
        description: `
            Used for weapons. Determines the minimum aiming angle at which there will be enemies that can be hit.
            The larger the angle, the smaller the sector of hitting targets (selects the target more accurately). 
            
            Example:
            - Axe = 0.72
            - AssaultRifle = 0.965
        `,
        example: 'MinAngle = 0.75,',
    },
    MinDamage: {
        itemTypes: ['Weapon'],
        type: 'float',
        description: 'Parameter for weapons. Sets the minimum damage factor, which affects the resulting damage.',
        example: 'MinDamage = 0.1,',
    },
    MinimumSwingTime: {
        itemTypes: ['Weapon'],
        type: 'int',
        deprecated: true,
    },
    MinRange: {
        itemTypes: ['Weapon'],
        type: 'float',
        description: `
            Used for weapons. Sets the minimum attack range of the weapon. Range affects the chance of hitting a
            target.
        `,
        example: 'MinRange = 0.61,',
    },
    ModelWeaponPart: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: `
            Parameter for weapons. The parameter specifies the weapon attachment. 
            
            Format: partType modelName attachmentNameSelf attachmentParent
        `,
        example: 'ModelWeaponPart = x8Scope x8Scope scope scope,',
    },
    MultipleHitConditionAffected: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: `
            Parameter for weapons. If the parameter is set to true, then when a weapon hits targets, the durability
            of the weapon is spent. Usually set to false for firearms.
        `,
        example: 'MultipleHitConditionAffected = false,',
    },
    NoiseDuration: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'The duration of the sound after the sound trap is triggered.',
        example: 'NoiseDuration = 30,',
    },
    NoiseRange: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'Radius of sound propagation after the explosion of an item.',
        example: 'NoiseRange = 17,',
    },
    OtherHandRequire: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: `
            Parameter for weapons. A parameter that determines the required item in the extra hand to use the
            original item.
        `,
        example: 'OtherHandRequire = Lighter,',
    },
    OtherHandUse: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: `
            Used for weapons. If the parameter is true, then the item in the extra hand will be used.
            
            (Example: Molotov cocktail and lighter)
        `,
        example: 'OtherHandUse = true,',
    },
    PhysicsObject: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: `
            If the parameter is true, then the player will throw the given item. The icon specified in this
            parameter will be used.
        `,
        example: 'PhysicsObject = sMolotov,',
    },
    PiercingBullets: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: `
            If this parameter is set to true, then the bullets will be able to pass through the target and hit
            another target behind.
        `,
        example: 'PiercingBullets = true,',
    },
    PlacedSprite: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: 'The sprite that will be used for the trap after it is set.',
        example: 'PlacedSprite = constructedobjects_01_32,',
    },
    PushBackMod: {
        itemTypes: ['Weapon'],
        type: 'float',
        description: 'The parameter determines the modifier that affects the stagger of targets after being hit.',
        example: 'PushBackMod = 0.3,',
    },
    RackAfterShoot: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: `
            Parameter for weapons. If the parameter is true, then after the shot the player will reload the weapon.
        `,
        example: 'RackAfterShoot = true,',
    },
    RackSound: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: `
            Parameter for weapons. The parameter specifies the sound that will be played when rack the gun.
        `,
        example: 'RackSound = DesertEagleRack,',
    },
    Ranged: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: 'Used for weapons. If the parameter is true, then the weapon is considered a firearm.',
        example: 'Ranged = true,',
    },
    RecoilDelay: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'Specifies the delay between shots.',
        example: 'RecoilDelay = 20,',
    },
    ReloadTime: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'Modifier of the time required to recharge.',
        example: 'ReloadTime = 25,',
    },
    RemoteRange: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'The range at which the trap can be remotely activated.',
        example: 'RemoteRange = 11,',
    },
    RunAnim: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: 'The parameter sets the animation of running with a weapon.',
        example: 'RunAnim = Run_Weapon2,',
    },
    SensorRange: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'The range at which the trap sensor is triggered.',
        example: 'SensorRange = 4,',
    },
    ShellFallSound: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: 'Sets the sound of the dropped shell.',
        example: 'ShellFallSound = M9CartridgeFall,',
    },
    SmokeRange: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'The radius of smoke spread after an item explodes.',
        example: 'SmokeRange = 5,',
    },
    SoundMap: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: 'Specifies an EventName-Sound pair.',
        example: 'SoundMap = SpearStab SpearHuntingKnifeStab,',
    },
    SoundRadius: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'Determines the radius of the sound that the item emits.',
        example: 'SoundRadius = 30,',
    },
    SoundVolume: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'Parameter for firearms. Determines the volume of the shot.',
        example: 'SoundVolume = 50,',
    },
    SplatBloodOnNoDeath: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: 'Parameter for weapons. Determines whether drops of blood will fall after hitting the target.',
        example: 'SplatBloodOnNoDeath = true,',
    },
    SplatNumber: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'A modifier that affects the amount of blood that appears after being hit by an item.',
        example: 'SplatNumber = 4,',
    },
    StopPower: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'Parameter for firearms. A modifier that affects the chance of a critical shot.',
        example: 'StopPower = 7,',
    },
    SubCategory: {
        itemTypes: ['Weapon'],
        type: 'string',
        deprecated: true,
    },
    SwingAmountBeforeImpact: {
        itemTypes: ['Weapon'],
        type: 'float',
        deprecated: true,
    },
    SwingAnim: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: 'A value that is used to select the animation for swinging the weapon.',
        example: 'SwingAnim = Bat,',
    },
    SwingSound: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: 'Parameter for weapons. Specifies the sound that is played when swinging a weapon.',
        example: 'SwingSound = GriddlePanSwing,',
    },
    SwingTime: {
        itemTypes: ['Weapon'],
        type: 'int',
        deprecated: true,
    },
    TreeDamage: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: 'Wood damage modifier.',
        example: 'TreeDamage = 5,',
    },
    TriggerExplosionTimer: {
        itemTypes: ['Weapon'],
        type: 'int',
        description: `
            The time after which the item will explode (after activation). Used for items that are thrown.
        `,
        example: 'TriggerExplosionTimer = 50,',
    },
    TwoHandWeapon: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: 'If the parameter is true, then the weapon is considered two-handed.',
        example: 'TwoHandWeapon = true,',
    },
    UnequipSound: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: `
            Parameter for weapons. The parameter specifies the sound that will be played when the weapon is
            unequiped.
        `,
        example: 'UnequipSound = M16UnEquip,',
    },
    UseEndurance: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: 'If the parameter is false, then using the weapon will not waste endurance.',
        example: 'UseEndurance = false,',
    },
    UseSelf: {
        itemTypes: ['Weapon'],
        type: 'boolean',
        description: 'Used for weapons. If the parameter is true, then the weapon will be spent on use.',
        example: 'UseSelf = true,',
    },
    WeaponLength: {
        itemTypes: ['Weapon'],
        type: 'float',
        description: 'Parameter for melee weapons. A modifier that affects attack range.',
        example: 'WeaponLength = 0.23,',
    },
    WeaponReloadType: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: `
            Parameter for weapons. Specifies the type of reload. The types of reloads are specified in the animation
            parameters. If you want to use the reload type from the original game - look at this option for a weapon
            of a similar type.
        `,
        example: 'WeaponReloadType = doublebarrelshotgun,',
    },
    WeaponSprite: {
        itemTypes: ['Weapon'],
        type: 'string',
        description: 'Specifies the name of model for the weapon.',
        example: 'WeaponSprite = HandAxe,',
    },

    /* WEAPONPART **********************************************************************/

    AimingTimeModifier: {
        itemTypes: ['WeaponPart'],
        type: 'int',
        description: 'Modifier for the time it takes to aim a weapon. A positive number to speed up aiming speed.',
        example: 'AimingTimeModifier = 5,',
    },
    AimingMod: {
        itemTypes: ['WeaponPart'],
        type: 'int',
        deprecated: true,
    },
    HitChanceModifier: {
        itemTypes: ['WeaponPart'],
        type: 'int',
        description: 'Modifier to hit the target (WeaponPart item). A positive number to increase the hit chance.',
        example: 'HitChanceModifier = 8,',
    },
    MaxRangeModifier: {
        itemTypes: ['WeaponPart'],
        type: 'int',
        description: 'Sets the maximum range modifier for the part.',
        example: 'MaxRangeModifier = 7,',
    },
    MinRangeModifier: {
        itemTypes: ['WeaponPart'],
        type: 'int',
        description: 'Sets the minimum range modifier for the part.',
        example: 'MinRangeModifier = 7,',
    },
    MountOn: {
        itemTypes: ['WeaponPart'],
        type: 'string',
        description: 'Indicates which weapon this item (Weapon part) can be applied to.',
        example: 'MountOn = HuntingRifle; VarmintRifle; Shotgun,',
    },
    PartType: {
        itemTypes: ['WeaponPart'],
        type: 'string',
        description: 'Specifies the type of weapon part.',
        example: 'PartType = Scope,',
    },
    RecoilDelayModifier: {
        itemTypes: ['WeaponPart'],
        type: 'float',
        description: 'Determines the recoil of the weapon. Affects the pause between shots.',
        example: 'RecoilDelayModifier = -10.0,',
    },
    ReloadTimeModifier: {
        itemTypes: ['WeaponPart'],
        type: 'int',
        description: 'Reload time modifier (WeaponPart item). Negative number to speed up reload time.',
        example: 'ReloadTimeModifier = -5,',
    },
    WeightModifier: {
        itemTypes: ['WeaponPart'],
        type: 'float',
        description: `
            Determines how the weapon part affects the weight of the weapon. A positive number adds weight, a negative
            number decreases it.
        `,
        example: 'WeightModifier = 0.5,',
    },
};

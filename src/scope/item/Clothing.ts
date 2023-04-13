import { ScopeProperty } from '../Scope';
import { ScopeProperties } from '../ScopeProperties';

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

export class Clothing implements ScopeProperties {
    properties: { [name: string]: ScopeProperty } = {
        AttachmentsProvided: {
            type: 'enum',
            values: ATTACHMENTS_VALUES,
            description: 'Sets the equipment slots the item occupies. (Multiple entries are possible)',
            example: 'AttachmentsProvided = HolsterLeft; HolsterRight,',
        },
        BiteDefense: {
            type: 'int',
            description: 'Specifies the bite protection modifier.',
            example: 'BiteDefense = 20,',
        },
        BloodLocation: {
            type: 'enum',
            values: BLOOD_CLOTHING_TYPE_VALUES,
            description: 'Specifies the zones where blood will be displayed on this item of clothing.',
            example: 'BloodLocation = FullHelmet; Neck,',
        },
        BodyLocation: {
            type: 'enum',
            values: BODY_LOCATION_VALUES,
            description: `
                Indicates the part of the body that the clothing is worn.

                All locations are defined here: \`media/lua/shared/NPCs/BodyLocations.lua\`'
            `,
            example: 'BodyLocation = Hat,',
        },
        CanHaveHoles: {
            type: 'boolean',
            description: 'Specifies whether an item can have holes.',
            example: 'CanHaveHoles = false,',
        },
        ChanceToFall: {
            type: 'int',
            description: 'Chance modifier for clothing item to drop.',
            example: 'ChanceToFall = 60,',
        },
        ClothingExtraSubmenu: {
            type: 'string',
            description: `
                The parameter specifies an additional option for the context menu of how the item can be equipped by
                default.
            `,
            example: 'ClothingExtraSubmenu = ForwardCap,',
        },
        ClothingItem: {
            type: 'string',
            description: 'Specifies the .xml name of the clothing element script.',
            example: 'ClothingItem = Bag_SurvivorBag,',
        },
        ClothingItemExtra: {
            type: 'string',
            description: `
                Indicates an additional option of how the item can be worn.
            `,
            example: 'ClothingItemExtra = Hat_BaseballCap_Reverse,',
        },
        ClothingItemExtraOption: {
            type: 'string',
            description: `
                Specifies an option for the context menu for the ClothingItemExtra parameter.
            `,
            example: 'ClothingItemExtraOption = ReverseCap,',
        },
        CombatSpeedModifier: {
            type: 'float',
            description: 'Affects weapon attack speed.',
            example: 'CombatSpeedModifier = 0.9,',
        },
        Cosmetic: {
            type: 'boolean',
            description: `
                If true, the item will not render a 3D model.
                
                (The exception is an item that is worn on the Eye part of the body)
            `,
            example: 'Cosmetic = true,',
        },
        FabricType: {
            type: 'enum',
            values: FABRIC_TYPE_VALUES,
            description: 'Specifies the material from which the clothes is made.',
            example: 'FabricType = Denim,',
        },
        IconsForTexture: {
            type: 'string',
            description: `
                The names of the icons are specified, which in order correspond to the possible textures of the item.

                (As specified in the .xml file of the clothing)
            `,
            example: 'IconsForTexture = BandanaBlack; BandanaBlue; BandanaRed,',
        },
        Insulation: {
            type: 'float',
            description: 'Modifier for Insulation which is involved in determining cold protection.',
            example: 'Insulation = 0.75,',
        },
        NeckProtectionModifier: {
            type: 'float',
            range: [0.0, 1.0],
            description: `
                Specifies a modifier that affects the chance of a successful wound to the neck. Max value: 1.0
            `,
            example: 'NeckProtectionModifier = 0.5,',
        },
        RemoveOnBroken: {
            type: 'boolean',
            description: 'Specifies whether to delete the item when the state becomes zero.',
            example: 'RemoveOnBroken = true,',
        },
        ScratchDefense: {
            type: 'int',
            description: 'Specifies the scratch protection modifier.',
            example: 'ScratchDefense = 30,',
        },
        StompPower: {
            type: 'float',
            description: `
                Used for shoes. This parameter specifies the damage modifier for a kick attack against a prone opponent.
            `,
            example: 'StompPower = 2.1,',
        },
        WaterResistance: {
            type: 'float',
            description: 'Modifier that is involved in determining the protection against moisture.',
            example: 'WaterResistance = 0.45,',
        },
        WeightWet: {
            type: 'float',
            description: `
                Sets the weight when clothes are wet. 
                
                (The game dynamically calculates the weight depending on how wet the clothes are)
            `,
            example: 'WeightWet = 1.5,',
        },
        WindResistance: {
            type: 'float',
            description: 'A modifier that is involved in determining wind protection.',
            example: 'WindResistance = 0.15,',
        },
        WorldRender: {
            type: 'boolean',
            description: 'If false, the item will NOT appear on the ground as a 3D item.',
            example: 'WorldRender = false,',
        },
    };
}

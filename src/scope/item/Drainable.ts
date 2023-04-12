import { ScopeProperty } from '../Scope';
import { ScopeProperties } from '../ScopeProperties';

const MAKE_UP_VALUES: string[] = ['FullFace', 'Eyes', 'EyesShadow', 'Lips'];

export class Drainable implements ScopeProperties {
    properties: { [name: string]: ScopeProperty } = {
        ActivatedItem: {
            type: 'boolean',
            description: 'The parameter specifies whether the item can be activated. For example, a lighter.',
            example: 'ActivatedItem = true,',
        },
        AlcoholPower: {
            type: 'int',
            description: `
                A modifier for a medical item that affects the ability to disinfect a wound and the pain from applying
                the item.
            `,
            example: 'AlcoholPower = 4,',
        },
        CanStoreWater: {
            type: 'boolean',
            description: 'If true, then the item will be able to store water.',
            example: 'CanStoreWater = true,',
        },
        CantBeConsolided: {
            type: 'boolean',
            description: `
                If this parameter is true, then this item (Drainable) cannot be combined with an item of a similar type.
            `,
            example: 'CantBeConsolided = true,',
        },
        ConsolidateOption: {
            type: 'string',
            description: 'Specifies the translation ID for the merging items option.',
            example: 'ConsolidateOption = ContextMenu_Merge,',
        },
        FillFromDispenserSound: {
            type: 'string',
            description: `
                Specifies the sound that will be played when water is poured into the item from the dispenser.
            `,
            example: 'FillFromDispenserSound = GetWaterFromDispenserPlasticMedium,',
        },
        FillFromTapSound: {
            type: 'string',
            description: 'Specifies the sound that will be played when tap water is poured into an item.',
            example: 'FillFromTapSound = GetWaterFromTapPlasticBig,',
        },
        HairDye: {
            type: 'boolean',
            description: 'Indicates that the item is hair dye.',
            example: 'HairDye = true,',
        },
        IsWaterSource: {
            type: 'boolean',
            description: 'If true, the item can be used as a source of water.',
            example: 'IsWaterSource = true,',
        },
        KeepOnDeplete: {
            type: 'boolean',
            description: 'Keep an item when used up.',
            example: 'KeepOnDeplete = true,',
        },
        LightDistance: {
            type: 'int',
            description: 'Specifies the range of the glow of the item.',
            example: 'LightDistance = 25,',
        },
        LightStrength: {
            type: 'float',
            description: `Determines the strength of the item's glow.`,
            example: 'LightStrength = 2.3,',
        },
        MakeUpType: {
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
            type: 'string',
            description: `
                Used for Drainable items. Specifies the item that the original item will be replaced with when depleted.
            `,
            example: 'ReplaceOnDeplete = PaintbucketEmpty,',
        },
        TicksPerEquipUse: {
            type: 'int',
            description: 'The parameter sets the value of how many ticks must pass for the item to spend one use.',
            example: 'TicksPerEquipUse = 110,',
        },
        TorchCone: {
            type: 'boolean',
            description: 'If the parameter is true, then the item will shine with a cone.',
            example: 'TorchCone = true,',
        },
        TorchDot: {
            type: 'float',
            description: 'Determines the sector on which the object will shine.',
            example: 'TorchDot = 0.66,',
        },
        UseDelta: {
            type: 'float',
            description: `Determines how much the Drainable item's value will be spent on a single use.`,
            example: 'UseDelta = 0.16,'
        },
        UseWhileEquipped: {
            type: 'boolean',
            description: `If true, the drainable item's charge is spent when activated and equipped.`,
            example: 'UseWhileEquipped = false,'
        },
        WeightEmpty: {
            type: 'float',
            description: `
                Sets the weight for an item when it is empty. 
                (The game calculates the weight depending on how much charge remains)
            `,
            example: 'WeightEmpty = 3.3,'
        }
    };
}

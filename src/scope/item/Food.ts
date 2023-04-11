import { ScopeProperty } from '../Scope';
import { ScopeProperties } from '../ScopeProperties';

export class Food implements ScopeProperties {
    properties: { [name: string]: ScopeProperty } = {
        BadCold: {
            type: 'boolean',
            description: 'Food will give more unhappiness if the food is cold.',
            example: 'BadCold = true,',
        },
        BadInMicrowave: {
            type: 'boolean',
            description: `If true, microwave cooking will add unhappiness and boredom.`,
            example: 'BadInMicrowave = true,',
        },
        BoredomChange: {
            type: 'int',
            description: `
                Indicates how much boredom the use of the item will remove. If the number is negative, boredom will
                decrease, if positive, it will increase.
            `,
            example: 'BoredomChange = -50,',
        },
        Calories: {
            type: 'float',
            description: 'Specifies the number of calories in an item.',
            example: 'Calories = 10.5,',
        },
        CannedFood: {
            type: 'boolean',
            description: 'Sets **ItemType** to **CannedFood**.',
            example: 'CannedFood = true,',
        },
        CantBeFrozen: {
            type: 'boolean',
            description: 'If true, then the item cannot be frozen in the refrigerator.',
            example: 'CantBeFrozen = true,',
        },
        CantEat: {
            type: 'boolean',
            description: 'If true, then the food cannot be eaten.',
            example: 'CantEat = true,',
        },
        Carbohydrates: {
            type: 'int',
            description: 'Specifies the number of carbohydrates in the item.',
            example: 'Carbohydrates = 28,',
        },
        CookingSound: {
            type: 'string',
            description: 'Determines the sound that will be used when cooking.',
            example: 'CookingSound = BoilingFood,',
        },
        CustomContextMenu: {
            type: 'string',
            description: 'Changes the context menu item "Eat" of the food to the one specified in the parameter.',
            example: 'CustomContextMenu = Smoke,',
        },
        CustomEatSound: {
            type: 'string',
            description: 'Specifies the sound that will play when eaten.',
            example: 'CustomEatSound = EatingFruit,',
        },
        DangerousUncooked: {
            type: 'boolean',
            description: 'If true, there is a chance to get an infection. (Not the zombie virus)',
            example: 'DangerousUncooked = true,',
        },
        DaysFresh: {
            type: 'int',
            description: 'The number of days the food will be fresh.',
            example: 'DaysFresh = 3,',
        },
        DaysTotallyRotten: {
            type: 'int',
            description: 'The number of days the food will be totally rotten.',
            example: 'DaysTotallyRotten = 8,',
        },
        EatType: {
            type: 'string',
            description: `
                Sets the animation variable that will be used when the item is eaten. (FoodType Variable in .xml files)
            `,
            example: 'EatType = Kettle,',
        },
        EnduranceChange: {
            type: 'int',
            description: `
                Indicates how much endurance the food will remove. If the number is negative, endurance will decrease,
                if positive, it will increase.
            `,
            example: 'EnduranceChange = 2,',
        },
        FatigueChange: {
            type: 'string',
            description: `
                Indicates how much fatigue the food will take away. If the number is negative, fatigue will decrease, if
                it is positive, it will increase.
            `,
            example: 'FatigueChange = -50,',
        },
        FluReduction: {
            type: 'int',
            description: 'A modifier that determines how much the disease level will decrease when the item is eaten.',
            example: 'FluReduction = 5,',
        },
        FoodType: {
            type: 'string',
            description: 'Specifies the type of food. (Used in some recipes)',
            example: 'FoodType = Meat,',
        },
        GoodHot: {
            type: 'boolean',
            description: 'If true, the food will give less unhappiness if warmed up.',
            example: '',
        },
        HerbalistType: {
            type: 'string',
            description: `Sets the food's herbalist type. (For Herbalist recipes)`,
            example: 'HerbalistType = Mushroom,',
        },
        HungerChange: {
            type: 'int',
            description: `
                Indicates how much hunger the food will satisfy if the item is completely eaten. If the number is
                negative, hunger will decrease, if positive, it will increase.
            `,
            example: 'HungerChange = -20,',
        },
        IsCookable: {
            type: 'boolean',
            description: 'If true, The food can be cooked.',
            example: 'IsCookable = true,',
        },
        Lipids: {
            type: 'int',
            description: 'The amount of lipids in an item.',
            example: 'Lipids = 0,',
        },
    };
}

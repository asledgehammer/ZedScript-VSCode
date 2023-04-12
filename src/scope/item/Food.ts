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
        MinutesToBurn: {
            type: 'int',
            description: 'Indicates how many minutes must elapse from the start of cooking for the food to burn.',
            example: 'MinutesToBurn = 60,',
        },
        MinutesToCook: {
            type: 'int',
            description: `
                Used for food. Indicates how many minutes must elapse from the start of cooking for the food to cook.
            `,
            example: 'MinutesToCook = 30,',
        },
        OnCooked: {
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
            type: 'boolean',
            description: `
                If true, the tooltip of the item will display the number of calories, lipids, proteins and 
                carbohydrates.
            `,
            example: 'Packaged = true,',
        },
        PainReduction: {
            type: 'int',
            description: `
                A modifier that determines how much the pain level will decrease after eating the item.
            `,
            example: 'PainReduction = 7,',
        },
        Poison: {
            type: 'boolean',
            description: 'Indicates if a food item is poisonous.',
            example: 'Poison = true,',
        },
        PoisonDetectionLevel: {
            type: 'int',
            description: `
                Indicates what level of cooking it will be clear that the food is poisonous. 
                
                The formula for calculating the level of cooking skill that will determine if food is poisonous: 
                **CookingSkillLevel >= 10 - PoisonDetectionLevel**
            `,
            example: 'PoisonDetectionLevel = 7,',
        },
        PoisonPower: {
            type: 'int',
            description: 'A factor for the strength of the poison in an item. (Affects the rate of poisoning)',
            example: 'PoisonPower = 75,',
        },
        PrimaryAnimMask: {
            type: 'string',
            description: `
                Specifies the animation mask that will be applied to the animation when the item is in the main hand.
            `,
            example: 'PrimaryAnimMask = HoldingTorchRight,',
        },
        Proteins: {
            type: 'int',
            description: 'Specifies the number of proteins in the item.',
            example: 'Proteins = 0,',
        },
        ReduceFoodSickness: {
            type: 'int',
            description: 'A modifier that determines how much the level of food poisoning will decrease.',
            example: 'ReduceFoodSickness = 12,',
        },
        ReduceInfectionPower: {
            type: 'int',
            description: `
                A modifier that affects the speed of healing from an infection. (From a normal infection, not from a
                zombie virus)
            `,
            example: 'ReduceInfectionPower = 50,',
        },
        RemoveNegativeEffectOnCooked: {
            type: 'boolean',
            description: `
                If this parameter is true, then the item will remove the negative effects of thirst, boredom and
                unhappiness after cooking.
            `,
            example: 'RemoveNegativeEffectOnCooked = true,',
        },
        RemoveUnhappinessWhenCooked: {
            type: 'boolean',
            description: `
                Used for food. If the parameter is true, then after cooking the item will not give unhappiness.
            `,
            example: 'RemoveUnhappinessWhenCooked = true,',
        },
        ReplaceOnCooked: {
            type: 'string',
            description: 'Replaces the item with the specified one after cooking.',
            example: 'ReplaceOnCooked = GrilledCheese,',
        },
        ReplaceOnRotten: {
            type: 'string',
            description: 'Indicates what item the original item will turn into after it rotten.',
            example: 'ReplaceOnRotten = IcecreamMelted,',
        },
        RequireInHandOrInventory: {
            type: 'string',
            description: `
                The parameter specifies the item that the player must have in order to use the original item. You can
                select multiple items.
            `,
            example: 'RequireInHandOrInventory = Matches/Matchbox/LighterDisposable/Lighter,',
        },
        SecondaryAnimMask: {
            type: 'string',
            description: `
                Specifies the animation mask that will be applied to the animation when the item is in the secondary
                hand.
            `,
            example: 'SecondaryAnimMask = HoldingTorchLeft,',
        },
        Spice: {
            type: 'boolean',
            description: 'Determines if the item is a spice.',
            example: 'Spice = true,',
        },
        StressChange: {
            type: 'int',
            description: `
                Indicates how much stress the use of the item will remove. If the number is negative, stress will
                decrease, if it is positive, it will increase.
            `,
            example: 'StressChange = -15,',
        },
        ThirstChange: {
            type: 'int',
            description: `
                Indicates how much thirst the food will quench if the item is completely consumed. If the number is 
                negative, thirst will decrease, if positive, it will increase.
            `,
            example: 'ThirstChange = -4,',
        },
        UnhappyChange: {
            type: 'int',
            description: `
                Indicates how much unhappy the use of the item will remove. If the number is negative, unhappy will
                decrease, if it is positive, it will increase.
            `,
            example: 'UnhappyChange = -10,',
        },
        UseForPoison: {
            type: 'int',
            description: 'Used as a multiplier for poison strength in recipes with this item.',
            example: 'UseForPoison = 38,',
        },
    };
}

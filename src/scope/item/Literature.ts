import { SKILL_VALUES, ScopeProperty } from '../Scope';
import { ScopeProperties } from '../ScopeProperties';

export class Literature implements ScopeProperties {
    properties: { [name: string]: ScopeProperty } = {
        BoredomChange: {
            type: 'int',
            description: `
                Indicates how much boredom the use of the item will remove. If the number is negative, boredom will
                decrease, if positive, it will increase.
            `,
            example: 'BoredomChange = -50,',
        },
        CanBeWrite: {
            type: 'boolean',
            description: 'Determines whether it is possible to write in the given item.',
            example: 'CanBeWrite = true,',
        },
        LvlSkillTrained: {
            type: 'int',
            description: 'Max skill level when book item can be read.',
            example: 'LvlSkillTrained = 3,',
        },
        NumLevelsTrained: {
            type: 'int',
            description: 'Used to set how much levels will be boost. (Formula: levelNum - 1)',
            example: 'NumLevelsTrained = 2,',
        },
        NumberOfPages: {
            type: 'int',
            description: 'Specifies the number of pages in the item.',
            example: 'NumberOfPages = 220,',
        },
        PageToWrite: {
            type: 'int',
            description: 'The number of pages that can be written on in the item.',
            example: 'PageToWrite = 12,',
        },
        SkillTrained: {
            type: 'enum',
            values: SKILL_VALUES,
            description: 'Determines the skill that will receive the experience boost.',
            example: 'SkillTrained = Trapping,',
        },
        StressChange: {
            type: 'int',
            description: `
                Indicates how much stress the use of the item will remove. If the number is negative, stress will
                decrease, if it is positive, it will increase.
            `,
            example: 'StressChange = -15,',
        },
        TeachedRecipes: {
            type: 'string',
            description: 'The names of the recipes that the player will learn after reading the literature.',
            example: 'TeachedRecipes = Make Fishing Net;Get Wire Back,',
        },
        UnhappyChange: {
            type: 'int',
            description: `
                Indicates how much unhappy the use of the item will remove. If the number is negative, unhappy will
                decrease, if it is positive, it will increase.
            `,
            example: 'UnhappyChange = -10,',
        },
    };
}

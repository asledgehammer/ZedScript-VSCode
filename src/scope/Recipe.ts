import * as vscode from 'vscode';
import { BOOLEAN_VALUES, Property as Property, PropertyDelimiter, Scope } from './Scope';

export class RecipeScope extends Scope {
    delimiter: PropertyDelimiter = ':';
    properties: { [name: string]: Property } = {
        AnimNode: {
            type: 'string',
            description: 'Specifies the ID of the animation that will be used when crafting the item.',
        },
        InSameInventory: {
            type: 'boolean',
            description:
                'If the parameter is true, then the resources for crafting will be used from only one container (the one where the crafting menu was opened).',
        },
        OnCanPerform: {
            type: 'string',
            description: `
### Description:
The parameter contains the name of a Lua function that
will check the condition necessary to start crafting.

### Example:
\`\`\`lua
OnCanPerform:Recipe.OnCanPerform.HockeyMaskSmashBottle,
\`\`\`

### Implemented Lua Function:
\`\`\`lua
function Recipe.OnCanPerform.HockeyMaskSmashBottle(recipe, playerObj)
    local wornItem = playerObj:getWornItem("MaskEyes")
    return (wornItem ~= nil) and (wornItem:getType() == "Hat_HockeyMask")
end
\`\`\`
`,
        },
        Override: {
            type: 'boolean',
            description:
                'If this parameter is specified, then a recipe that is already loaded by the game will be overwritten with this recipe. Used, for example, to overwrite vanilla recipes.',
            values: BOOLEAN_VALUES,
        },
        Prop1: {
            type: 'string',
            description: 'Used to indicate the item that will be in the main (right) hand during crafting.',
        },
        Prop2: {
            type: 'string',
            description: 'Used to indicate the item that will be in the extra (left) hand during crafting.',
        },
        Result: {
            type: 'string',
            description: 'The result of crafting (item type and quantity).',
        },
        Sound: {
            type: 'string',
            description: 'Sound that will be played when player craft item.',
        },
        Time: {
            type: 'number',
            description: 'Specifies how much time will be spent on crafting.',
        },
    };

    constructor() {
        super();
    }
}

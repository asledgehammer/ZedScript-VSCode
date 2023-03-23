import * as vscode from 'vscode';
import { BOOLEAN_VALUES, Property as Property, PropertyDelimiter, Scope } from './Scope';

export class RecipeScope extends Scope {
    delimiter: PropertyDelimiter = ':';
    properties: { [name: string]: Property } = {
        AllowDestroyedItem: {
            type: 'boolean',
            description: `
### Description:
If the parameter is true, then allows the use of broken items as a resource.

### Example:
\`\`\`zed
AllowDestroyedItem: true,
\`\`\`
`,
            values: BOOLEAN_VALUES,
        },
        AllowFrozenItem: {
            type: 'boolean',
            description: `
### Description:
If the parameter is true, then allows frozen items to be used as a resource.

### Example:
\`\`\`zed
AllowFrozenItem: true,
\`\`\`
`,
            values: BOOLEAN_VALUES,
        },
        AllowOnlyOne: {
            type: 'boolean',
            description: `
### Description:
If the parameter is true, then only one item can be crafted at a time.

### Example:
\`\`\`zed
AllowOnlyOne: true,
\`\`\`
`,
            values: BOOLEAN_VALUES,
        },
        AllowRottenItem: {
            type: 'boolean',
            description: `
### Description:
If the parameter is true, then allows the use of rotten items as a resource.

### Example:
\`\`\`zed
AllowRottenItem: true,
\`\`\`
`,
            values: BOOLEAN_VALUES,
        },
        AnimNode: {
            type: 'string',
            description: `
### Description:
Specifies the ID of the animation that will be used when crafting the item.

### Example:
\`\`\`zed
AnimNode: RipSheets,
\`\`\`
`,
        },
        CanBeDoneFromFloor: {
            type: 'boolean',
            description: `
### Description:
If the parameter is true, then the crafting of the item can be done without
picking up resources from the floor (The player will not move items to
inventory)

### Example:
\`\`\`zed
CanBeDoneFromFloor: true,
\`\`\`
`,
            values: BOOLEAN_VALUES,
        },
        Category: {
            type: 'string',
            description: `
### Description:
Specifies the category in which the recipe will be displayed.

### Example:
\`\`\`zed
Category: Carpentry,
\`\`\`
`,
        },
        InSameInventory: {
            type: 'boolean',
            description: `
### Description:
If the parameter is true, then the resources for crafting will be used from
only one container (the one where the crafting menu was opened).

### Example:
\`\`\`zed
InSameInventory: true,
\`\`\`
`,
        },
        NeedToBeLearn: {
            type: 'boolean',
            description: `
### Description:
If the parameter is true, then in order to craft this item, you must first
learn the recipe. Usually recipes are learned through magazines or given
for certain perks/professions.

### Example:
\`\`\`zed
NeedToBeLearn: true,
\`\`\`
`,
            values: BOOLEAN_VALUES,
        },
        OnCanPerform: {
            type: 'string',
            description: `
### Description:
The parameter contains the name of a Lua function that
will check the condition necessary to start crafting.

### Example:
\`\`\`lua
OnCanPerform: Recipe.OnCanPerform.HockeyMaskSmashBottle,
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
        OnCreate: {
            type: 'string',
            description: `
### Description:
The parameter contains the name of the Lua function that
is called before using the resources and getting the
crafting result. Allows you to add additional functional.
Resource items, a crafting result item, and a player
object are passed as input to the function.

### Example:
\`\`\`zed
OnCreate: Recipe.OnCreate.Dismantle,
\`\`\`

### Implemented Lua Function:
\`\`\`lua
function Recipe.OnCreate.Dismantle(items, result, player)
    player:getInventory():AddItem("Base.ElectronicsScrap");
end
\`\`\`
`,
        },
        OnTest: {
            type: 'string',
            description: `
### Description:
The parameter contains the name of the Lua function that
checks the resources (items) used in crafting and returns
true or false.

### Example:
\`\`\`zed
OnTest: Recipe.OnTest.IsNotWorn,
\`\`\`

### Implemented Lua Function:
\`\`\`lua
function Recipe.OnTest.IsNotWorn(item)
    if instanceof(item, "Clothing") then
    return not item:isWorn()
    end
    return true
end
\`\`\`
`,
        },
        Override: {
            type: 'boolean',
            description: `
### Description:
If this parameter is specified, then a recipe that is
already loaded by the game will be overwritten with
this recipe. Used, for example, to overwrite vanilla
recipes.

### Example:
\`\`\`zed
Override: true,
\`\`\`
`,
            values: BOOLEAN_VALUES,
        },
        Prop1: {
            type: 'string',
            description: `
### Description:
Used to indicate the item that will be in the main
(right) hand during crafting.

### Example:
\`\`\`zed
Prop1: Screwdriver,
\`\`\`
`,
        },
        Prop2: {
            type: 'string',
            description: `
### Description:
Used to indicate the item that will be in the main
(left) hand during crafting.

### Example:
\`\`\`zed
Prop2: Screwdriver,
\`\`\`
`,
        },
        RemoveResultItem: {
            type: 'boolean',
            description: `
### Description:
If the parameter is true, then the recipe will not
return the crafting result to the player.

### Example:
\`\`\`zed
RemoveResultItem: true,
\`\`\`
`,
            values: BOOLEAN_VALUES,
        },
        Result: {
            type: 'string',
            description: `
### Description:
The result of crafting (item type and quantity).

### Example:
\`\`\`zed
Result: FishingHook = 10,
\`\`\`
`,
        },
        Sound: {
            type: 'string',
            description: `
### Description:
Sound that will be played when player craft item.

### Example:
\`\`\`zed
Sound: PutItemInBag,
\`\`\`
`,
        },
        Time: {
            type: 'number',
            description: `
### Description:
Specifies how much time will be spent on crafting.

### Example:
\`\`\`zed
Time: 230.0,
\`\`\`
`,
        },
    };

    constructor() {
        super();
    }
}

// TODO: NearItem going down.
// https://pzwiki.net/wiki/Scripts_guide/Recipe_Script_Guide#NearItem
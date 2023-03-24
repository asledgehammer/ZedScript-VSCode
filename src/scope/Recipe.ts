import * as vscode from 'vscode';
import { CODE, Property as Property, PropertyDelimiter, Scope, SKILL_LEVEL_VALUES, SKILL_VALUES } from './Scope';

/**
 * Templates, documents, and completes types properties for recipes in ZedScript.
 *
 * Translated Documentation from PZWIKI:
 * https://pzwiki.net/wiki/Scripts_guide/Recipe_Script_Guide
 *
 * @author Jab
 */
export class RecipeScope extends Scope {
    delimiter: PropertyDelimiter = ':';
    properties: { [name: string]: Property } = {
        AllowDestroyedItem: {
            type: 'boolean',
            description: `
            ### Description:
            If the parameter is true, then allows the use of broken items as a resource.

            ### Example:
            ${CODE}zed
            AllowDestroyedItem: true,
            ${CODE}
            `,
        },
        AllowFrozenItem: {
            type: 'boolean',
            description: `
            ### Description:
            If the parameter is true, then allows frozen items to be used as a resource.

            ### Example:
            ${CODE}zed
            AllowFrozenItem: true,
            ${CODE}
            `,
        },
        AllowOnlyOne: {
            type: 'boolean',
            description: `
            ### Description:
            If the parameter is true, then only one item can be crafted at a time.

            ### Example:
            ${CODE}zed
            AllowOnlyOne: true,
            ${CODE}
            `,
        },
        AllowRottenItem: {
            type: 'boolean',
            description: `
            ### Description:
            If the parameter is true, then allows the use of rotten items as a resource.

            ### Example:
            ${CODE}zed
            AllowRottenItem: true,
            ${CODE}
            `,
        },
        AnimNode: {
            type: 'string',
            description: `
            ### Description:
            Specifies the ID of the animation that will be used when crafting the item.

            ### Example:
            ${CODE}zed
            AnimNode: RipSheets,
            ${CODE}
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
            ${CODE}zed
            CanBeDoneFromFloor: true,
            ${CODE}
            `,
        },
        Category: {
            type: 'string',
            description: `
            ### Description:
            Specifies the category in which the recipe will be displayed.

            ### Example:
            ${CODE}zed
            Category: Carpentry,
            ${CODE}
            `,
        },
        Heat: {
            type: 'float',
            description: `
            ### Description:
            Specifies how much time will be spent on crafting.

            ### Example:
            ${CODE}zed
            Time: 230.0,
            ${CODE}
            `,
        },
        InSameInventory: {
            type: 'boolean',
            description: `
            ### Description:
            If the parameter is true, then the resources for crafting will be used from
            only one container (the one where the crafting menu was opened).

            ### Example:
            ${CODE}zed
            InSameInventory: true,
            ${CODE}
            `,
        },
        IsHidden: {
            type: 'boolean',
            description: `
            ### Description:
            If the parameter is true, then hides crafting from the crafting menu.

            ### Example:
            ${CODE}zed
            IsHidden: true,
            ${CODE}
            `,
        },
        NearItem: {
            type: 'string',
            description: `
            ### Description:
            Allows crafting only if there is an object nearby with the name of the value,
            which is specified in the parameter.

            ### Example:
            ${CODE}zed
            NearItem: Workbench,
            ${CODE}
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
            ${CODE}zed
            NeedToBeLearn: true,
            ${CODE}
            `,
        },
        NoBrokenItems: {
            type: 'boolean',
            description: `
            ### Description:
            If the parameter is true, then broken items cannot be used in crafting.

            ### Example:
            ${CODE}zed
            NoBrokenItems: true,
            ${CODE}
            `,
        },
        Obsolete: {
            type: 'boolean',
            description: `
            ### Description:
            If the parameter is true, then the recipe will be removed from the game.
            The parameter can be useful for overriding and removing vanilla recipes.

            ### Example:
            ${CODE}zed
            Obsolete: true,
            ${CODE}
            `,
        },
        OnCanPerform: {
            type: 'lua',
            luaPrefix: 'Recipe.OnCanPerform',
            description: `
            ### Description:
            The parameter contains the name of a Lua function that
            will check the condition necessary to start crafting.

            ### Example:
            ${CODE}lua
            OnCanPerform: Recipe.OnCanPerform.HockeyMaskSmashBottle,
            ${CODE}

            ### Implemented Lua Function:
            ${CODE}lua
            function Recipe.OnCanPerform.HockeyMaskSmashBottle(recipe, playerObj)
                local wornItem = playerObj:getWornItem("MaskEyes")
                return (wornItem ~= nil) and (wornItem:getType() == "Hat_HockeyMask")
            end
            ${CODE}
            `,
        },
        OnCreate: {
            type: 'lua',
            luaPrefix: 'Recipe.OnCreate',
            description: `
            ### Description:
            The parameter contains the name of the Lua function that
            is called before using the resources and getting the
            crafting result. Allows you to add additional functional.
            Resource items, a crafting result item, and a player
            object are passed as input to the function.

            ### Example:
            ${CODE}zed
            OnCreate: Recipe.OnCreate.Dismantle,
            ${CODE}

            ### Implemented Lua Function:
            ${CODE}lua
            function Recipe.OnCreate.Dismantle(items, result, player)
                player:getInventory():AddItem("Base.ElectronicsScrap");
            end
            ${CODE}
            `,
        },
        OnGiveXP: {
            type: 'lua',
            luaPrefix: 'Recipe.OnGiveXP',
            description: `
            ### Description:
            The parameter contains the name of a Lua function that gives
            experience to the crafting player.

            ### Example:
            ${CODE}zed
            OnGiveXP: Recipe.OnGiveXP.SawLogs,
            ${CODE}

            ### Implemented Lua Function:
            ${CODE}lua
            function Recipe.OnGiveXP.SawLogs(recipe, ingredients, result, player)
                if player:getPerkLevel(Perks.Woodwork) <= 3 then
                    player:getXp():AddXP(Perks.Woodwork, 3);
                else
                    player:getXp():AddXP(Perks.Woodwork, 1);
                end
            end
            ${CODE}
            `,
        },
        OnTest: {
            type: 'lua',
            luaPrefix: 'Recipe.OnTest',
            description: `
            ### Description:
            The parameter contains the name of the Lua function that
            checks the resources (items) used in crafting and returns
            true or false.

            ### Example:
            ${CODE}zed
            OnTest: Recipe.OnTest.IsNotWorn,
            ${CODE}

            ### Implemented Lua Function:
            ${CODE}lua
            function Recipe.OnTest.IsNotWorn(item)
                if instanceof(item, "Clothing") then
                return not item:isWorn()
                end
                return true
            end
            ${CODE}
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
            ${CODE}zed
            Override: true,
            ${CODE}
            `,
        },
        Prop1: {
            type: 'string',
            description: `
            ### Description:
            Used to indicate the item that will be in the main
            (right) hand during crafting.

            ### Example:
            ${CODE}zed
            Prop1: Screwdriver,
            ${CODE}
            `,
        },
        Prop2: {
            type: 'string',
            description: `
            ### Description:
            Used to indicate the item that will be in the main
            (left) hand during crafting.

            ### Example:
            ${CODE}zed
            Prop2: Screwdriver,
            ${CODE}
            `,
        },
        RemoveResultItem: {
            type: 'boolean',
            description: `
            ### Description:
            If the parameter is true, then the recipe will not
            return the crafting result to the player.

            ### Example:
            ${CODE}zed
            RemoveResultItem: true,
            ${CODE}
            `,
        },
        Result: {
            type: 'string',
            description: `
            ### Description:
            The result of crafting (item type and quantity).

            ### Example:
            ${CODE}zed
            Result: FishingHook = 10,
            ${CODE}
            `,
        },
        SkillRequired: {
            type: 'string',
            onComplete: (name: string | undefined): vscode.CompletionItem => {
                const key = 'SkillRequired';
                const desc = `
### Description:
The parameter indicates the required skill and its level for crafting.

### Example:
${CODE}zed
SkillRequired: Woodwork = 7,
${CODE}
`;
                const item = new vscode.CompletionItem(key);
                item.documentation = new vscode.MarkdownString(desc);
                item.insertText = new vscode.SnippetString(
                    key + ': ${1|' + SKILL_VALUES.join(',') + '|} = ${2|' + SKILL_LEVEL_VALUES.join(',') + '|},'
                );
                return item;
            },
        },
        Sound: {
            type: 'string',
            description: `
            ### Description:
            Sound that will be played when player craft item.

            ### Example:
            ${CODE}zed
            Sound: PutItemInBag,
            ${CODE}
            `,
        },
        StopOnRun: {
            type: 'boolean',
            description: `
            ### Description:
            If the parameter is true, then it will not be
            possible to craft an item when the player is
            running. If set to false, then it will be
            possible to craft while running.

            ### Example:
            ${CODE}zed
            StopOnRun: false,
            ${CODE}
            `,
        },
        StopOnWalk: {
            type: 'boolean',
            description: `
            ### Description:
            If the parameter is true, then it will not be
            possible to craft the item when the player is
            walking. If it is false, then it will be
            possible to craft on the go.

            ### Example:
            ${CODE}zed
            StopOnWalk: false,
            ${CODE}
            `,
        },
        Time: {
            type: 'float',
            description: `
            ### Description:
            Specifies how much time will be spent on crafting.

            ### Example:
            ${CODE}zed
            Time: 230.0,
            ${CODE}
            `,
        },
    };

    constructor() {
        super();
    }
}

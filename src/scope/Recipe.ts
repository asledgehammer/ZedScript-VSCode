import * as vscode from 'vscode';
import {
    CODE,
    DESC,
    EXAMPLE,
    outcase,
    Property as Property,
    PropertyDelimiter,
    Scope,
    SKILL_LEVEL_VALUES,
    SKILL_VALUES,
} from './Scope';

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
            description: 'If the parameter is true, then allows the use of broken items as a resource.',
            example: 'AllowDestroyedItem: true,',
        },
        AllowFrozenItem: {
            type: 'boolean',
            description: 'If the parameter is true, then allows frozen items to be used as a resource.',
            example: 'AllowFrozenItem: true,',
        },
        AllowOnlyOne: {
            type: 'boolean',
            description: 'If the parameter is true, then only one item can be crafted at a time.',
            example: 'AllowOnlyOne: true,',
        },
        AllowRottenItem: {
            type: 'boolean',
            description: 'If the parameter is true, then allows the use of rotten items as a resource.',
            example: 'AllowRottenItem: true,',
        },
        AnimNode: {
            type: 'string',
            description: 'Specifies the ID of the animation that will be used when crafting the item.',
            example: 'AnimNode: RipSheets,',
        },
        CanBeDoneFromFloor: {
            type: 'boolean',
            description: `
                If the parameter is true, then the crafting of the item can be done without picking up resources from
                the floor (The player will not move items to inventory)`,
            example: 'CanBeDoneFromFloor: true',
        },
        Category: {
            type: 'string',
            description: 'Specifies the category in which the recipe will be displayed.',
            example: 'Category: Carpentry,',
        },
        Heat: {
            type: 'float',
            description: `
                The parameter indicates the temperature of the resource required for crafting. -1.0 (Very hot) to 1.0
                (Very cold).
            `,
            example: 'Heat: -0.22,',
            values: {
                '-1.0': 'Very hot',
                '1.0': 'Very cold'
            },
            // range: [-1.0, 1.0]
        },
        InSameInventory: {
            type: 'boolean',
            description: `
                If the parameter is true, then the resources for crafting will be used from only one container
                (the one where the crafting menu was opened).
            `,
            example: 'InSameInventory: true,',
        },
        IsHidden: {
            type: 'boolean',
            description: 'If the parameter is true, then hides crafting from the crafting menu.',
            example: 'IsHidden: true,',
        },
        NearItem: {
            type: 'string',
            description: `
                Allows crafting only if there is an object nearby with the name of the value, which is specified in the
                parameter.
            `,
            example: 'NearItem: Workbench,',
        },
        NeedToBeLearn: {
            type: 'boolean',
            description: `
                If the parameter is true, then in order to craft this item, you must first learn the recipe. Usually
                recipes are learned through magazines or given for certain perks/professions.
            `,
            example: 'NeedToBeLearn: true,',
        },
        NoBrokenItems: {
            type: 'boolean',
            description: 'If the parameter is true, then broken items cannot be used in crafting.',
            example: 'NoBrokenItems: true,',
        },
        Obsolete: {
            type: 'boolean',
            description: `
                If the parameter is true, then the recipe will be removed from the game. The parameter can be useful for
                overriding and removing vanilla recipes.
            `,
            example: 'Obsolete: true,',
        },
        OnCanPerform: {
            type: 'lua',
            description: `
                The parameter contains the name of a Lua function that will check the condition necessary to start
                crafting.
            `,
            example: 'OnCanPerform: Recipe.OnCanPerform.HockeyMaskSmashBottle,',
            luaPrefix: 'Recipe.OnCanPerform',
            luaExample: `
                function Recipe.OnCanPerform.HockeyMaskSmashBottle(recipe, playerObj)
                    local wornItem = playerObj:getWornItem("MaskEyes")
                    return (wornItem ~= nil) and (wornItem:getType() == "Hat_HockeyMask")
                end
            `,
        },
        OnCreate: {
            type: 'lua',
            description: `
            The parameter contains the name of the Lua function that is called before using the resources and
            getting the crafting result. Allows you to add additional functional. Resource items, a crafting result
            item, and a player object are passed as input to the function.
            `,
            example: 'OnCreate: Recipe.OnCreate.Dismantle,',
            luaPrefix: 'Recipe.OnCreate',
            luaExample: `
                function Recipe.OnCreate.Dismantle(items, result, player)
                    player:getInventory():AddItem("Base.ElectronicsScrap");
                end
            `,
        },
        OnGiveXP: {
            type: 'lua',
            description: `
            The parameter contains the name of a Lua function that gives experience to the crafting player.
            `,
            example: 'OnGiveXP: Recipe.OnGiveXP.SawLogs,',
            luaPrefix: 'Recipe.OnGiveXP',
            luaExample: `
                function Recipe.OnGiveXP.SawLogs(recipe, ingredients, result, player)
                    if player:getPerkLevel(Perks.Woodwork) <= 3 then
                        player:getXp():AddXP(Perks.Woodwork, 3);
                    else
                        player:getXp():AddXP(Perks.Woodwork, 1);
                    end
                end
            `,
        },
        OnTest: {
            type: 'lua',
            description: `
            The parameter contains the name of the Lua function that checks the resources (items) used in crafting
            and returns true or false.
            `,
            example: 'OnTest: Recipe.OnTest.IsNotWorn,',
            luaPrefix: 'Recipe.OnTest',
            luaExample: `
                function Recipe.OnTest.IsNotWorn(item)
                    if instanceof(item, "Clothing") then
                    return not item:isWorn()
                    end
                    return true
                end
            `,
        },
        Override: {
            type: 'boolean',
            description: `
                If this parameter is specified, then a recipe that is already loaded by the game will be overwritten
                with this recipe. Used, for example, to overwrite vanilla recipes.
            `,
            example: 'Override: true,',
        },
        Prop1: {
            type: 'string',
            description: 'Used to indicate the item that will be in the main (right) hand during crafting.',
            example: 'Prop1: Screwdriver,',
        },
        Prop2: {
            type: 'string',
            description: 'Used to indicate the item that will be in the main (left) hand during crafting.',
            example: 'Prop2: Screwdriver,',
        },
        RemoveResultItem: {
            type: 'boolean',
            description: 'If the parameter is true, then the recipe will not return the crafting result to the player.',
            example: 'RemoveResultItem: true,',
        },
        Result: {
            type: 'string',
            description: 'The result of crafting (item type and quantity).',
            example: 'Result: FishingHook = 10,',
        },
        SkillRequired: {
            type: 'string',
            onComplete: (_: string | undefined): vscode.CompletionItem => {
                const enabled = vscode.workspace.getConfiguration('zedscript').get('autoCompleteEnabled');
                const key = 'SkillRequired';
                const desc = `
                    ${DESC}
                    The parameter indicates the required skill and its level for crafting.

                    ${EXAMPLE}
                    ${CODE}zed
                    SkillRequired: Woodwork = 7,
                    ${CODE}
                `;
                const item = new vscode.CompletionItem(key);
                if (!enabled) {
                    item.insertText = new vscode.SnippetString(key + this.delimiter + ' ${1},');
                }

                item.documentation = new vscode.MarkdownString(outcase(desc));
                if (enabled) {
                    item.insertText = new vscode.SnippetString(
                        key + ': ${1|' + SKILL_VALUES.join(',') + '|} = ${2|' + SKILL_LEVEL_VALUES.join(',') + '|},'
                    );
                }
                return item;
            },
        },
        Sound: {
            type: 'string',
            description: 'Sound that will be played when player craft item.',
            example: 'Sound: PutItemInBag,',
        },
        StopOnRun: {
            type: 'boolean',
            description: `
                If the parameter is true, then it will not be possible to craft an item when the player is running. If
                set to false, then it will be possible to craft while running.
            `,
            example: 'StopOnRun: false,',
        },
        StopOnWalk: {
            type: 'boolean',
            description: `
                If the parameter is true, then it will not be possible to craft the item when the player is walking. If
                it is false, then it will be possible to craft on the go.
            `,
            example: 'StopOnWalk: false,',
        },
        Time: {
            type: 'float',
            description: 'Specifies how much time will be spent on crafting.',
            example: 'Time: 230.0,',
        },
    };

    constructor() {
        super();
    }
}

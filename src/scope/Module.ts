import * as vscode from 'vscode';
import { ITEM_TYPES } from './item/ItemScope';
import { CODE, outcase, ScopeProperty } from './Scope';

export function indent(s: string, indent: number): string {
    if (s.indexOf('\n') === -1) return ' '.repeat(indent) + s;
    return s
        .split('\n')
        .map((o) => {
            return ' '.repeat(indent) + o;
        })
        .join('\n');
}

export class ModuleScope {
    onComplete(name: string | undefined, phrase: string, data?: any): vscode.CompletionItem[] {
        const items = [];

        const phraseLower = phrase.toLowerCase();

        if ('animation'.indexOf(phraseLower) !== -1) {
            const snippet = outcase(
                `
                animation $\{1} {
                    CopyFrame {
                        Frame = $\{2|1|},
                        Source = $\{3},
                        SourceFrame = $\{4|1|},
                    }
                }
            `.substring(1)
            );

            const item = new vscode.CompletionItem('animation');
            item.insertText = new vscode.SnippetString(snippet);
            item.documentation = new vscode.MarkdownString(
                outcase(`
                TODO: Document.

                ### Sources:
                - [PZWiki](https://pzwiki.net/wiki/Scripts_guide/)
                - [Zomboid Modding Guide](https://github.com/FWolfe/Zomboid-Modding-Guide/blob/master/scripts/README.md)
            `)
            );
            items.push(item);
        }
        if ('evolvedrecipe'.indexOf(phraseLower) !== -1) {
            const snippet = outcase(
                `
                evolvedrecipe $\{1} {
                    Name: $\{2}
                    BaseItem: $\{3},
                    MaxItems: $\{4},
                    ResultItem: $\{5},
                }
            `.substring(1)
            );

            const item = new vscode.CompletionItem('evolvedrecipe');
            item.insertText = new vscode.SnippetString(snippet);
            item.documentation = new vscode.MarkdownString(
                outcase(`
                    The evolved recipe is divided into three parts: 
                    - The thing to be transformed.
                    - Things that can be used in the recipe.
                    - The result of the recipe.

                    ### Example:
                    We want to create recipe for sandwich with Ham and Tomato. We have 4 items:

                    ${CODE}zed
                    item Tomato {
                        Type = Food,
                        EvolvedRecipe = Sandwich:6; Burger:6,
                        // ...
                    }

                    item Ham {
                        Type = Food,
                        EvolvedRecipe = Sandwich:3; Burger:3,
                        // ...
                    }

                    item BreadSlices {
                        Type = Food,
                        EvolvedRecipe = Soup:5; Stew:5; Salad:5,
                        // ...
                    }

                    item Sandwich {
                        Type = Food,
                        // ...
                    }
                    ${CODE}
                    We set with the EvolvedRecipe parameter that Tomato and Ham can be added to Sandwich.

                    Next, we create the script EvolvedRecipe:
                    ${CODE}zed
                    evolvedrecipe Sandwich {
                        BaseItem: BreadSlices,
                        MaxItems: 4,
                        ResultItem: Sandwich,
                        Name: Make Sandwich,
                        CanAddSpicesEmpty: true,
                        AddIngredientIfCooked: true,
                        Template: Sandwich,
                    }
                    ${CODE}

                    In the recipe, we indicated that BreadSlices can be used to create Sandwich. We also indicated that
                    you can add spices even if no other ingredients have been added and that you can add ingredients if
                    the BreadSlices or Sandwich is already cooked.

                    We also indicated with this EvolvedRecipe that it is possible to add Ham, Tomato and spices to the
                    already prepared Sandwich (the ability to add spices is added by default).

                    ### Sources:
                    - [PZWiki](https://pzwiki.net/wiki/Scripts_guide/Evolved_Recipe_Script_Guide)
                    - [Zomboid Modding Guide](https://github.com/FWolfe/Zomboid-Modding-Guide/blob/master/scripts/README.md#the-evolvedrecipe-block)
            `)
            );
            items.push(item);
        }
        if ('item'.indexOf(phraseLower) !== -1) {
            const snippet = outcase(
                `
                item $\{1} {
                    Type: $\{2|${ITEM_TYPES.join(',')}|},
                    Tooltip: $\{3},
                    Tags: $\{4},
                    Weight: $\{5|1.00|},
                }
            `.substring(1)
            );

            const item = new vscode.CompletionItem('item');
            item.insertText = new vscode.SnippetString(snippet);
            item.documentation = new vscode.MarkdownString(
                outcase(`
                Items in-game are defined using 'item' blocks.

                ### Sources:
                - [PZWiki](https://pzwiki.net/wiki/Scripts_guide/Item_Script_Parameters)
                - [Zomboid Modding Guide](https://github.com/FWolfe/Zomboid-Modding-Guide/blob/master/scripts/README.md#the-item-block)
            `)
            );
            items.push(item);
        }
        if ('recipe'.indexOf(phraseLower) !== -1) {
            const snippet = outcase(
                `
                recipe $\{1} {
                    keep $\{2},
                    destroy $\{3},
                    Result: $\{4},
                }
            `.substring(1)
            );

            const item = new vscode.CompletionItem('recipe');
            item.insertText = new vscode.SnippetString(snippet);
            item.documentation = new vscode.MarkdownString(
                outcase(`
                Recipes are a description of the ingredients for crafting an item and a description of the item that
                will result from crafting.

                Be careful in the syntax of describing parameters in recipes. Recipes use the **property: value**
                format, while items use **property = value**.

                ### Sources:
                - [PZWiki](https://pzwiki.net/wiki/Scripts_guide/Recipe_Script_Guide)
                - [Zomboid Modding Guide](https://github.com/FWolfe/Zomboid-Modding-Guide/blob/master/scripts/README.md#the-recipe-block)
            `)
            );
            items.push(item);
        }
        return items;
    }

    onHover(phrase: string, data?: any): string {
        return 'test';
    }

    getProperties(data?: any): { [name: string]: ScopeProperty } {
        return {};
    }
}

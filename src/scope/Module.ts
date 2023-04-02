import * as vscode from 'vscode';
import { ITEM_TYPES } from './item/ItemScope';
import { outcase, ScopeProperty } from './Scope';

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
            item.documentation = new vscode.MarkdownString(outcase(`
                Items in-game are defined using 'item' blocks.
            
            `));
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

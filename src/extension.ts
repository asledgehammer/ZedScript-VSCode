import * as vscode from 'vscode';
import { ItemScope } from './scope/Item';
import { RecipeScope } from './scope/Recipe';
import { getScope, ScriptScope } from './scope/Scope';

export function activate(context: vscode.ExtensionContext) {
    const provider1 = vscode.languages.registerCompletionItemProvider('zed', {
        provideCompletionItems(
            document: vscode.TextDocument,
            position: vscode.Position,
            token: vscode.CancellationToken,
            context: vscode.CompletionContext
        ) {
            try {
                const phrase = document.lineAt(position.line).text.trim().toLowerCase();
                console.log({ phrase });

                const [scope, name] = getScope(document, position);
                console.log({ scope, name });

                return complete(scope, name, phrase);
            } catch (err) {
                console.error(err);
            }
            // // a completion item that retriggers IntelliSense when being accepted,
            // // the `command`-property is set which the editor will execute after
            // // completion has been inserted. Also, the `insertText` is set so that
            // // a space is inserted after `new`
            // const commandCompletion = new vscode.CompletionItem('new');
            // commandCompletion.kind = vscode.CompletionItemKind.Keyword;
            // commandCompletion.insertText = 'new ';
            // commandCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };
        },
    });

    context.subscriptions.push(provider1);
}

export function complete(scope: ScriptScope, name: string | undefined, phrase: string): vscode.CompletionItem[] {
    switch (scope) {
        case 'item':
            return new ItemScope().onComplete(name, phrase);
        case 'recipe':
            return new RecipeScope().onComplete(name, phrase);
    }
    return [];
}

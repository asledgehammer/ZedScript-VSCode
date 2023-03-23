import * as vscode from 'vscode';
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
            const scope = getScope(document, position);
            const phrase = document.lineAt(position.line).text.trim().toLowerCase();

            return complete(scope, phrase);

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

export function complete(scope: ScriptScope, phrase: string): vscode.CompletionItem[] {
    switch (scope) {
        case 'recipe':
            return new RecipeScope().onComplete(phrase);
    }
    return [];
}

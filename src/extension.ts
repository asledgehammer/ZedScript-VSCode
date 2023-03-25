import * as vscode from 'vscode';
import { tokenize } from './API';
import { LexerToken } from './Lexer';
import { ItemScope } from './scope/Item';
import { RecipeScope } from './scope/Recipe';
import { getScope, getTokenAt, ScriptScope } from './scope/Scope';

export function activate(context: vscode.ExtensionContext) {
    
    const hover1 = vscode.languages.registerHoverProvider('zed', {
        provideHover(document: vscode.TextDocument, position: vscode.Position, _: vscode.CancellationToken) {
            try {
                const tokens = tokenize(document.getText(), { comments: false, location: true }).tokens as LexerToken[];
                const token = getTokenAt(document, position, tokens);
                const [scope, name] = getScope(document, position, tokens);
                console.log({ scope, name, token });
                return new vscode.Hover(new vscode.MarkdownString(hover(scope, token)));
            } catch (err) {
                console.error(err);
            }
        },
    });

    const provider1 = vscode.languages.registerCompletionItemProvider('zed', {
        provideCompletionItems(
            document: vscode.TextDocument,
            position: vscode.Position,
            _: vscode.CancellationToken,
            __: vscode.CompletionContext
        ) {
            try {
                const tokens = tokenize(document.getText(), { comments: false, location: true }).tokens as LexerToken[];
                const phrase = document.lineAt(position.line).text.trim().toLowerCase();
                const [scope, name] = getScope(document, position, tokens);
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

    context.subscriptions.push(provider1, hover1);
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

export function hover(scope: ScriptScope, phrase: string): string {
    switch (scope) {
        case 'item':
            return new ItemScope().onHover(phrase);
        case 'recipe':
            return new RecipeScope().onHover(phrase);
    }
    return '';
}

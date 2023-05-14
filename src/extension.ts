import * as vscode from 'vscode';
import { LexerToken } from './Lexer';
import { AnimationScope } from './scope/Animation';
import { AnimationsMeshScope } from './scope/AnimationsMesh';
import { ItemScope } from './scope/item/ItemScope';
import { ModuleScope } from './scope/Module';
import { RecipeScope } from './scope/Recipe';
import { getScope, getTokenAt, ScriptScope } from './scope/Scope';
import { lint3 } from './lint/APILegacy';
import { FormatOptions } from './format/FormatOptions';
import { format } from './format/API';
import { lint } from './lint/API';
import { tokenize } from './token/API';

import * as LegacyAPI from './API';

const DEBUG = false;

export function activate(context: vscode.ExtensionContext) {
    // DIAGNOSTICS
    function createFix(document: vscode.TextDocument, range: vscode.Range, text: string): vscode.CodeAction {
        // const fix = new vscode.CodeAction(text, vscode.CodeActionKind.QuickFix);
        // fix.edit = new vscode.WorkspaceEdit();
        // fix.edit.replace(document.uri, range, text);
        // return fix;

        const fix = new vscode.CodeAction(text, vscode.CodeActionKind.Refactor);
        fix.edit = new vscode.WorkspaceEdit();
        fix.diagnostics = [new vscode.Diagnostic(range, 'diag', vscode.DiagnosticSeverity.Error)];
        fix.edit.replace(document.uri, range, text);
        return fix;
    }

    vscode.languages.registerCodeActionsProvider(
        'zed',
        {
            provideCodeActions: function (
                document: vscode.TextDocument,
                range: vscode.Range | vscode.Selection,
                context: vscode.CodeActionContext,
                token: vscode.CancellationToken
            ): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
                const _range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 'module'.length));
                const fix = createFix(document, _range, 'Hello, world!');
                return [fix];
            },
        },
        { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }
    );

    // FORMATTER
    vscode.languages.registerDocumentFormattingEditProvider('zed', {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            try {
                const options: FormatOptions = {
                    indentSize: vscode.window.activeTextEditor?.options.tabSize as number,
                    bracketStyle: 'inline',
                    propertyCasing: 'pascal_case',
                };

                const t3 = tokenize(document.getText(), options);
                const l3 = lint(t3);
                console.log(JSON.stringify(l3.logs, null, 4));

                // const f3 = format(t3, options);

                const editor = vscode.window.activeTextEditor!;
                const position = editor!.selection.active;

                const newPosition = position.with(position.line, 0);
                const newSelection = new vscode.Selection(newPosition, newPosition);

                setTimeout(() => {
                    editor.selection = newSelection;
                }, 10);

                const range = new vscode.Range(
                    new vscode.Position(0, 0),
                    document.positionAt(document.getText().length)
                );

                if (DEBUG) {
                    return [
                        vscode.TextEdit.delete(range),
                        vscode.TextEdit.insert(new vscode.Position(0, 0), JSON.stringify(t3, null, 4)),
                    ];
                }
                return [];
                // return [vscode.TextEdit.replace(range, f3)];
            } catch (err) {
                vscode.window.showErrorMessage('Error Making API Call');
                console.error(err);
            }
            return [];
        },
    });

    const hover1 = vscode.languages.registerHoverProvider('zed', {
        provideHover(document: vscode.TextDocument, position: vscode.Position, _: vscode.CancellationToken) {
            try {
                if (DEBUG) return;
                const enabled = vscode.workspace.getConfiguration('zedscript').get('hoverPopupEnabled');
                if (!enabled) {
                    return;
                }
                const tokens = LegacyAPI.tokenize(document.getText());
                const token = getTokenAt(document, position, tokens);
                const [scope, name, type] = getScope(document, position, tokens);
                return new vscode.Hover(new vscode.MarkdownString(hover(scope, token, { type })));
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
                const tokens = LegacyAPI.tokenize(document.getText());
                const phrase = document.lineAt(position.line).text.trim().toLowerCase();
                const [scope, name, type] = getScope(document, position, tokens);

                console.log({ scope, name, type, phrase });
                return complete(scope, name, phrase, { type });
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

    const zedDiagnostics = vscode.languages.createDiagnosticCollection('ZedScript');

    function refreshDiagnostics(document: vscode.TextDocument): void {
        const diagnostics: vscode.Diagnostic[] = [];

        console.log({tabSize: vscode.window.activeTextEditor?.options.tabSize});

        const options: FormatOptions = {
            indentSize: vscode.window.activeTextEditor?.options.tabSize as number,
            bracketStyle: 'inline',
            propertyCasing: 'pascal_case',


        };

        const t3 = tokenize(document.getText(), options);
        const l3 = lint(t3);
        console.log(JSON.stringify(l3.logs, null, 4));

        for (const log of l3.logs) {
            const { location } = log;
            const { start, stop } = location;
            const r = new vscode.Range(
                new vscode.Position(start.row - 1, start.col - 1),
                new vscode.Position(stop.row - 1, stop.col - 1)
            );
            let s: vscode.DiagnosticSeverity = vscode.DiagnosticSeverity.Error;
            switch (log.type) {
                case 'warning': {
                    s = vscode.DiagnosticSeverity.Warning;
                    break;
                }
                case 'info': {
                    s = vscode.DiagnosticSeverity.Information;
                    break;
                }
                default: {
                    s = vscode.DiagnosticSeverity.Error;
                }
            }
            diagnostics.push(new vscode.Diagnostic(r, log.message, s));
        }

        // const diagnostic = new vscode.Diagnostic(
        //     new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 'module'.length)),
        //     'Hi!'
        // );
        // diagnostics.push(diagnostic);

        zedDiagnostics.set(document.uri, diagnostics);
    }

    if (vscode.window.activeTextEditor) {
        refreshDiagnostics(vscode.window.activeTextEditor.document);
    }
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                refreshDiagnostics(editor.document);
            }
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument((document: vscode.TextDocument) => {
            refreshDiagnostics(document);
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument((document: vscode.TextDocument) => {
            console.log(`onClose`);
            zedDiagnostics.delete(document.uri);
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument((event: vscode.TextDocumentChangeEvent) => {
            console.log(`onChange`);
            refreshDiagnostics(event.document);
        })
    );

    context.subscriptions.push(provider1, hover1);
}

export function complete(
    scope: ScriptScope,
    name: string | undefined,
    phrase: string,
    data?: any
): vscode.CompletionItem[] {
    switch (scope) {
        case 'animation':
            return new AnimationScope().onComplete(name, phrase, data);
        case 'animationsmesh':
            return new AnimationsMeshScope().onComplete(name, phrase, data);
        case 'item':
            return new ItemScope().onComplete(name, phrase, data);
        case 'module':
            return new ModuleScope().onComplete(name, phrase, data);
        case 'recipe':
            return new RecipeScope().onComplete(name, phrase, data);
    }
    return [];
}

export function hover(scope: ScriptScope, phrase: string, data?: any): string {
    switch (scope) {
        case 'animation':
            return new AnimationScope().onHover(phrase, data);
        case 'animationsmesh':
            return new AnimationsMeshScope().onHover(phrase, data);
        case 'item':
            return new ItemScope().onHover(phrase, data);
        case 'module':
            return new ModuleScope().onHover(phrase, data);
        case 'recipe':
            return new RecipeScope().onHover(phrase, data);
    }
    return '';
}

export function oldFormat(tokens: LexerToken[]): string {
    let ss = '';
    let s = '';
    const indentWidth = 4;
    let indent = 0;
    let previousEndBracket = false;
    let moduleLine = false;

    const prefix = () => {
        s += `${' '.repeat(indent * indentWidth)}`;
    };

    const line = () => {
        ss += s + '\n';
        s = '';
    };

    for (let index = 0; index < tokens.length; index++) {
        const token = tokens[index];
        if (token.val === '{') {
            indent++;
            s += ` {`;
            line();
            if (moduleLine) {
                line();
                moduleLine = false;
            }
            previousEndBracket = false;
        } else if (token.val === '}') {
            indent--;
            // Safety-Check
            if (indent < 0) indent = 0;
            prefix();
            s += '}';
            line();
            if (!previousEndBracket && indent > 0) line();
            previousEndBracket = true;
        } else {
            previousEndBracket = false;

            switch (token.val.toLowerCase().trim()) {
                case 'item': {
                    prefix();
                    s += 'item ' + tokens[++index].val;
                    continue;
                }
                case 'imports': {
                    prefix();
                    s += 'imports';
                    continue;
                }
                case 'module': {
                    moduleLine = true;
                    prefix();
                    s += 'module ' + tokens[++index].val;
                    continue;
                }
                case 'recipe': {
                    prefix();
                    s += 'recipe ' + tokens[++index].val;
                    continue;
                }
            }
            prefix();

            // Add comments without modifying them.
            if ((token as any).comment) {
                s += token.val;
                line();
                continue;
            }

            const property = removeWhitespace(token.val);

            let pRe = '';
            for (let index = 0; index < property.length; index++) {
                const cn1 = property[index - 1];
                const c = property[index];
                const cp1 = property[index + 1];

                switch (c) {
                    case '=': {
                        if (cn1 !== ' ') pRe += ' ';
                        pRe += '=';
                        if (cp1 !== ' ') pRe += ' ';
                        break;
                    }
                    case '/': {
                        if (cn1 !== ' ') pRe += ' ';
                        pRe += '/';
                        if (cp1 !== ' ') pRe += ' ';
                        break;
                    }
                    case ' ': {
                        if (cn1 === ',') continue;
                        if (cp1 === ':') continue;
                        pRe += ' ';
                        break;
                    }
                    case ':': {
                        pRe += ':';
                        if (cp1 !== ' ') pRe += ' ';
                        break;
                    }
                    case ';': {
                        pRe += ';';
                        if (cp1 !== ' ') pRe += ' ';
                        break;
                    }
                    case ',': {
                        while (pRe[pRe.length - 1] === ' ') {
                            // Safety-Check
                            if (pRe.length === 0) break;

                            pRe = pRe.substring(0, pRe.length - 1);
                        }
                        pRe += ',';
                        break;
                    }
                    default: {
                        pRe += c;
                        break;
                    }
                }
            }

            s += pRe + ',';
            line();
        }
    }

    return ss;
}

function removeWhitespace(s: string): string {
    return s.replace(/[\s]+/g, '');
}

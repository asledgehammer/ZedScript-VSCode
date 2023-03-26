import * as vscode from 'vscode';
import { tokenize } from './API';
import { ZedScript } from './api/ZedScript';
import { LexerToken } from './Lexer';
import { ItemScope } from './scope/Item';
import { RecipeScope } from './scope/Recipe';
import { getScope, getTokenAt, ScriptScope } from './scope/Scope';

export function activate(context: vscode.ExtensionContext) {
    vscode.languages.registerDocumentFormattingEditProvider('zed', {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            try {
                const delAll = vscode.TextEdit.delete(
                    new vscode.Range(new vscode.Position(0, 0), document.positionAt(document.getText().length))
                );
                const t = tokenize(document.getText(), { comments: false, location: true });
                // t.comments?.forEach((o) => {
                //     (o as any).comment = true;
                // });

                // const tokens = mergeTokens(t.comments as LexerToken[], t.tokens as LexerToken[]);
                const script = ZedScript.fromTokens(t.tokens as LexerToken[]);
                const insert = vscode.TextEdit.insert(new vscode.Position(0, 0), script.toScript());
                return [delAll, insert];
            } catch (err) {
                console.error(err);
            }
            return [];
        },
    });

    const hover1 = vscode.languages.registerHoverProvider('zed', {
        provideHover(document: vscode.TextDocument, position: vscode.Position, _: vscode.CancellationToken) {
            try {
                const enabled = vscode.workspace.getConfiguration('zedscript').get('hoverPopupEnabled');
                if (!enabled) {
                    return;
                }
                const tokens = tokenize(document.getText(), { comments: true, location: true }).tokens as LexerToken[];
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
                const tokens = tokenize(document.getText(), { comments: true, location: true }).tokens as LexerToken[];
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

export function mergeTokens(src: LexerToken[], dest: LexerToken[]): LexerToken[] {
    const tokens: LexerToken[] = [...src, ...dest];

    tokens.sort((a, b) => {
        return a.loc!.start.row - b.loc!.start.row;
    });

    return tokens;
}

export function format(tokens: LexerToken[]): string {
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
        if (token.value === '{') {
            indent++;
            s += ` {`;
            line();
            if (moduleLine) {
                line();
                moduleLine = false;
            }
            previousEndBracket = false;
        } else if (token.value === '}') {
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

            switch (token.value.toLowerCase().trim()) {
                case 'item': {
                    prefix();
                    s += 'item ' + tokens[++index].value;
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
                    s += 'module ' + tokens[++index].value;
                    continue;
                }
                case 'recipe': {
                    prefix();
                    s += 'recipe ' + tokens[++index].value;
                    continue;
                }
            }
            prefix();

            // Add comments without modifying them.
            if ((token as any).comment) {
                s += token.value;
                line();
                continue;
            }

            const property = removeWhitespace(token.value);

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

import * as vscode from 'vscode';
import { tokenize } from '../API';
import { LexerToken } from '../Lexer';

export const Scopes = ['root', 'module', 'recipe', 'item'];
export const BOOLEAN_VALUES = ['true', 'false'];
export type ScriptScope = 'root' | 'module' | 'recipe' | 'item';
export type ValueType = 'boolean' | 'number' | 'string';
export type Property = { type: ValueType; description?: string; values?: string[] };

export type PropertyDelimiter = ':' | '=';

export abstract class Scope {
    abstract delimiter: PropertyDelimiter;
    abstract properties: { [name: string]: Property };

    onComplete(phrase: string): vscode.CompletionItem[] {
        const { delimiter, properties } = this;

        const toReturn = [];
        phrase = phrase.toLowerCase();
        for (const key of Object.keys(properties)) {
            if (key.toLowerCase().indexOf(phrase) !== -1) {
                const def = properties[key];
                const { description: desc, values } = def;
                const item = new vscode.CompletionItem(key);

                if (def.description !== undefined) {
                    item.documentation = new vscode.MarkdownString(desc);
                }
                if (values !== undefined) {
                    item.insertText = new vscode.SnippetString(key + delimiter + ' ${1|' + values!.join(',') + '|},');
                } else {
                    item.insertText = new vscode.SnippetString(key + delimiter + ' $1,');
                }

                toReturn.push(item);
            }
        }
        return toReturn;
    }
}

export function getScope(document: vscode.TextDocument, position: vscode.Position): ScriptScope {
    const timeThen = Date.now();
    const tokens = tokenize(document.getText(), { comments: false, location: true }).tokens as LexerToken[];
    const timeNow = Date.now();

    console.log(`Time taken: ${(timeNow - timeThen) / 1000} Second(s).`);

    let i = 0;
    for (; i < tokens.length; i++) {
        const token = tokens[i] as LexerToken;
        const { loc } = token;
        const { start, stop } = loc!;
        if (start.row > position.line && start.column > position.character) {
            i--;
            break;
        }
    }

    for (; i >= 0; i--) {
        const token = tokens[i] as LexerToken;
        if (token.value === '{') {
            i--;
            break;
        }
    }

    let scope = 'root';

    if (i > -1) {
        let token = tokens[i];
        let tVal = token.value.toLowerCase();
        while (i > -1 && scope === 'root') {
            if (i < 0) break;
            token = tokens[i--];
            tVal = token.value.toLowerCase();
            // console.log(`${i}: "${token.value}"`);
            scope = Scopes.indexOf(tVal) !== -1 ? tVal : 'root';
        }
    }

    return scope as ScriptScope;
}

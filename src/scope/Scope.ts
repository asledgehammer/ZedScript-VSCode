import * as vscode from 'vscode';
import { tokenize } from '../API';
import { LexerToken } from '../Lexer';

export const Scopes = ['root', 'module', 'recipe', 'item'];
export const BOOLEAN_VALUES = ['true', 'false'];
export type ScriptScope = 'root' | 'module' | 'recipe' | 'item';
export type ValueType = 'boolean' | 'float' | 'int' | 'string';
export type Property = {
    type: ValueType;
    description?: string;
    values?: string[];
    onComplete?: (name: string | undefined) => vscode.CompletionItem;
};

export const SKILL_VALUES = [
    'Aiming',
    'Axe',
    'Blunt',
    'Cooking',
    'Doctor',
    'Electricity',
    'Farming',
    'Fishing',
    'Fitness',
    'Lightfoot',
    'LongBlade',
    'Maintenance',
    'Mechanics',
    'MetalWelding',
    'Nimble',
    'PlantScavenging',
    'Reloading',
    'SmallBlade',
    'SmallBlunt',
    'Sneak',
    'Spear',
    'Sprinting',
    'Strength',
    'Tailoring',
    'Trapping',
    'Woodwork',
];

export const SKILL_LEVEL_VALUES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export type PropertyDelimiter = ':' | '=';

export abstract class Scope {
    abstract delimiter: PropertyDelimiter;
    abstract properties: { [name: string]: Property };

    onComplete(name: string | undefined, phrase: string): vscode.CompletionItem[] {
        const { delimiter, properties } = this;

        const toReturn = [];
        phrase = phrase.toLowerCase();
        for (const key of Object.keys(properties)) {
            if (key.toLowerCase().indexOf(phrase) !== -1) {
                const def = properties[key];

                /* Custom implementations for certain properties can use this approach. */
                if (def.onComplete !== undefined) {
                    toReturn.push(def.onComplete(name));
                    continue;
                }

                const { description: desc, values } = def;
                const item = new vscode.CompletionItem(key);

                if (def.description !== undefined) {
                    item.documentation = new vscode.MarkdownString(desc);
                }
                if (values !== undefined) {
                    item.insertText = new vscode.SnippetString(key + delimiter + ' ${1|' + values!.join(',') + '|},');
                } else {
                    if (def.type === 'float') {
                        item.insertText = new vscode.SnippetString(key + delimiter + ' ${1|1.0|},');
                    } else if (def.type === 'int') {
                        item.insertText = new vscode.SnippetString(key + delimiter + ' ${1|1|},');
                    } else {
                        item.insertText = new vscode.SnippetString(key + delimiter + ' $1,');
                    }
                }

                toReturn.push(item);
            }
        }
        return toReturn;
    }
}

export function getScope(document: vscode.TextDocument, position: vscode.Position): [ScriptScope, string?] {
    const tokens = tokenize(document.getText(), { comments: false, location: true }).tokens as LexerToken[];

    let i = 0;
    for (; i < tokens.length; i++) {
        const token = tokens[i] as LexerToken;
        const { loc } = token;
        const { start } = loc!;
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
            token = tokens[--i];
            tVal = token.value.toLowerCase();
            scope = Scopes.indexOf(tVal) !== -1 ? tVal : 'root';
        }
    }

    const name = tokens[++i]?.value;
    return [scope as ScriptScope, name];
}

export function toPascalCase(str: string): string {
    return str
        .trim()
        .toLowerCase()
        .split(' ')
        .map((o) => {
            if (o.length) {
                o = o[0].toUpperCase() + o.substring(1);
            }
            return o;
        })
        .join('');
}

import * as vscode from 'vscode';
import { tokenize } from '../API';
import { LexerToken } from '../Lexer';

export const CODE = '```';

export type ScriptScope = 'root' | 'module' | 'recipe' | 'item';
export const Scopes = ['root', 'module', 'recipe', 'item'];

export type ValueType = 'boolean' | 'float' | 'int' | 'string' | 'lua';
export type Property = {
    /** The type of property. */
    type: ValueType;

    /** Markdown documentation. */
    description?: string;

    /** (Custom override completion function) */
    onComplete?: (name: string | undefined) => vscode.CompletionItem;

    /** For numeric ranges for properties with limits. */
    range?: number[];

    /** (For 'string' or 'enum' types) */
    values?: string[];

    /** (For 'lua' type only) */
    luaPrefix?: string;
};

export const BOOLEAN_VALUES = ['true', 'false'];
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

    onHover(phrase: string): string {
        const { properties } = this;
        const delimiter: string = this.delimiter;

        phrase = phrase.toLowerCase();
        if (phrase.indexOf(delimiter) !== -1) phrase = phrase.split(':')[0].trim();
        for (const key of Object.keys(properties)) {
            if (key.toLowerCase() === phrase) {
                const property = properties[key];
                const desc = property.description;
                if (desc !== undefined) return outcase(desc);
                else return '';
            }
        }
        return '';
    }

    onComplete(name: string | undefined, phrase: string): vscode.CompletionItem[] {
        const { properties } = this;
        let delimiter: string = this.delimiter;

        if (delimiter === '=') delimiter = ' =';

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

                const values = def.type === 'boolean' ? BOOLEAN_VALUES : def.values;
                let desc = def.description ? outcase(def.description) : '';
                const item = new vscode.CompletionItem(key);

                if (values !== undefined) {
                    item.insertText = new vscode.SnippetString(key + delimiter + ' ${1|' + values!.join(',') + '|},');
                } else {
                    if (def.type === 'float') {
                        item.insertText = new vscode.SnippetString(key + delimiter + ' ${1|1.0|},');
                    } else if (def.type === 'int') {
                        if (def.range !== undefined) {
                            item.insertText = new vscode.SnippetString(
                                key + delimiter + ' ${1|' + def.range.join(',') + '|},'
                            );

                            desc += `${desc !== '' ? '\n\n' : ''} Range: ${def.range[0]} -> ${def.range[1]}`;
                        } else {
                            item.insertText = new vscode.SnippetString(key + delimiter + ' ${1|1|},');
                        }
                    } else if (def.type === 'lua') {
                        if (def.luaPrefix !== undefined) {
                            item.insertText = new vscode.SnippetString(
                                key + delimiter + ' ${1|' + def.luaPrefix + '.' + toPascalCase(name!) + '|},'
                            );
                        } else {
                            item.insertText = new vscode.SnippetString(key + delimiter + ' ${1||},');
                        }
                    } else {
                        item.insertText = new vscode.SnippetString(key + delimiter + ' $1,');
                    }
                }

                if (desc !== '') {
                    item.documentation = new vscode.MarkdownString(outcase(desc));
                }

                toReturn.push(item);
            }
        }
        return toReturn;
    }
}

export function getTokenAt(
    document: vscode.TextDocument,
    position: vscode.Position,
    tokens = tokenize(document.getText(), { comments: false, location: true }).tokens as LexerToken[]
): string {
    let i = 0;
    const row = position.line + 1;
    const col = position.character + 1;
    while (tokens[i].loc!.start.row < row) i++;
    while (tokens[i].loc!.start.column < col) {
        if (tokens[i].loc!.start.row > row) {
            i--;
            break;
        }
        i++;
    }
    return tokens[i].value;
}

export function getScope(
    document: vscode.TextDocument,
    position: vscode.Position,
    tokens = tokenize(document.getText(), { comments: false, location: true }).tokens as LexerToken[]
): [ScriptScope, string?] {
    let i = 0;
    const row = position.line + 1;
    for (; i < tokens.length; i++) {
        const token = tokens[i] as LexerToken;
        const { loc } = token;
        const { start } = loc!;
        if (start.row > row) {
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

export function outcase(str: string): string {
    if (str.indexOf('\n') === -1) return str;

    const split = str.split('\n');

    // Find the smallest indention of spaces in each line with characters.
    let minIndent = 999;
    for (const line of split) {
        // Ignore empty lines.
        if (line.trim() === '') continue;

        let i = -1;
        for (let index = 0; index < split.length; index++) {
            if (line[index].indexOf(' ') === -1) {
                if (i === -1) i = 0;
                break;
            }
            if (i === -1) i = 1;
            else i++;
        }

        console.log(i);

        // Space-only-line. Ignore it.
        if (i === -1) continue;

        // Set the minimum indention if 'i' is smaller.
        if (minIndent > i) minIndent = i;
    }

    // Trim the start of the line.
    return split
        .map((o) => {
            return o.substring(minIndent);
        })
        .join('\n');
}

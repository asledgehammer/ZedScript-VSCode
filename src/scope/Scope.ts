import * as vscode from 'vscode';
import { tokenize } from '../API';
import { LexerToken } from '../Lexer';

export const CODE = '```';
export const HEAD = '###';
export const DESC = `${HEAD} Description:`;
export const EXAMPLE = `${HEAD} Example:`;
export const LUA_EXAMPLE = `${HEAD} Lua Example:`;

export type ScriptScope = 'root' | 'module' | 'recipe' | 'item';
export const Scopes = ['root', 'module', 'recipe', 'item'];

export type ValueType = 'boolean' | 'float' | 'int' | 'string' | 'enum' | 'lua';
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
    values?: string[] | { [name: string]: any };

    /** (For 'lua' type only) */
    luaPrefix?: string;

    example?: string;

    luaExample?: string;
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
        if (phrase.indexOf(delimiter) !== -1) phrase = phrase.split(this.delimiter)[0].trim();
        for (const key of Object.keys(properties)) {
            if (key.toLowerCase() === phrase) {
                const def = properties[key];

                let desc = '';
                if (def.description !== undefined) {
                    desc += `${DESC}\n${outcase(def.description)}\n`;
                }
                if (def.example !== undefined) {
                    desc += `${EXAMPLE}\n${CODE}zed\n${outcase(def.example)}\n${CODE}\n`;
                }
                if (def.luaExample !== undefined) {
                    desc += `${EXAMPLE}\n${CODE}lua\n${outcase(def.luaExample)}\n${CODE}\n`;
                }

                if (def.type === 'boolean') {
                    desc += '### Values:\n- true\n- false\n';
                } else if (def.type === 'enum' && def.values !== undefined) {
                    if (Array.isArray(def.values)) {
                        /* Build values documentation. */
                        let d = '### Values:';
                        for (const value of def.values) {
                            d += `\n- ${value}`;
                        }
                        desc += d;
                    } else {
                        const keys = Object.keys(def.values);
                        keys.sort((a, b) => a.localeCompare(b));

                        let d = '### Values:';
                        for (const nkey of keys) {
                            const value = def.values[nkey];
                            d += `\n- ${value}: ${nkey}`;
                        }
                        desc += d;
                    }
                } else if (def.type === 'int') {
                    if (def.range !== undefined) {
                        desc += `${desc !== '' ? '\n\n' : ''} Range: ${def.range[0]} -> ${def.range[1]}`;
                    }
                }

                return desc;
            }
        }
        return '';
    }

    onComplete(name: string | undefined, phrase: string): vscode.CompletionItem[] {
        const { properties } = this;
        let delimiter: string = this.delimiter;

        if (delimiter === '=') delimiter = ' =';

        const enabled = vscode.workspace.getConfiguration('zedscript').get('autoCompleteEnabled');

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

                let desc = '';
                if (def.description !== undefined) {
                    desc += `${DESC}\n${outcase(def.description)}\n`;
                }
                if (def.example !== undefined) {
                    desc += `${EXAMPLE}\n${CODE}zed\n${outcase(def.example)}\n${CODE}\n`;
                }
                if (def.luaExample !== undefined) {
                    desc += `${EXAMPLE}\n${CODE}lua\n${outcase(def.luaExample)}\n${CODE}\n`;
                }

                const item = new vscode.CompletionItem(key);
                if(!enabled) {
                    item.insertText = new vscode.SnippetString(key + delimiter + ' ${1},');
                }

                if (def.type === 'boolean') {
                    if (enabled) {
                        item.insertText = new vscode.SnippetString(
                            key + delimiter + ' ${1|' + BOOLEAN_VALUES.join(',') + '|},'
                        );
                    }
                    desc += '### Values:\n- true\n- false\n';
                } else if (def.type === 'enum' && def.values !== undefined) {
                    if (Array.isArray(def.values)) {
                        if (enabled) {
                            item.insertText = new vscode.SnippetString(
                                key + delimiter + ' ${1|' + def.values.join(',') + '|},'
                            );
                        }

                        /* Build values documentation. */
                        let d = '### Values:';
                        for (const value of def.values) {
                            d += `\n- ${value}`;
                        }
                        desc += d;
                    } else {
                        const keys = Object.keys(def.values);
                        keys.sort((a, b) => a.localeCompare(b));

                        let d = '### Values:';
                        if (enabled) {
                            let s = ' ${1|';
                            for (const nkey of keys) {
                                const value = def.values[nkey];
                                s += `${nkey} /* ${value} */,`;
                                d += `\n- ${value}: ${nkey}`;
                            }
                            s = s.substring(0, s.length - 1);
                            item.insertText = new vscode.SnippetString(key + delimiter + s + '|},');
                        } else {
                            for (const nkey of keys) {
                                const value = def.values[nkey];
                                d += `\n- ${value}: ${nkey}`;
                            }
                        }
                        desc += d;
                    }
                } else if (def.type === 'float') {
                    if (enabled) {
                        item.insertText = new vscode.SnippetString(key + delimiter + ' ${1|1.0|},');
                    }
                } else if (def.type === 'int') {
                    if (def.range !== undefined) {
                        if (enabled) {
                            item.insertText = new vscode.SnippetString(
                                key + delimiter + ' ${1|' + def.range.join(',') + '|},'
                            );
                        }
                        desc += `${desc !== '' ? '\n\n' : ''} Range: ${def.range[0]} -> ${def.range[1]}`;
                    } else {
                        if (enabled) {
                            item.insertText = new vscode.SnippetString(key + delimiter + ' ${1|1|},');
                        }
                    }
                } else if (def.type === 'lua') {
                    if (enabled) {
                        if (def.luaPrefix !== undefined) {
                            item.insertText = new vscode.SnippetString(
                                key + delimiter + ' ${1|' + def.luaPrefix + '.' + toPascalCase(name!) + '|},'
                            );
                        } else {
                            item.insertText = new vscode.SnippetString(key + delimiter + ' ${1||},');
                        }
                    }
                } else {
                    if (enabled) {
                        item.insertText = new vscode.SnippetString(key + delimiter + ' $1,');
                    }
                }
                if (desc !== '') {
                    item.documentation = new vscode.MarkdownString(desc);
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
    if (str.indexOf(' ') === -1) {
        return str[0].toUpperCase() + str.substring(1);
    }
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

    str = str.replace(/\t/g, '  ');

    let split = str.split('\n');
    let b = true;
    while (b) {
        // Check to see if any line doesn't start with a space.
        split.forEach((line) => {
            if (line !== '' && !line.startsWith(' ')) {
                b = false;
                return false;
            }
        });

        // Shift each line back by one space.
        if (b) {
            split = split.map((line) => {
                return line === '' ? '' : line.substring(1);
            });
        }
    }

    return split.join('\n');
}

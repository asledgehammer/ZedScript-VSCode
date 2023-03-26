import * as fs from 'fs';
import { tokenize } from '../API';

import { LexerOptions, LexerToken } from '../Lexer';
import { ModuleScript } from './Module';
import { SandBoxScript } from './sandbox/SandBoxOption';
import { ScriptString } from './Script';
import { getParentFolder, toArray } from './util/IO';
import { ParseBag } from './util/ParseBag';
import { ParseError } from './util/ParseError';

export type ZedScriptType = 'module' | 'sandbox';

export class ZedScript {
    private _version: ScriptString;
    private _modules: { [name: string]: ModuleScript } = {};
    private _options: { [name: string]: SandBoxScript } = {};
    readonly type: ZedScriptType;

    constructor(type: ZedScriptType) {
        this.type = type;
    }

    toScript(): string {
        let parsed = '';

        if (this.type === 'module') {
            const keys = Object.keys(this._modules);
            keys.sort((a, b) => a.localeCompare(b));
            for (const key of Object.keys(this._modules)) {
                parsed += this._modules[key].toScript('');
            }
        } else {
            const keys = Object.keys(this._options);
            keys.sort((a, b) => a.localeCompare(b));
            for (const key of Object.keys(this._options)) {
                parsed += this._options[key].toScript('');
            }
        }

        parsed = parsed
            .split('\n')
            .filter((o) => {
                return o.trim() !== '';
            })
            .join('\n');

        return parsed;
    }

    write(format: 'json' | 'txt', path: string, options: any) {
        const folder = getParentFolder(path);
        if (!fs.existsSync(folder)) fs.mkdirSync(folder);
        if (format === 'json') {
            this.writeJSON(path, options);
        } else {
            this.writeTXT(path, options);
        }
    }

    writeJSON(path: string, options: { pretty: boolean }) {
        const parsed: any = {};
        if (this.type === 'module') {
            parsed.modules = toArray(this._modules);
        } else {
            if (this._version === undefined) {
                throw new Error("ZedScript object is of type 'sandbox' and version is not defined.");
            }
            parsed.version = this._version;
            parsed.options = toArray(this._options);
        }

        fs.writeFileSync(path, options.pretty ? JSON.stringify(parsed, null, 4) : JSON.stringify(parsed));
    }

    writeTXT(path: string, options: { headerComment: boolean } = { headerComment: true }) {
        let parsed = '';

        if (this.type === 'module') {
            const keys = Object.keys(this._modules);
            keys.sort((a, b) => a.localeCompare(b));
            for (const key of Object.keys(this._modules)) {
                parsed += this._modules[key].toScript('');
            }
        } else {
            const keys = Object.keys(this._options);
            keys.sort((a, b) => a.localeCompare(b));
            for (const key of Object.keys(this._options)) {
                parsed += this._options[key].toScript('');
            }
        }

        parsed = parsed
            .split('\n')
            .filter((o) => {
                return o.trim() !== '';
            })
            .join('\n');

        if (options.headerComment === undefined || options.headerComment) {
            parsed =
                [
                    '/*',
                    ` * Generated: ${new Date().toISOString()}`,
                    ' *',
                    ' * ZedScriptParser By asledgehammer.',
                    ' *   - https://github.com/asledgehammer/ZedScriptParser',
                    ' */\n\n',
                ].join('\n') + parsed;
        }

        fs.writeFileSync(path, parsed);
    }

    static fromJSON(path: string): ZedScript {
        let type: ZedScriptType = 'module';
        if (path.toLowerCase().indexOf('sandbox-options.json') !== -1) {
            type = 'sandbox';
        }

        const zedScript = new ZedScript(type);

        // [TODO] - Implement. Jab, 3/12/2023

        return zedScript;
    }

    static fromTokens(tokens: LexerToken[]): ZedScript {
        const zedScript = new ZedScript('module');
        let version: ScriptString;
        const bag = new ParseBag(tokens);

        while (!bag.isEOF()) {
            const curr = bag.next();
            const val = curr.value;
            if (val === 'module') {
                const module = new ModuleScript(bag);
                zedScript.modules[module.__name] = module;
            } else if (val === 'version') {
                bag.next();
                version = zedScript._version = bag.next().value;
            } else if (val === 'option') {
                const option = new SandBoxScript(bag);
                zedScript.options[option.__name!] = option;
            }
        }

        if (!version && zedScript.type === 'sandbox') {
            throw new ParseError(`'version' is not defined in the same file where 'option' is used.`);
        }

        return zedScript;
    }

    static fromScript(path: string, options: LexerOptions): ZedScript {
        let type: ZedScriptType = 'module';
        if (path.toLowerCase().indexOf('sandbox-options.txt') !== -1) {
            type = 'sandbox';
        }

        const zedScript = new ZedScript(type);

        const tokens = tokenize(path, options).tokens as LexerToken[];
        // .map((o) => {
        // return typeof o === 'string' ? o : o.value;
        // });

        let version: ScriptString;
        const bag = new ParseBag(tokens);

        while (!bag.isEOF()) {
            const curr = bag.next();
            const val = curr.value;
            if (val === 'module') {
                const module = new ModuleScript(bag);
                zedScript.modules[module.__name] = module;
            } else if (val === 'version') {
                bag.next();
                version = zedScript._version = bag.next().value;
            } else if (val === 'option') {
                const option = new SandBoxScript(bag);
                zedScript.options[option.__name!] = option;
            }
        }

        if (!version && zedScript.type === 'sandbox') {
            throw new ParseError(`'version' is not defined in the same file where 'option' is used.`);
        }

        return zedScript;
    }

    get modules() {
        if (this.type === 'sandbox') {
            throw new Error("ZedScript is of 'sandbox' type and cannot use modules.");
        }
        return this._modules;
    }

    set modules(value: { [name: string]: ModuleScript }) {
        if (this.type === 'sandbox') {
            throw new Error("ZedScript is of 'sandbox' type and cannot use modules.");
        }
        this._modules = value;
    }

    get options() {
        if (this.type === 'module') {
            throw new Error("ZedScript is of 'module' type and cannot use options.");
        }
        return this._options;
    }

    set options(value: { [name: string]: SandBoxScript }) {
        if (this.type === 'module') {
            throw new Error("ZedScript is of 'module' type and cannot use options.");
        }
        this._options = value;
    }

    get version(): ScriptString {
        return this._version;
    }
}

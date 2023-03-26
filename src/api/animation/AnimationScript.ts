import { ParseBag } from '../util/ParseBag';
import { getString, Script, ScriptString, ScriptStringArray } from '../Script';
import { CopyFrame, ScriptCopyFrameArray } from './CopyFrame';
import { CopyFrames, ScriptCopyFramesArray } from './CopyFrames';

/**
 * **AnimationScript**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class AnimationScript extends Script {
    animationDirectories: ScriptStringArray;
    copyFrame: ScriptCopyFrameArray;
    copyFrames: ScriptCopyFramesArray;
    meshName: ScriptString;

    constructor(bag: ParseBag) {
        super(bag, '=', false);
        this.parse(bag);
    }

    onPropertyToken(bag: ParseBag, property: string): boolean {
        switch (property.toLowerCase()) {
            case 'copyframe':
                if (this.copyFrame == null) this.copyFrame = [];
                this.copyFrame.push(new CopyFrame(bag));
                return true;
            case 'copyframes':
                if (this.copyFrames == null) this.copyFrames = [];
                this.copyFrames.push(new CopyFrames(bag));
                return true;
        }
        return false;
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase()) {
            case 'animationdirectory':
                if (this.animationDirectories == null) {
                    this.animationDirectories = [];
                }
                this.animationDirectories.push(getString(value));
                return true;
            case 'meshname':
                this.meshName = getString(value);
                return true;
        }
        return false;
    }

    toScript(prefix= ''): string {
        let s = `${prefix}`;
        if (this.label !== '') s += `${this.label} `;
        if (this.__name !== undefined) {
            if (this.__name === '') {
                throw new Error(
                    `The name of the object is empty: ${this.label}`,
                );
            }
            s += `${this.__name} `;
        }
        s += '{\n\n';

        const maxLenKey = this.getMaxLengthKey();

        const { __operator: operator } = this;

        function processValue(key: string, value: any) {
            if (Array.isArray(value)) {
                processArray(key, value);
            } else if (typeof value === 'object') {
                if (value.toScript === undefined) {
                    throw new Error(
                        `Key '${key}': Object doesn't have 'toScript(): '${value.constructor.name}'`,
                    );
                }
                s += `${prefix}    ${
                    key + ' '.repeat(maxLenKey - key.length)
                } ${operator} ${value.toScript()},\n`;
            } else {
                s += `${prefix}    ${
                    key + ' '.repeat(maxLenKey - key.length)
                } ${operator} ${value.toString()},\n`;
            }
        }

        function processArray(key: string, array: any[]) {
            s += `${prefix}    ${
                key + ' '.repeat(maxLenKey - key.length)
            } ${operator} `;
            for (let index = 0; index < array.length; index++) {
                const value = array[index];
                processValue(`${index}`, value);
            }
        }

        const { animationDirectories, copyFrame, copyFrames } = this;

        function processDictionary(dict: { [name: string]: any }) {
            const keys = Object.keys(dict);
            keys.sort((a, b) => a.localeCompare(b));
            for (const key of keys) {
                if (key === '__name') continue;
                if (key === '__properties') continue;
                if (key === '__operator') continue;
                if (key === 'ignoreProperties') continue;

                if (key === 'animationDirectories') {
                    if (animationDirectories === undefined) continue;
                    for (const entry of animationDirectories) {
                        s += `${prefix}    animationDirectory${' '.repeat(
                            maxLenKey - 'animationDirectory'.length,
                        )} = ${entry},\n`;
                    }
                    continue;
                }

                if (key === 'copyFrame') continue;
                if (key === 'copyFrames') continue;

                const value = dict[key];
                processValue(key, value);
            }
        }

        processDictionary(this);

        if (copyFrame !== undefined) {
            for (const entry of copyFrame) {
                s += entry.toScript(`${prefix}    `) + '\n';
            }
        }

        if (copyFrames !== undefined) {
            for (const entry of copyFrames) {
                s += entry.toScript(`${prefix}    `) + '\n';
            }
        }

        if (this.__properties !== undefined) {
            s += `${prefix}\n/* Custom Properties */\n\n`;
            processDictionary(this.__properties);
        }

        const result = `${s}\n${prefix}}\n`;
        return result;
    }

    get label(): string {
        return 'animation';
    }
}

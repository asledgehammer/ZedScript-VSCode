/* eslint-disable no-case-declarations */
import { DelimiterArray, ScriptDelimiterArray } from '../util/Array';
import { getInt, getString, Script, ScriptInt } from '../Script';
import { ParseBag } from '../util/ParseBag';
import { VehicleSkill } from './VehicleSkill';

/**
 * **VehicleInstall**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehicleInstall extends Script {
    recipes: ScriptDelimiterArray<string>;
    skills: ScriptDelimiterArray<VehicleSkill>;
    time: ScriptInt;

    constructor(bag: ParseBag) {
        super(bag, '=', false, true);
        this.parse(bag);
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase().trim()) {
            case 'recipes':
                this.recipes = new DelimiterArray(';', getString(value));
                return true;
            case 'skills':
                this.skills = new DelimiterArray(';');
                const split = value.split(';');
                for (const entry of split) {
                    let skill = '';
                    let level = 1;
                    if (entry.indexOf('=') !== -1) {
                        const ssplit = entry.split('=');
                        skill = ssplit[0].trim();
                        level = getInt(ssplit[1]);
                    } else {
                        skill = entry.trim();
                    }
                    this.skills.values.push(new VehicleSkill(skill, level));
                }
                return true;
            case 'time':
                this.time = getInt(value);
                return true;
        }
        return false;
    }

    get label(): string {
        return 'install';
    }
}

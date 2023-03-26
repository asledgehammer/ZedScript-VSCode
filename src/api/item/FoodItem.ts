/* eslint-disable no-case-declarations */
import { getBoolean, getInt, getString, ScriptBoolean, ScriptInt, ScriptString } from '../Script';
import { ItemScript } from './ItemScript';
import { EvolvedRecipe } from './EvolvedRecipe';
import { ParseBag } from '../util/ParseBag';
import { DelimiterArray, ScriptDelimiterArray } from '../util/Array';

/**
 * **FoodItem**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class FoodItem extends ItemScript {
    alcoholic: ScriptBoolean;
    badCold: ScriptBoolean;
    badInMicrowave: ScriptBoolean;
    cannedFood: ScriptBoolean;
    cantBeFrozen: ScriptBoolean;
    cantEat: ScriptBoolean;
    cookingSound: ScriptString;
    dangerousUncooked: ScriptBoolean;
    daysFresh: ScriptInt;
    daysTotallyRotten: ScriptInt;
    enduranceChange: ScriptInt;
    evolvedRecipe: ScriptDelimiterArray<EvolvedRecipe>;
    fluReduction: ScriptInt;
    goodHot: ScriptBoolean;
    herbalistType: ScriptString;
    hungerChange: ScriptInt;
    isCookable: ScriptBoolean;
    minutesToBurn: ScriptInt;
    minutesToCook: ScriptInt;
    onCooked: ScriptString;
    onEat: ScriptString;
    packaged: ScriptBoolean;
    painReduction: ScriptInt;
    poisonDetectionLevel: ScriptInt;
    poisonPower: ScriptInt;
    reduceFoodSickness: ScriptInt;
    removeNegativeEffectOnCooked: ScriptBoolean;
    removeUnhappinessWhenCooked: ScriptBoolean;
    replaceOnCooked: ScriptDelimiterArray<string>;
    replaceOnRotten: ScriptString;
    spice: ScriptBoolean;
    thirstChange: ScriptInt;
    useForPoison: ScriptInt;

    constructor(bag: ParseBag) {
        super(bag, '=', 'Food');
    }

    onPropertyToken(_: ParseBag, __: string): boolean {
        return super.onPropertyToken(_, __);
    }

    onPropertyValue(property: string, value: string): boolean {
        property = property.trim();
        value = value.trim();
        switch (property.toLowerCase()) {
            case 'badcold':
                this.badCold = getBoolean(value);
                return true;
            case 'badinmicrowave':
                this.badInMicrowave = getBoolean(value);
                return true;
            case 'cannedfood':
                this.cannedFood = getBoolean(value);
                return true;
            case 'cantbefrozen':
                this.cantBeFrozen = getBoolean(value);
                return true;
            case 'canteat':
                this.cantEat = getBoolean(value);
                return true;
            case 'cookingsound':
                this.cookingSound = getString(value);
                return true;
            case 'dangerousuncooked':
                this.dangerousUncooked = getBoolean(value);
                return true;
            case 'daysfresh':
                this.daysFresh = getInt(value);
                return true;
            case 'daystotallyrotten':
                this.daysTotallyRotten = getInt(value);
                return true;
            case 'endurancechange':
                this.enduranceChange = getInt(value);
                return true;
            case 'evolvedrecipe':
                const split = getString(value)
                    ?.split(';')
                    .map((a) => {
                        return a.trim();
                    });
                if (split != null) {
                    for (const s of split) {
                        const [name, sAmount] = s.split(':').map((a) => {
                            return a.trim();
                        });
                        if (this.evolvedRecipe == null) this.evolvedRecipe = new DelimiterArray(';');
                        this.evolvedRecipe.values.push(new EvolvedRecipe(name, parseInt(sAmount)));
                    }
                }
                return true;
            case 'flureduction':
                this.fluReduction = getInt(value);
                return true;
            case 'goodhot':
                this.goodHot = getBoolean(value);
                return true;
            case 'herbalisttype':
                this.herbalistType = getString(value);
                return true;
            case 'hungerchange':
                this.hungerChange = getInt(value);
                return true;
            case 'iscookable':
                this.isCookable = getBoolean(value);
                return true;
            case 'minutestoburn':
                this.minutesToBurn = getInt(value);
                return true;
            case 'minutestocook':
                this.minutesToCook = getInt(value);
                return true;
            case 'oncooked':
                this.onCooked = getString(value);
                return true;
            case 'oneat':
                this.onEat = getString(value);
                return true;
            case 'packaged':
                this.packaged = getBoolean(value);
                return true;
            case 'painreduction':
                this.painReduction = getInt(value);
                return true;
            case 'poisondetectionlevel':
                this.poisonDetectionLevel = getInt(value);
                return true;
            case 'poisonpower':
                this.poisonPower = getInt(value);
                return true;
            case 'reducefoodsickness':
                this.reduceFoodSickness = getInt(value);
                return true;
            case 'removenegativeeffectoncooked':
                this.removeNegativeEffectOnCooked = getBoolean(value);
                return true;
            case 'removeunhappinesswhencooked':
                this.removeUnhappinessWhenCooked = getBoolean(value);
                return true;
            case 'replaceoncooked':
                this.replaceOnCooked = new DelimiterArray(';', getString(value));
                return true;
            case 'replaceonrotten':
                this.replaceOnRotten = getString(value);
                return true;
            case 'spice':
                this.spice = getBoolean(value);
                return true;
            case 'thirstchange':
                this.thirstChange = getInt(value);
                return true;
            case 'useforpoison':
                this.useForPoison = getInt(value);
                return true;
        }
        return super.onPropertyValue(property, value);
    }
}

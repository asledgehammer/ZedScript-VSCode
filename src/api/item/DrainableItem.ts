import { getBoolean, getInt, getString, ScriptBoolean, ScriptInt, ScriptString } from '../Script';
import { ItemScript } from './ItemScript';
import { ParseBag } from '../util/ParseBag';

/**
 * **DrainableItem**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class DrainableItem extends ItemScript {
    cantBeConsolided: ScriptBoolean;
    consolidateOption: ScriptString;
    fillFromDispenserSound: ScriptString;
    fillFromTapSound: ScriptString;
    hairDye: ScriptBoolean;
    mechanicsItem: ScriptBoolean;
    replaceOnDeplete: ScriptString;
    ticksPerEquipUse: ScriptInt;
    useWhileUnequipped: ScriptBoolean;
    vehicleType: ScriptInt;

    constructor(bag: ParseBag) {
        super(bag, '=', 'Drainable');
    }

    onPropertyToken(bag: ParseBag, property: string): boolean {
        return super.onPropertyToken(bag, property);
    }

    onPropertyValue(property: string, value: string): boolean {
        property = property.trim();
        value = value.trim();
        switch (property.toLowerCase()) {
            case 'cantbeconsolided':
                this.cantBeConsolided = getBoolean(value);
                return true;
            case 'consolidateoption':
                this.consolidateOption = getString(value);
                return true;
            case 'fillfromdispensersound':
                this.fillFromDispenserSound = getString(value);
                return true;
            case 'fillfromtapsound':
                this.fillFromTapSound = getString(value);
                return true;
            case 'hairdye':
                this.hairDye = getBoolean(value);
                return true;
            case 'mechanicsitem':
                this.mechanicsItem = getBoolean(value);
                return true;
            case 'replaceondeplete':
                this.replaceOnDeplete = getString(value);
                return true;
            case 'ticksperequipuse':
                this.ticksPerEquipUse = getInt(value);
                return true;
            case 'usewhileunequipped':
                this.useWhileUnequipped = getBoolean(value);
                return true;
            case 'vehicletype':
                this.vehicleType = getInt(value);
                return true;
        }
        return super.onPropertyValue(property, value);
    }
}

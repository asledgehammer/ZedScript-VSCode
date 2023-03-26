import { getBoolean, getInt, ScriptBoolean, ScriptInt } from '../Script';
import { ItemScript } from './ItemScript';
import { ParseBag } from '../util/ParseBag';

/**
 * **RadioItem**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class RadioItem extends ItemScript {
    acceptMediaType: ScriptInt;
    baseVolumeRange: ScriptInt;
    isHighTier: ScriptBoolean;
    isPortable: ScriptBoolean;
    isTelevision: ScriptBoolean;
    maxChannel: ScriptInt;
    micRange: ScriptInt;
    minChannel: ScriptInt;
    noTransmit: ScriptBoolean;
    transmitRange: ScriptInt;
    twoWay: ScriptBoolean;
    usesBattery: ScriptBoolean;

    constructor(bag: ParseBag) {
        super(bag, '=', 'Radio');
    }

    onPropertyToken(_: ParseBag, __: string): boolean {
        return super.onPropertyToken(_, __);
    }

    onPropertyValue(property: string, value: string): boolean {
        value = value.trim();
        switch (property.toLowerCase()) {
            case 'acceptmediatype':
                this.acceptMediaType = getInt(value);
                return true;
            case 'basevolumerange':
                this.baseVolumeRange = getInt(value);
                return true;
            case 'ishightier':
                this.isHighTier = getBoolean(value);
                return true;
            case 'isportable':
                this.isPortable = getBoolean(value);
                return true;
            case 'istelevision':
                this.isTelevision = getBoolean(value);
                return true;
            case 'maxchannel':
                this.maxChannel = getInt(value);
                return true;
            case 'micrange':
                this.micRange = getInt(value);
                return true;
            case 'minchannel':
                this.minChannel = getInt(value);
                return true;
            case 'notransmit':
                this.noTransmit = getBoolean(value);
                return true;
            case 'transmitrange':
                this.transmitRange = getInt(value);
                return true;
            case 'twoway':
                this.twoWay = getBoolean(value);
                return true;
            case 'usesbattery':
                this.usesBattery = getBoolean(value);
                return true;
        }
        return super.onPropertyValue(property, value);
    }
}

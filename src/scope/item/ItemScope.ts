import { Property, PropertyDelimiter, Scope } from '../Scope';
import { AlarmClock } from './AlarmClock';
import { AlarmClockClothing } from './AlarmClockClothing';
import { Clothing } from './Clothing';
import { Container } from './Container';
import { Drainable } from './Drainable';
import { Food } from './Food';
import { Key } from './Key';
import { KeyRing } from './KeyRing';
import { Literature } from './Literature';
import { Map } from './Map';
import { Moveable } from './Moveable';
import { Normal } from './Normal';
import { Radio } from './Radio';
import { Weapon } from './Weapon';
import { WeaponPart } from './WeaponPart';

export const ITEM_TYPES = [
    'AlarmClock',
    'AlarmClockClothing',
    'Clothing',
    'Container',
    'Drainable',
    'Food',
    'Key',
    'KeyRing',
    'Literature',
    'Map',
    'Moveable',
    'Normal',
    'Radio',
    'Weapon',
    'WeaponPart',
];

export type ItemType =
    | 'AlarmClock'
    | 'AlarmClockClothing'
    | 'Clothing'
    | 'Container'
    | 'Drainable'
    | 'Food'
    | 'Key'
    | 'KeyRing'
    | 'Literature'
    | 'Map'
    | 'Moveable'
    | 'Normal'
    | 'Radio'
    | 'Weapon'
    | 'WeaponPart';

export const ITEM_PROPS: { [type: string]: { [name: string]: Property } } = {
    alarmclock: new AlarmClock().properties,
    alarmclockclothing: new AlarmClockClothing().properties,
    clothing: new Clothing().properties,
    container: new Container().properties,
    drainable: new Drainable().properties,
    food: new Food().properties,
    key: new Key().properties,
    keyring: new KeyRing().properties,
    literature: new Literature().properties,
    map: new Map().properties,
    moveable: new Moveable().properties,
    normal: new Normal().properties,
    radio: new Radio().properties,
    weapon: new Weapon().properties,
    weaponpart: new WeaponPart().properties,
};

/**
 * Templates, documents, and completes types properties for items in ZedScript.
 *
 * Translated Documentation from PZWIKI:
 * https://pzwiki.net/wiki/Scripts_guide/Item_Script_Parameters
 *
 * @author Jab
 */
export class ItemScope extends Scope {
    delimiter: PropertyDelimiter = '=';
    properties: { [name: string]: Property } = {};

    override getProperties(data?: any): { [name: string]: Property } {
        if (data != null && data.type != null && ITEM_PROPS[data.type] != null) {
            return { ...ITEM_PROPS['normal'], ...ITEM_PROPS[data.type] };
        }
        return ITEM_PROPS['normal'];
    }
}

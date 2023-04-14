import { PropertyDelimiter, Scope, ScopeProperty } from '../Scope';
import { properties } from './ItemProperties';

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
    properties: { [name: string]: ScopeProperty } = {};

    override getProperties(data?: any): { [name: string]: ScopeProperty } {
        const props: { [name: string]: ScopeProperty } = {};

        const typeLower = data != null && data.type != null ? data.type.toLowerCase() : 'normal';
        for (const key of Object.keys(properties)) {
            const val = properties[key];

            // if(val.deprecated) continue;
            if (val.itemTypes.indexOf('Normal') !== -1) {
                props[key] = val;
                // console.log('Normal: ' + key);
                continue;
            }

            let found = false;
            for (const itemType of val.itemTypes) {
                if (itemType.toLowerCase() === typeLower) {
                    found = true;
                    break;
                }
            }

            if (!found) continue;

            // console.log('Found: ' + key + " " + typeLower);
            props[key] = val;
        }
        return props;
    }
}

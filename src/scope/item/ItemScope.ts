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
        return properties;
    }
}

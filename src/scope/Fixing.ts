import * as vscode from 'vscode';
import {
    BOOLEAN_VALUES,
    Property as Property,
    PropertyDelimiter,
    Scope,
    SKILL_LEVEL_VALUES,
    SKILL_VALUES,
    toPascalCase,
} from './Scope';

/**
 * Templates, documents, and completes types properties for fixings in ZedScript.
 *
 * Translated Documentation from PZWIKI:
 * https://pzwiki.net/wiki/Scripts_guide/Item_Script_Parameters
 *
 * @author Jab
 */
export class FixingScope extends Scope {
    delimiter: PropertyDelimiter = ':';
    properties: { [name: string]: Property } = {
        Alcoholic: { type: 'boolean' }
    };
}

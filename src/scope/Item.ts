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
 * Templates, documents, and completes types properties for items in ZedScript.
 *
 * Translated Documentation from PZWIKI:
 * https://pzwiki.net/wiki/Scripts_guide/Item_Script_Parameters
 *
 * @author Jab
 */
export class ItemScope extends Scope {
    delimiter: PropertyDelimiter = '=';
    properties: { [name: string]: Property } = {
        Alcoholic: { type: 'boolean' },
        BandagePower: { type: 'int' },
        BrakeForce: { type: 'int' },
        CanBandage: { type: 'boolean'},
        CanStoreWater: { type: 'boolean'},
        ChanceToSpawnDamaged: { type: 'int' },
        ColorBlue: { type: 'int', range: [0, 255]},
        ColorGreen: { type: 'int', range: [0, 255]},
        ColorRed: { type: 'int', range: [0, 255]},
        ConditionAffectsCapacity: { type: 'boolean'},
    };
}

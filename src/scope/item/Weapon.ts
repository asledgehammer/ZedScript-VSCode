import { Property } from '../Scope';
import { ItemTypeScope } from './ItemTypeScope';

export class Weapon implements ItemTypeScope {
    properties: { [name: string]: Property } = {
        AimingPerkCritModifier: {
            type: 'int',
            description: `
                Parameter for weapons. A modifier that determines how much the Aim skill affects critical hits.
            `,
            example: 'AimingPerkCritModifier = 12,',
        },
    };
}

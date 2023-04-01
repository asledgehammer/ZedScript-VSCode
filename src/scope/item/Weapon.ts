import { ScopeProperty } from '../Scope';
import { ScopeProperties } from '../ScopeProperties';

export class Weapon implements ScopeProperties {
    properties: { [name: string]: ScopeProperty } = {
        AimingPerkCritModifier: {
            type: 'int',
            description: `
                Parameter for weapons. A modifier that determines how much the Aim skill affects critical hits.
            `,
            example: 'AimingPerkCritModifier = 12,',
        },
    };
}

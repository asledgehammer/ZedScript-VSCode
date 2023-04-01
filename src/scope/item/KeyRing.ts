import { ScopeProperty } from '../Scope';
import { ScopeProperties } from '../ScopeProperties';

export class KeyRing implements ScopeProperties {
    properties: { [name: string]: ScopeProperty } = {
        Example: {
            type: 'int',
            description: `
                Example description.
            `,
            example: 'Example = 1,',
        },
    };
}

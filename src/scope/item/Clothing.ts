import { Property } from '../Scope';
import { ItemTypeScope } from './ItemTypeScope';

export class Clothing implements ItemTypeScope {
    properties: { [name: string]: Property } = {
        Example: {
            type: 'int',
            description: `
                Example description.
            `,
            example: 'Example = 1,',
        },
    };
}

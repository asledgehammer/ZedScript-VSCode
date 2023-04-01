import { Property } from '../Scope';

export interface ItemTypeScope {
    properties: { [name: string]: Property };
}

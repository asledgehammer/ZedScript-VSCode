import {
    ScopeProperty as ScopeProperty,
    PropertyDelimiter,
    Scope,
} from './Scope';

/**
 * Templates, documents, and completes types properties for animations in ZedScript.
 *
 * @author Jab
 */
export class AnimationScope extends Scope {
    delimiter: PropertyDelimiter = '=';
    properties: { [name: string]: ScopeProperty } = {
        CopyFrame: { type: 'scope', scopeName: true },
        CopyFrames: { type: 'scope', scopeName: false },
    };
}

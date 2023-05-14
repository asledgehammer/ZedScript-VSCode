import { LintPropertyRules } from './LintPropertyRules';
import { LintScopeRules } from './LintScopeRules';

export const SCOPE_RULES: { [word: string]: LintScopeRules[] } = {
    module: [{ scope: 'root', title: 'word', body: 'scope_only' }],
    imports: [{ scope: 'root.module', body: 'imports'}],

    /** ANIMATION **************************************************** */
    animation: [{ scope: 'root.module', title: 'word', body: '=' }],
    copyframe: [{ scope: 'root.module.animation', body: '=' }],
    copyframes: [{ scope: 'root.module.animation', body: '=' }],
};

export const PROP_RULES: { [word: string]: LintPropertyRules[] } = {
    frame: [
        { scope: 'root.module.animation.copyframe', type: 'int' },
        { scope: 'root.module.animation.copyframes', type: 'int' },
    ],
    source: [
        { scope: 'root.module.animation.copyframe', type: 'string' },
        { scope: 'root.module.animation.copyframes', type: 'string' },
    ],
    sourceFrame: [{ scope: 'root.module.animation.copyframe', type: 'int' }],
    sourceFrame1: [{ scope: 'root.module.animation.copyframes', type: 'int' }],
    sourceFrame2: [{ scope: 'root.module.animation.copyframes', type: 'int' }],
};

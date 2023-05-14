export type LintScopeRules = {
    scope: string;
    body: '=' | ':' | 'scope_only' | 'recipe' | 'imports';
    title?: 'word' | 'words';
};

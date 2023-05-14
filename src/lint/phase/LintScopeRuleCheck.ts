import { Token } from '../../token/Token';
import { TokenLocation } from '../../token/TokenLocation';
import { TokenCursor } from '../../token/TokenCursor';
import { LintBag } from '../LintBag';
import { LintResults } from '../LintResults';
import { SCOPE_RULES } from '../LintRules';
import { LintScopeRules } from '../LintScopeRules';
import { LintCheck } from './LintCheck';

export class LintScopeRuleCheck extends LintCheck {
    constructor() {
        super('Scope Name Check');
    }

    onTest(bag: LintBag, results: LintResults): void {
        const scope: string[] = ['root'];
        let scopeStart: TokenCursor = { row: 1, col: 1 };

        function getScope(): string {
            return scope.join('.');
        }

        function enterScope(name: string) {
            scope.push(name);
            console.log(`Entering scope: '${getScope()}'`);
        }

        function leaveScope() {
            console.log(`Leaving scope: '${getScope()}'`);
            scope.pop();
        }

        function unknownScope(name: string) {
            const start = { ...bag.peek().loc.start };
            let stop = { ...start, col: start.col + 1 };

            let indent = -1;
            while (!bag.isEOT()) {
                const token = bag.next();
                if (token.type === 'scope_open') {
                    indent++;
                } else if (token.type === 'scope_close') {
                    indent--;
                    if (indent === 0) {
                        stop = { ...token.loc.stop };
                        break;
                    }
                }
            }

            results.logs.push({
                location: { start, stop },
                type: 'warning',
                message: `Unknown scope: ${name}`,
            });
        }

        function testScopeClosure(name: string) {
            const offsetOriginal = bag.offset;
            while (!bag.isEOT()) {
                const token = bag.next();
                if (token.type === 'scope_open') {
                    bag.offset = offsetOriginal;
                    return;
                } else if (token.type === 'scope_close') {
                    results.logs.push({
                        type: 'error',
                        location: token.loc,
                        message: `[${getScope()}] :: Scope '${name}' closure before opening.`,
                    });
                    results.pass = false;
                    return;
                }
            }
        }

        function scanScopeContents() {
            let token = bag.peek();

            while (!bag.isEOT()) {
                if (token.type === 'word') {
                    const name = token.value.toLowerCase();
                    if (SCOPE_RULES[token.value.toLowerCase()] !== undefined) {
                        scopeStart = token.loc.start;
                        console.log({ scopeStart });
                        testScope(name, SCOPE_RULES[name]);
                    }

                    // Catastrophic errors cancel the test.
                    if (!results.pass) return;
                } else if (token.type === 'scope_open') {
                    // We shouldn't be here since the opening has already been scanned over. Since we are in this phase
                    // of testing, all scope openings and closures are even, so the only way we'd get this situation is
                    // if an unknown scope (or scope without a ruleset), is present.
                    //
                    // Treat this as an unknown scope and scan over it.

                    // Try to get the name of the unknown scope.
                    let name = '';
                    let nameOffset = bag.offset - 1;
                    let nextToken;
                    let scopeStart = token.loc.start;
                    while (nameOffset > -1 && (nextToken = bag.tokens[nameOffset--]).type === 'word') {
                        name = name === '' ? nextToken.value : `${nextToken.value} ${name}`;
                        scopeStart = nextToken.loc.start;
                    }
                    if (name === '') name = 'Unknown';

                    console.log(`Skipping over unknown scope: ${name}`);

                    bag.next();

                    // Skip over the scope.
                    token = bag.peek();
                    let indent = 1;
                    while (!bag.isEOT()) {
                        if (token.type === 'scope_open') {
                            indent++;
                        } else if (token.type === 'scope_close') {
                            indent--;
                            if (indent === 0) {
                                break;
                            }
                        }
                        token = bag.next();
                    }

                    results.logs.push({
                        location: { start: scopeStart, stop: { ...token.loc.stop } },
                        type: 'warning',
                        message: name !== '' ? `Unknown scope: ${name}` : 'Unknown scope.',
                    });

                    // return;
                } else if (token.type === 'scope_close') {
                    return;
                }

                token = bag.next();
            }
        }

        function testScope(name: string, rules: LintScopeRules[]): void {
            console.log(`testScope(${name})`);

            const locStart = bag.peek().loc;
            const scope = getScope();

            let ourRules: LintScopeRules | undefined;

            // First ensure that the scope is properly opened. We know that at this phase of testing,
            // All scope openings and scope closures are even. We don't need to worry about testing for
            // proper closures.
            testScopeClosure(name);

            // Catastrophic errors cancel the test.
            if (!results.pass) return;

            for (let index = 0; index < rules.length; index++) {
                const nextRules = rules[index];
                if (!nextRules.scope) {
                    throw new Error(`No scope rule defined: ${name}[${index}]`);
                } else if (nextRules.body == null) {
                    throw new Error(`No body rule defined: ${name}[${index}]`);
                }

                const ruleScope = nextRules.scope.toLowerCase();
                if (ruleScope === scope) {
                    ourRules = nextRules;
                    break;
                }
            }

            if (ourRules == null) {
                // If we don't know the scope, report this as a warning and skip over it.
                unknownScope(name);
                return;
            }

            // Check the title state of scope.
            if (ourRules.title != null) {
                const token = bag.peek(1);
                if (token.type !== 'word') {
                    results.logs.push({
                        type: 'warning',
                        location: bag.peek().loc,
                        message: `[${getScope()}]: Name is required for scope: ${name}`,
                    });
                }
            } else {
                const token = bag.peek(1);
                if (token.type === 'word') {
                    results.logs.push({
                        type: 'warning',
                        location: bag.peek().loc,
                        message: `[${getScope()}]: The scope '${name}' cannot have a name.`,
                    });
                }
            }

            // Process the body of the scope.
            bag.untilType('scope_open');
            bag.next();

            enterScope(name);
            scanScopeContents();
            leaveScope();

            return;
        }

        scanScopeContents();

        return;
    }
}

import { Token } from "../token/Token";
import { LintResults } from "./LintResults";
import { LintTest } from "./LintTest";

export function lint(tokens: Token[]): LintResults {
    return new LintTest().test(tokens);
}
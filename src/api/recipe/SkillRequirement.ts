/**
 * **SkillRequirement**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class SkillRequirement {
    skill: string;
    level: number;

    constructor(skill: string, level: number) {
        this.skill = skill;
        this.level = level;
    }

    toScript(prefix = ''): string {
        return `${prefix}${this.skill} = ${this.level}`;
    }
}

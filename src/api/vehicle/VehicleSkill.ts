/**
 * **VehicleSkill**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehicleSkill {
    skill: string;
    level: number;

    constructor(skill: string, level: number) {
        this.skill = skill;
        this.level = level;
    }

    toScript(prefix = ''): string {
        if (this.level === 1) return `${prefix}${this.skill}`;
        return `${prefix}${this.skill} = ${this.level}`;
    }
}

import { getFloat, getString } from '../Script';

export type ScriptVector2 = Vector2 | undefined;
export type ScriptVector3 = Vector3 | undefined;

export class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toScript(prefix = ''): string {
        return `${prefix}${this.x} ${this.y}`;
    }
}

export class Vector3 {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toScript(prefix = ''): string {
        return `${prefix}${this.x} ${this.y} ${this.z}`;
    }
}

export function getVector2(value: string): Vector2 {
    const [x, y] = getString(value)
        .split(' ')
        .map((o) => {
            return getFloat(o.trim());
        });
    return new Vector2(x, y);
}

export function getVector3(value: string): Vector3 {
    const [x, y, z] = getString(value)
        .split(' ')
        .map((o) => {
            return getFloat(o.trim());
        });
    return new Vector3(x, y, z);
}

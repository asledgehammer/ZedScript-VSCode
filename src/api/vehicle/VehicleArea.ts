/* eslint-disable no-case-declarations */
import { getFloat, getString, Script } from '../Script';
import { ParseBag } from '../util/ParseBag';

/**
 * *XYWH*
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class XYWH {
    x: number;
    y: number;
    w: number;
    h: number;

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    toScript(prefix = ''): string {
        return `${prefix}${this.x} ${this.y} ${this.w} ${this.h}`;
    }
}

/**
 * **VehicleArea**
 *
 * TODO: Document. -Jab, 3/5/2023
 *
 * @author Jab
 */
export class VehicleArea extends Script {
    xywh: XYWH | undefined;

    constructor(bag: ParseBag) {
        super(bag, '=', false);
        this.parse(bag);
    }

    onPropertyValue(property: string, value: string): boolean {
        switch (property.toLowerCase().trim()) {
            case 'xywh':
                const [x, y, w, h] = getString(value)
                    .split(' ')
                    .map((o) => {
                        return getFloat(o.trim());
                    });
                this.xywh = new XYWH(x, y, w, h);
                return true;
        }
        return false;
    }

    get label(): string {
        return 'area';
    }
}

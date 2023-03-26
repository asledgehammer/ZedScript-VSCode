export type ScriptDelimiterArray<E> = DelimiterArray<E> | undefined;

export class DelimiterArray<E> {
    delimiter: string;
    values: E[] = [];

    constructor(delimiter: string, raw: string | undefined = undefined) {
        this.delimiter = delimiter;
        if (raw !== undefined) {
            raw.split(delimiter).forEach((o) => {
                this.values.push(o.trim() as E);
            });
        }
    }

    toScript(prefix: string): string {
        return this.values
            .map((o) => {
                if (typeof o !== 'object') return o;
                return (o as any).toScript();
            })
            .join(`${this.delimiter === ' ' ? ' ' : `${this.delimiter} `}`);
    }
}

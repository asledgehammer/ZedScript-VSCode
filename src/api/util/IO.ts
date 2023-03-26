export function getParentFolder(path: string): string {
    const a = path.replace(/\\/g, '/').split('/');
    a.pop();
    return a.join('/');
}

export function toArray(obj: any): any | undefined {
    const keys = Object.keys(obj).sort((a, b) => a.localeCompare(b));
    if (keys.length === 0) return undefined;
    const array: any[] = [];
    for (const key of keys) {
        const value = obj[key];
        array.push(value.toJSON());
    }
    return array;
}

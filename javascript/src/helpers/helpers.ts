
export function maxPathHelper(path: string): string {
    const prefix = "Macintosh HD:";
    if (path.startsWith(prefix)) {
        path = path.substring(prefix.length);
    }
    return path;
}
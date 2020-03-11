export function camelCase(str: string): string {
  return str
    .toLowerCase()
    .replace("_", " ")
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

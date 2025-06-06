/**
 * Transforms a text string into a valid CSS Class name by replacing invalid characters with dashes
 * @param value Text string to transform
 */
export function transformCssClass(value:string) {    
  return value ? value.toString().replace(/\W+/gi, '-').toLowerCase() : "";
}
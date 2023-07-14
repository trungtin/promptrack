/**
 * Parse keys from a python-like template string
 * For example:
 * ```ts
 * parse_template('Hello {name}!') // ['name']
 * ```
 * @param str the template string
 * @returns list of keys
 */
export function parse_template_keys(str: string): string[] {
  const matches = str.matchAll(RegExp(/(?<!{){([^{}]+)}/g))

  return Array.from(matches).map((match) => {
    const [, key] = match
    return key
  })
}

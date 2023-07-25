import { Exclude, Expose, ExposeAll } from '@promptrack/storage/utils'
import { BaseModel, IBaseModel } from './base'

export interface IPrompt extends IBaseModel {
  id: string
  name: string
  prompt: string

  keys: string[]
}

@ExposeAll()
export class Prompt extends BaseModel implements IPrompt {
  id: string = ''
  prompt: string = ''
  name: string = ''

  default_values: Record<string, any> = {}
  types: Record<string, string> = {}

  @Exclude()
  _keys: string[] | null = null

  @Expose({ groups: ['api'] })
  get keys() {
    if (this._keys) return this._keys
    return parse_template_keys(this.prompt)
  }
}

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

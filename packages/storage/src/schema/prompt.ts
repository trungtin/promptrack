import { Exclude, Expose, ExposeAll } from '@promptrack/storage/utils'
import { BaseModel, IBaseModel } from './base'

interface IPromptBase extends IBaseModel {
  id: string
  prompt: string
  keys: string[]
}

class PromptBase extends BaseModel {
  id: string = ''
  prompt: string = ''

  @Exclude()
  _keys: string[] | null = null

  @Expose({ groups: ['api'] })
  get keys() {
    if (this._keys) return this._keys
    return parse_template_keys(this.prompt)
  }
}

export interface IPromptVersion extends IPromptBase {
  displayName: string
}

@ExposeAll()
export class PromptVersion extends PromptBase implements IPromptVersion {
  displayName: string = ''
}

export interface IPrompt extends IPromptBase {
  name: string
  activeVersionId: string
}

@ExposeAll()
export class Prompt extends PromptBase implements IPrompt {
  name: string = ''
  activeVersionId: string = ''

  default_values: Record<string, any> = {}
  types: Record<string, string> = {}
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

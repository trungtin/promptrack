import { Exclude, Expose, ExposeAll } from '@promptrack/storage/utils'
import { uniq } from 'lodash'
import { BaseModel, IBaseModel } from './base'

/**
 * ==== SHARED ====
 */

enum ModelName {
  GPT_35 = 'text-davinci-003',
  GPT_35_TURBO = 'gpt-3.5-turbo',
  GPT_4 = 'gpt-4',
}

/**
 * shared interface between prompt and prompt-version
 */
interface IPromptShared extends IBaseModel {
  id: string
  keys: string[]

  model: `${ModelName}`
}

/**
 * shared interface between prompt-completion and prompt-version-completion
 */
interface IPromptCompletionBase extends IPromptShared {
  prompt: string
}

interface IPromptMessage {
  role: 'user' | 'system' | 'assistant'
  content: string
}

/**
 * shared interface between prompt-chat and prompt-version-chat
 */
interface IPromptChatBase extends IPromptShared {
  messages: IPromptMessage[]
}

/**
 * base class of a prompt and prompt-version
 */
class PromptBase extends BaseModel {
  id: string = ''

  @Exclude()
  _keys?: string[] | null = null
}

/**
 * shared class between prompt-completion and prompt-version-completion
 */
class PromptCompletionBase extends PromptBase implements IPromptCompletionBase {
  prompt: string = ''
  model = ModelName.GPT_35

  @Expose({ groups: ['api'] })
  get keys() {
    if (this._keys) return this._keys
    return parse_template_keys(this.prompt)
  }
}

/**
 * shared class between prompt-chat and prompt-version-chat
 */
class PromptChatBase extends PromptBase implements IPromptChatBase {
  messages: IPromptMessage[] = []
  model = ModelName.GPT_35_TURBO

  @Expose({ groups: ['api'] })
  get keys() {
    if (this._keys) return this._keys
    const keysList = this.messages.reduce(
      (acc, message) => acc.concat(parse_template_keys(message.content)),
      [] as string[]
    )
    return uniq(keysList)
  }
}

/**
 * ==== Prompt Version ====
 */

interface IPromptVersionBase {
  displayName: string
}
export interface IPromptVersionCompletion
  extends IPromptVersionBase,
    IPromptCompletionBase {}
export interface IPromptVersionChat
  extends IPromptVersionBase,
    IPromptChatBase {}
export type IPromptVersion = IPromptVersionCompletion | IPromptVersionChat

@ExposeAll()
export class PromptVersionCompletion
  extends PromptCompletionBase
  implements IPromptVersionCompletion
{
  displayName: string = ''
}

@ExposeAll()
export class PromptVersionChat
  extends PromptChatBase
  implements IPromptVersionChat
{
  displayName: string = ''
}

/**
 * ==== Prompt ====
 */

export interface IPromptBase {
  name: string
  activeVersionId: string

  default_values: Record<string, any>
  types: Record<string, string>
}

export interface IPromptCompletion extends IPromptBase, IPromptCompletionBase {}
export interface IPromptChat extends IPromptBase, IPromptChatBase {}
export type IPrompt = IPromptCompletion | IPromptChat

type Constructor<T = {}> = new (...args: any[]) => T

function PromptBaseMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base implements IPromptBase {
    name: string = ''
    activeVersionId: string = ''

    default_values: Record<string, any> = {}
    types: Record<string, string> = {}
  }
}

export const PromptCompletion = PromptBaseMixin(PromptCompletionBase)
ExposeAll()(PromptCompletion)
export const PromptChat = PromptBaseMixin(PromptChatBase)
ExposeAll()(PromptChat)

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

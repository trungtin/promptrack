import { ExposeAll, mapToInstance } from '@/utils/class-transformer'
import { parse_template_keys } from '@/utils/prompt'
import { IStorage } from '@promptrack/storage'
import { Exclude, Expose, instanceToPlain } from 'class-transformer'

@ExposeAll()
class Prompt {
  prompt: string = ''
  name: string = ''

  @Exclude()
  _keys: string[] | null = null

  @Expose({ name: 'keys' })
  getKeys() {
    if (this._keys) return this._keys
    return parse_template_keys(this.prompt)
  }

  @Expose({ name: 'default_values' })
  getDefaultValues() {
    const keys = this.getKeys()
    return {}
  }

  @Expose({ name: 'types' })
  getTypes() {
    const keys = this.getKeys()
    return {}
  }

  /**
   * Convert the instance to a plain object
   * Must use this instead of simple JSON stringify to have all the computed properties available in the object
   * @returns
   */
  toObject() {
    return instanceToPlain(this)
  }
}

export class Promptrack {
  private storage: IStorage

  constructor({ storage }: { storage: IStorage }) {
    this.storage = storage
  }

  static _promptDto = mapToInstance(Prompt)

  usePrompts() {
    return this.storage.usePromptCollection()
  }
  async getPrompts() {
    return await this.storage
      .withConverter(Promptrack._promptDto)
      .getPromptCollection<Prompt[]>()
  }

  usePrompt({ promptName }: { promptName: string }) {
    return this.storage.usePrompt({ promptName })
  }
  async getPrompt({ promptName }: { promptName: string }) {
    return await this.storage
      .withConverter(Promptrack._promptDto)
      .getPrompt<Prompt>({ promptName })
  }
}

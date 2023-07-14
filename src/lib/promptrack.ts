import { ExposeAll, mapToInstance } from '@/utils/class-transformer'
import { parse_template_keys } from '@/utils/prompt'
import { IStorage } from '@promptrack/storage'
import { Expose, instanceToPlain } from 'class-transformer'

@ExposeAll()
class Prompt {
  prompt: string = ''

  @Expose({ name: 'keys' })
  getKeys() {
    return parse_template_keys(this.prompt)
  }

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

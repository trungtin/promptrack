import { IStorage, Prompt } from '@promptrack/storage'

export class Promptrack {
  storage: IStorage

  constructor({ storage }: { storage: IStorage }) {
    this.storage = storage
  }

  usePrompts() {
    return this.storage.usePromptCollection()
  }
  async getPrompts() {
    return await this.storage.getPromptCollection()
  }

  usePrompt({ promptName }: { promptName: string }) {
    return this.storage.usePrompt({ promptName })
  }
  async getPrompt({ promptName }: { promptName: string }) {
    return await this.storage.getPrompt({ promptName })
  }

  async updatePrompt({ prompt }: { prompt: Prompt }) {
    return await this.storage.updatePrompt({ prompt })
  }
}

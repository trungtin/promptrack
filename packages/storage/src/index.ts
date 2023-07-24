import { IPrompt, Prompt } from './schema/prompt'
import { CollectionDataHook, DocumentDataHook } from './types'

export interface IStorage {
  usePromptCollection(): CollectionDataHook<IPrompt>
  usePrompt({ promptName }: { promptName: string }): DocumentDataHook<IPrompt>

  getPromptCollection(): Promise<IPrompt[]>
  getPrompt({
    promptName,
  }: {
    promptName: string
  }): Promise<IPrompt | undefined>

  updatePrompt({ prompt }: { prompt: IPrompt }): Promise<void>
}

export type { IPrompt }
export { Prompt }

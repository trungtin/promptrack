import { IPrompt, IScript, Prompt } from './schema'
import { CollectionDataHook, DocumentDataHook, UpsertModel } from './types'

export interface IScriptStorage {
  upsertScript(q: {
    promptName: string
    script: UpsertModel<IScript>
  }): Promise<IScript>
}

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

  script: IScriptStorage
}

export { Prompt }
export type { IPrompt }

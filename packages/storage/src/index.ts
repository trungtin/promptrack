import { IPrompt, IPromptVersion, IScript, Prompt } from './schema'
import { CollectionDataHook, DocumentDataHook, UpsertModel } from './types'

export * from './types'
export * from './schema'

export interface IScriptStorage {
  upsertScript(q: {
    promptName: string
    script: UpsertModel<IScript>
  }): Promise<void>

  useScriptCollection(q: { promptName: string }): CollectionDataHook<IScript>
}

export interface IPromptStorage {
  upsertPromptVersion(q: {
    promptId: string
    version: Omit<UpsertModel<IPromptVersion>, 'keys'>
  }): Promise<void>
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
  prompt: IPromptStorage
}

export { Prompt }
export type { IPrompt }

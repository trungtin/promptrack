import {
  IPrompt,
  IPromptVersion,
  IScript,
  PromptChat,
  PromptCompletion,
} from './schema'
import {
  CollectionDataHook,
  DistributivePick,
  DocumentDataHook,
  ExclusifyUnion,
  UpsertModel,
} from './types'

export * from './schema'
export * from './types'

export interface IScriptStorage {
  upsertScript(q: {
    promptName: string
    script: UpsertModel<IScript>
  }): Promise<void>

  useScriptCollection(q: { promptName: string }): CollectionDataHook<IScript>

  runScript(
    promptName: string,
    scriptId: string,
    promptVersionIds: string[]
  ): Promise<void>
}

export interface IPromptStorage {
  usePromptCollection(): CollectionDataHook<IPrompt>
  usePrompt({ promptName }: { promptName: string }): DocumentDataHook<IPrompt>

  usePromptVersionCollection({
    promptName,
  }: {
    promptName: string
  }): CollectionDataHook<IPromptVersion>

  getPromptCollection(): Promise<IPrompt[]>
  getPrompt({
    promptName,
  }: {
    promptName: string
  }): Promise<IPrompt | undefined>

  upsertPromptVersion(
    ...params: Params.UpsertPromptVersionParams
  ): Promise<void>
}

export namespace Params {
  export type UpsertPromptVersionParams = [
    promptId: string,
    version: DistributivePick<
      ExclusifyUnion<IPromptVersion>,
      'displayName' | 'messages' | 'prompt'
    > & { id?: string }
  ]
}

export interface IStorage {
  script: IScriptStorage
  prompt: IPromptStorage
}

export { PromptChat, PromptCompletion }
export type { IPrompt }

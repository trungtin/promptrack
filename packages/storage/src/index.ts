import { ExposeAll } from '@/utils/class-transformer'
import { parse_template_keys } from '@/utils/prompt'
import {
  Exclude,
  Expose,
  instanceToPlain,
  ExcludeMetadata,
} from 'class-transformer'

type LoadingHook<T, E> = [T | undefined, boolean, E | undefined, ...any[]]

type CollectionDataHook<T> = LoadingHook<T[], Error>
type DocumentDataHook<T> = LoadingHook<T, Error>

export interface IPrompt {
  id: string
  name: string
  prompt: string

  toAPIObject(): Record<string, any>
  toStorageObject(): Record<string, any>
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
}

export class BaseModel {
  /**
   * Convert the instance to a object suitable for the public API
   * Must use this instead of simple JSON stringify to have all the computed properties available in the object
   * @returns
   */
  toAPIObject() {
    return instanceToPlain(this, { groups: ['api'] })
  }

  /**
   * Convert the instance to a plain object that can be stored in the database
   * @returns
   *
   */
  toStorageObject() {
    return instanceToPlain(this, { groups: ['storage'] })
  }
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

  @Expose({ name: 'keys', groups: ['api'] })
  getKeys() {
    if (this._keys) return this._keys
    return parse_template_keys(this.prompt)
  }
}

import { Exclude, Expose, ExposeAll } from '@promptrack/storage/utils'
import { BaseModel, IBaseModel } from './base'

export interface IScript extends IBaseModel {
  id: string
  prompt_name: string
  versions: IScriptVersion[]
}

export interface IScriptVersion extends IBaseModel {
  context: Record<string, string>
}

@ExposeAll()
export class Script extends BaseModel implements IScript {
  prompt_name: string = ''
  versions: IScriptVersion[] = []
}

@ExposeAll()
export class ScriptVersion extends BaseModel implements IScriptVersion {
  context: Record<string, string> = {}
}

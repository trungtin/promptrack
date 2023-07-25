import { Exclude, Expose, ExposeAll } from '@promptrack/storage/utils'
import { BaseModel, IBaseModel } from './base'

export interface IScript extends IBaseModel {
  id: string
  context: Record<string, string>
}

@ExposeAll()
export class Script extends BaseModel implements IScript {
  context: Record<string, string> = {}
}

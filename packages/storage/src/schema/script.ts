import { Exclude, Expose, ExposeAll } from '@promptrack/storage/utils'
import { BaseModel, IBaseModel } from './base'

export interface IScript extends IBaseModel {
  id: string
  displayName: string
  context: Record<string, string>
}

@ExposeAll()
export class Script extends BaseModel implements IScript {
  displayName: string = ''
  context: Record<string, string> = {}
}

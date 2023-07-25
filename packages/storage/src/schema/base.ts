import { Expose, instanceToPlain } from 'class-transformer'

export interface IBaseModel {
  toAPIObject(): Partial<{ [K in keyof this]: this[K] }>
  toStorageObject(): Partial<{ [K in keyof this]: this[K] }>
}

export class BaseModel {
  @Expose({ groups: ['api'] })
  id: string = ''
  /**
   * Convert the instance to a object suitable for the public API
   * Must use this instead of simple JSON stringify to have all the computed properties available in the object
   * @returns
   */
  toAPIObject() {
    return instanceToPlain(this, { groups: ['api'] }) as Partial<{
      [K in keyof this]: this[K]
    }>
  }

  /**
   * Convert the instance to a plain object that can be stored in the database
   * @returns
   *
   */
  toStorageObject() {
    const data = instanceToPlain(this, { groups: ['storage'] })
    delete data.id
    return data as Partial<{ [K in keyof this]: this[K] }>
  }
}

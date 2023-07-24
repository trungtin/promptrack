import { instanceToPlain } from "class-transformer"

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
import { IStorage } from '@promptrack/storage'

export class Promptrack {
  storage: IStorage

  constructor({ storage }: { storage: IStorage }) {
    this.storage = storage
  }
}

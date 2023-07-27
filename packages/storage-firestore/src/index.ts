import { IStorage } from '@promptrack/storage'

import { Firestore } from 'firebase/firestore'
import { PromptCollection } from './collections/prompt'
import { ScriptCollection } from './collections/script'

export class FirestoreStorage implements IStorage {
  script = new ScriptCollection(this.firestore)
  prompt = new PromptCollection(this.firestore)

  constructor(private readonly firestore: Firestore) {}
}

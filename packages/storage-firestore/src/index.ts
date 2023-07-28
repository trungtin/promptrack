import 'reflect-metadata'

import { IStorage } from '@promptrack/storage'

import { Firestore } from 'firebase/firestore'
import { container } from 'tsyringe'
import { PromptCollection } from './collections/prompt'
import { ScriptCollection } from './collections/script'

export class FirestoreStorage implements IStorage {
  script: ScriptCollection
  prompt: PromptCollection

  constructor(private readonly firestore: Firestore) {
    container.registerInstance(Firestore as any, firestore)
    this.script = container.resolve(ScriptCollection)
    this.prompt = container.resolve(PromptCollection)
  }
}

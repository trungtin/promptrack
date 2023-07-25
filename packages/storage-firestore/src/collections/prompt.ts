import { IPromptStorage } from '@promptrack/storage'
import {
  IPrompt,
  IPromptVersion,
  Prompt,
  PromptVersion,
} from '@promptrack/storage/schema'
import { UpsertModel } from '@promptrack/storage/types'
import { Firestore, collection, doc, setDoc } from 'firebase/firestore'
import { createConverter } from '../utils'

export class PromptCollection implements IPromptStorage {
  converter = createConverter<IPrompt>(Prompt)
  versionConverter = createConverter<IPromptVersion>(PromptVersion)
  constructor(private readonly firestore: Firestore) {}

  async upsertPromptVersion({
    promptId,
    version,
  }: {
    promptId: string
    version: UpsertModel<IPromptVersion>
  }) {
    const docRef = doc(
      collection(
        this.firestore,
        'prompts',
        promptId,
        'versions',
        ...(version.id ? [version.id] : [])
      ).withConverter(this.versionConverter)
    )
    await setDoc(docRef, version)

    await setDoc(
      doc(this.firestore, 'prompts', promptId),
      {
        activeVersionId: docRef.id,
        prompt: version.prompt,
      },
      { merge: true }
    )

    return
  }
}

/* eslint-disable react-hooks/rules-of-hooks*/

import { IPromptStorage, Params } from '@promptrack/storage'
import {
  IPrompt,
  IPromptCompletion,
  IPromptVersion,
  IPromptVersionCompletion,
  PromptChat,
  PromptCompletion,
  PromptVersionChat,
  PromptVersionCompletion,
} from '@promptrack/storage/schema'

import {
  DocumentData,
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore'
import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore'
import { createConverterPairs } from '../utils'

export class PromptCollection implements IPromptStorage {
  promptConverter = createConverterPairs(
    PromptCompletion,
    PromptChat,
    (v: IPrompt): v is IPromptCompletion => {
      return 'prompt' in v ? true : false
    }
  )
  versionConverter = createConverterPairs(
    PromptVersionCompletion,
    PromptVersionChat,
    (v: IPromptVersion): v is IPromptVersionCompletion => {
      return 'prompt' in v ? true : false
    }
  )

  constructor(private readonly firestore: Firestore) {}

  usePromptCollection() {
    return useCollectionData(
      collection(this.firestore, 'prompts').withConverter(this.promptConverter)
    )
  }
  usePrompt({ promptName }: { promptName: string }) {
    return useDocumentData(
      doc(this.firestore, 'prompts', promptName).withConverter(
        this.promptConverter
      )
    )
  }

  async getPromptCollection() {
    return (
      await getDocs(
        collection(this.firestore, 'prompts').withConverter(
          this.promptConverter
        )
      )
    ).docs.map((d) => d.data())
  }
  async getPrompt({ promptName }: { promptName: string }) {
    const results = await getDoc(
      doc(this.firestore, 'prompts', promptName).withConverter(
        this.promptConverter
      )
    )
    return results.data()
  }

  async upsertPromptVersion(
    ...[promptId, version]: Params.UpsertPromptVersionParams
  ) {
    if ('prompt' in version && 'messages' in version) {
      throw new Error('PromptVersion cannot have both prompt and messages')
    }
    const docRef = doc(
      collection(
        this.firestore,
        'prompts',
        promptId,
        'versions',
        ...(version.id ? [version.id] : [])
      ).withConverter<Params.UpsertPromptVersionParams[1], DocumentData>(
        this.versionConverter
      )
    )

    await setDoc(docRef, version)

    await setDoc(
      doc(this.firestore, 'prompts', promptId),
      {
        activeVersionId: docRef.id,
        ...('prompt' in version
          ? { prompt: version.prompt }
          : { messages: version.messages }),
      },
      { merge: true }
    )

    return
  }
}

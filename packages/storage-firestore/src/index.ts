/* eslint-disable react-hooks/rules-of-hooks*/

import { mapToInstance } from '@/utils/class-transformer'
import { IPrompt, IStorage, Prompt } from '@promptrack/storage'

import {
  DocumentData,
  DocumentSnapshot,
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

const mapToPrompt = mapToInstance<IPrompt, any>(Prompt)
const promptConverter = {
  fromFirestore: (v: DocumentSnapshot<DocumentData>) => {
    return mapToPrompt({ ...v.data(), id: v.id })
  },
  toFirestore: (v: IPrompt) => {
    const d: Partial<IPrompt> = { ...v.toStorageObject() }
    delete d.id
    return d as DocumentData
  },
}

export class FirestoreStorage implements IStorage {
  constructor(private readonly firestore: Firestore) {}

  usePromptCollection() {
    return useCollectionData(
      collection(this.firestore, 'prompts').withConverter(promptConverter)
    )
  }
  usePrompt({ promptName }: { promptName: string }) {
    return useDocumentData(
      doc(this.firestore, 'prompts', promptName).withConverter(promptConverter)
    )
  }

  async getPromptCollection() {
    return (
      await getDocs(
        collection(this.firestore, 'prompts').withConverter(promptConverter)
      )
    ).docs.map((d) => d.data())
  }
  async getPrompt({ promptName }: { promptName: string }) {
    const results = await getDoc(
      doc(this.firestore, 'prompts', promptName).withConverter(promptConverter)
    )
    return results.data()
  }

  async updatePrompt({ prompt }: { prompt: IPrompt }) {
    return await setDoc(
      doc(this.firestore, 'prompts', prompt.id).withConverter(promptConverter),
      prompt
    )
  }
}

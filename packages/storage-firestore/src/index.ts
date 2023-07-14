/* eslint-disable react-hooks/rules-of-hooks*/

import { IStorage } from '@promptrack/storage'

import {
  collection,
  Firestore,
  doc,
  getDoc,
  getDocs,
  QuerySnapshot,
  DocumentData,
  DocumentSnapshot,
} from 'firebase/firestore'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'

export class FirestoreStorage implements IStorage {
  converter = null

  constructor(private readonly firestore: Firestore) {}

  withConverter(
    fromFirestore: (v: any) => any = (v: any) => v,
    toFirestore: (v: any) => DocumentSnapshot = (v: any) => v
  ) {
    return Object.assign(new FirestoreStorage(this.firestore), this, {
      converter: {
        fromFirestore: (v: DocumentSnapshot) => fromFirestore(v.data()),
        toFirestore,
      },
    })
  }

  usePromptCollection() {
    return useCollection(
      collection(this.firestore, 'prompts').withConverter(this.converter)
    )
  }
  usePrompt({ promptName }: { promptName: string }) {
    return useDocument(
      doc(this.firestore, 'prompts', promptName).withConverter(this.converter)
    )
  }

  async getPromptCollection<T>() {
    return (
      await getDocs(
        collection(this.firestore, 'prompts').withConverter(this.converter)
      )
    ).docs as T
  }
  async getPrompt<T>({ promptName }: { promptName: string }) {
    const results = await getDoc(
      doc(this.firestore, 'prompts', promptName).withConverter(this.converter)
    )
    return results.data() as T
  }
}

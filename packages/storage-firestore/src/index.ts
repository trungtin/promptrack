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

  withConverter<T>(
    fromFirestore: (v: any) => any = (v: any) => v,
    toFirestore: (v: any) => DocumentSnapshot<T> = (v: any) => v
  ) {
    return Object.assign(new FirestoreStorage(this.firestore), this, {
      converter: {
        fromFirestore: (v: DocumentSnapshot<T>) => fromFirestore(v.data()),
        toFirestore,
      },
    })
  }

  usePromptCollection<T = DocumentData>() {
    return useCollection<T>(
      collection(this.firestore, 'prompts').withConverter<T>(this.converter)
    )
  }
  usePrompt<T = DocumentData>({ promptName }: { promptName: string }) {
    return useDocument<T>(
      doc(this.firestore, 'prompts', promptName).withConverter<T>(this.converter)
    )
  }

  async getPromptCollection<T>() {
    return (
      await getDocs(
        collection(this.firestore, 'prompts').withConverter(this.converter)
      )
    ).docs.map((d) => d.data()) as T
  }
  async getPrompt<T>({ promptName }: { promptName: string }) {
    const results = await getDoc(
      doc(this.firestore, 'prompts', promptName).withConverter(this.converter)
    )
    return results.data() as T
  }
}

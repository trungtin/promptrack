// TODO: make IStorage a generic interface (not depends on firebase)

import { DocumentData } from 'firebase/firestore'
import { CollectionHook, DocumentHook } from 'react-firebase-hooks/firestore'

export interface IStorage {
  withConverter(fromStorage?: (v: any) => any, toStorage?: (v: any) => any): IStorage

  usePromptCollection(): CollectionHook<DocumentData>
  usePrompt({ promptName }: { promptName: string }): DocumentHook<DocumentData>

  getPromptCollection<T>(): Promise<T>
  getPrompt<T>({ promptName }: { promptName: string }): Promise<T>
}

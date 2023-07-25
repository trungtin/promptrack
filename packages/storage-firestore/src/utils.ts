import { IBaseModel } from '@promptrack/storage/schema'
import { mapToInstance } from '@promptrack/storage/utils'
import { ClassConstructor } from 'class-transformer'
import { DocumentData, DocumentSnapshot } from 'firebase/firestore'

export const createConverter = <T extends IBaseModel>(cls: ClassConstructor<T>) => {
  const mapToPrompt = mapToInstance<T, any>(cls)
  return {
    fromFirestore: (v: DocumentSnapshot<DocumentData>) => {
      return mapToPrompt({ ...v.data(), id: v.id })
    },
    toFirestore: (v: T) => {
      const d: Partial<T> = { ...v.toStorageObject() }
      return d as DocumentData
    },
  }
}

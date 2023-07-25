import { IBaseModel } from '@promptrack/storage/schema'
import { mapToInstance } from '@promptrack/storage/utils'
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { DocumentData, DocumentSnapshot } from 'firebase/firestore'

export const createConverter = <T extends IBaseModel>(
  cls: ClassConstructor<T>
) => {
  const mapToPrompt = mapToInstance<T, any>(cls)
  return {
    fromFirestore: (v: DocumentSnapshot<DocumentData>) => {
      return mapToPrompt({ ...v.data(), id: v.id })
    },
    toFirestore: (v: T) => {
      // if v is plain object (not an instance of cls), convert it to an instance of cls first
      // this is usually comes from the user (form) input
      if (typeof v.toStorageObject !== 'function') {
        v = plainToInstance(cls, v)
      }

      const d: Partial<T> = { ...v.toStorageObject() }

      // remove undefined values
      for (const k in d) {
        if (d[k] === undefined) {
          delete d[k]
        }
      }
      return d as DocumentData
    },
  }
}

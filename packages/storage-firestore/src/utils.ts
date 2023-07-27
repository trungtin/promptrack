import { IBaseModel } from '@promptrack/storage/schema'
import { mapToInstance } from '@promptrack/storage/utils'
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { DocumentData, DocumentSnapshot } from 'firebase/firestore'

/**
 * Create a Firestore converter that convert from and to a class-transformer class
 * @param cls constructor of the class
 * @returns Firestore converter
 */
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

/**
 * Create a Firestore converter that can handle two different classes
 * @param cls1 constructor for the first class
 * @param cls2 constructor for the second class
 * @param discriminator a function that returns true if the value is an instance of cls1
 * @returns
 */
export const createConverterPairs = <
  T extends IBaseModel,
  K extends IBaseModel
>(
  cls1: ClassConstructor<T>,
  cls2: ClassConstructor<K>,
  discriminator: (v: any) => v is T
) => {
  const converter1 = createConverter<T>(cls1)
  const converter2 = createConverter<K>(cls2)
  return {
    converter1,
    converter2,
    fromFirestore: (v: DocumentSnapshot<DocumentData>) => {
      if (discriminator(v.data())) {
        return converter1.fromFirestore(v)
      }
      return converter2.fromFirestore(v)
    },
    toFirestore: (v: T | K) => {
      if (discriminator(v)) {
        return converter1.toFirestore(v)
      }
      return converter2.toFirestore(v)
    },
  }
}

import { firestore } from '@/lib/firestore'
import { Promptrack } from '@/lib/promptrack'
import { FirestoreStorage } from '@promptrack/storage-firestore'

export const promptrack = new Promptrack({
  storage: new FirestoreStorage(firestore),
})

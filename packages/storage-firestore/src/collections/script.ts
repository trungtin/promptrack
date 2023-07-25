import { IScriptStorage } from '@promptrack/storage'
import { IScript, Script } from '@promptrack/storage/schema'
import { Firestore, collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { createConverter } from '../utils'

export class ScriptCollection implements IScriptStorage {
  converter = createConverter<IScript>(Script)
  constructor(private readonly firestore: Firestore) {}

  async upsertScript({
    promptName,
    script,
  }: {
    promptName: string
    script: IScript
  }) {
    const doc_ref = doc(
      collection(
        this.firestore,
        'prompts',
        promptName,
        'scripts',
        ...(script.id ? [script.id] : [])
      ).withConverter(this.converter)
    )

    await setDoc(doc_ref, script, { merge: true })

    return (await getDoc(doc_ref)).data()!
  }
}

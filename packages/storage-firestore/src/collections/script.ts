import { IScriptStorage } from '@promptrack/storage'
import { IScript, Script } from '@promptrack/storage/schema'
import { Firestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { createConverter } from '../utils'

export class ScriptCollection implements IScriptStorage {
  converter = createConverter<IScript>(Script)
  constructor(private readonly firestore: Firestore) {}

  async upsertScriptVersion({
    promptName,
    script,
  }: {
    promptName: string
    script: IScript
  }) {
    const doc_ref = doc(
      this.firestore,
      'prompts',
      promptName,
      'scripts',
      ...(script.id ? [script.id] : [])
    ).withConverter(this.converter)
    await setDoc(doc_ref, script)

    return (await getDoc(doc_ref)).data()!
  }
}

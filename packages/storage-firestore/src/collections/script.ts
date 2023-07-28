/* eslint-disable react-hooks/rules-of-hooks */
import {
  CollectionDataHook,
  IScript,
  IScriptStorage,
  Script,
} from '@promptrack/storage'
import { Firestore, collection, doc, setDoc } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { injectable } from 'tsyringe'
import { createConverter } from '../utils'

@injectable()
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

    return await setDoc(doc_ref, script, { merge: true })
  }

  useScriptCollection(q: { promptName: string }): CollectionDataHook<IScript> {
    return useCollectionData(
      collection(
        this.firestore,
        'prompts',
        q.promptName,
        'scripts'
      ).withConverter(this.converter)
    )
  }

  async runScript(
    promptName: string,
    scriptId: string,
    promptVersionIds: string[]
  ) {
    return
  }
}

export type LoadingHook<T, E> = [
  T | undefined,
  boolean,
  E | undefined,
  ...any[]
]

export type CollectionDataHook<T> = LoadingHook<T[], Error>
export type DocumentDataHook<T> = LoadingHook<T, Error>

type ClassProperties<C> = {
  [K in keyof C as C[K] extends Function ? never : K]: C[K]
}

export type UpsertModel<T> = Omit<ClassProperties<T>, 'id'> & { id?: string }

export type LoadingHook<T, E> = [T | undefined, boolean, E | undefined, ...any[]]

export type CollectionDataHook<T> = LoadingHook<T[], Error>
export type DocumentDataHook<T> = LoadingHook<T, Error>

export type LoadingHook<T, E> = [
  T | undefined,
  boolean,
  E | undefined,
  ...any[]
]

export type CollectionDataHook<T> = LoadingHook<T[], Error>
export type DocumentDataHook<T> = LoadingHook<T, Error>

export type ClassProperties<C> = {
  [K in keyof C as C[K] extends Function ? never : K]: C[K]
}

// This version of Omit is distributive, which means it works with unions
export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never

/**
 * Get all possible keys of a union type
 */
export type AllKeys<T> = T extends unknown ? keyof T : never
type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

/**
 * Make a union type to be an exclusive union
 * @example
 * type A = { a: string } | { b: number }
 * type B = ExclusifyUnion<A> // { a: string, b?: never } | { a?: never, b: number }
 *
 * For using with DistributivePick:
 * type A = { a: string } | { b: number }
 * type B = DistributivePick<ExclusifyUnion<A>, 'a' | 'b'> // { a: string } | { b: number }
 *
 */
type _ExclusifyUnion<T, K extends PropertyKey> = T extends unknown
  ? Id<T & Partial<Record<Exclude<K, keyof T>, never>>>
  : never
export type ExclusifyUnion<T> = _ExclusifyUnion<T, AllKeys<T>>

/**
 * Pick keys from a union type
 * @example
 * type A = { id: string, a: string } | { id: string, b: number }
 * type B = DistributivePick<A, 'a' | 'b'> // { a: string, b: number } | { a: string, b: number }
 *
 */
export type DistributivePick<T, K extends AllKeys<T>> = T extends unknown
  ? Pick<T, Extract<keyof T, K>>
  : never

export type UpsertModel<T> = DistributiveOmit<ClassProperties<T>, 'id'> & {
  id?: string
}

/**
 * Make all properties of a type optional
 */
export type Optional<T, K extends AllKeys<T> = AllKeys<T>> = DistributiveOmit<
  T,
  K
> & {
  [P in K]?: T[P]
}

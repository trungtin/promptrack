import {
  ClassConstructor,
  ClassTransformOptions,
  Exclude,
  Expose,
  ExposeOptions,
  plainToInstance,
} from 'class-transformer'

/**
 * Converts plain (literal) object to class (constructor) object. Also works with arrays.
 *
 * Use class-transformer plainToInstance under the hood.
 */
export function mapToInstance<T, V>(
  cls: ClassConstructor<T>,
  options?: ClassTransformOptions
): (plain: V) => T {
  return (plain: V) =>
    plainToInstance(cls, plain, {
      exposeDefaultValues: true,
      // When we use excludeExtraneousValues, the strategy become "excludeAll",
      // so we have to manually expose all properties (by using ExposeAll, or Expose on each property)
      excludeExtraneousValues: true,
      excludePrefixes: ['_'],
      ...options,
    })
}

/**
 * Marks all properties of the class as included.
 *
 * We would like not to use this decorator,
 * but because class-transformer excludeExtraneousValues
 * also excludes properties non-exposed properties,
 * so we need to use this decorator to marks all properties as exposed.
 */
export function ExposeAll<T>(options: ExposeOptions = {}): ClassDecorator {
  return (target: any) => {
    const sample = new target()
    for (const propertyName of Object.getOwnPropertyNames(sample)) {
      if (propertyName.startsWith('_')) continue
      // TODO: check if property is already exposed or is excluded
      // TODO: do we need to use getOwnPropertyDescriptors to check for the type of the property?
      Expose(options)(target, propertyName)
    }
  }
}

export { Exclude, Expose }

/** Generically type a component
 * (Type script classes are functions that result in objects of type T upon call to new)
 * This interface helps to explicitly enforce the type */
export interface ComponentType<T> {
  new(...args: any[]): T;
}

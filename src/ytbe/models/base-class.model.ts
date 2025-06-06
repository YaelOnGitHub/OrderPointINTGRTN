/**
 * Base class that supports instantiation of an object from a supplied variant
 */
export abstract class BaseClass {
  constructor() {
  }
  public init(init?: any):void {
    if (init) Object.assign(this, init);
  }

  /**
    * Gets the constructor/factory for the specified type
    * @param c
    */
  static getFactory<T>(c: { new(...args: any): T; }): { new(...args: any): T; } {
    return c;
  }
}

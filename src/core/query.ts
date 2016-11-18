/**
 * Query base class.
 * User defined queries must extend this class.
 * 
 * @author Dragos Sebestin
 */
export class Query {

  /**
   * Class constructor.
   */
  constructor () {}

  foo () {}
}

/**
 * Query interface.
 * 
 * @author Dragos Sebestin
 */
export interface IQuery<T> {
  execute (...args: any[]) : Promise<T>;
};

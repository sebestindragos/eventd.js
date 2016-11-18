import {IAggregate, Aggregate} from '../../core/aggregate';

/**
 * Class defining a type of aggregate.
 * 
 * @author Dragos Sebestin
 */
export class AggregateType<T extends IAggregate & Aggregate> {
  
  /**
   * Class constructor.
   */
  constructor (private _type: {new (...args: any[]) : T}) {}

  getInstance (...args: any[]) : T {
    return new this._type(...args);
  }
}

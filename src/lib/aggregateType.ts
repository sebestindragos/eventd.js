import {Aggregate} from '../core/aggregate';
import {IAggregate} from '../core/IAggregate';

/**
 * Class defining a type of aggregate.
 * 
 * @author Dragos Sebestin
 */
export class AggregateType<T extends Aggregate> {
  
  /**
   * Class constructor.
   */
  constructor (private _type: {new (...args: any[]) : T}) {}

  getInstance (...args: any[]) : IAggregate {
    return new this._type(...args);
  }
}

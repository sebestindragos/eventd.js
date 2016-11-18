import {IDomainEventService} from '../lib/domainEvent/domainEventService';

/**
 * Aggregate base class.
 * 
 * @author Dragos Sebestin
 */
export class Aggregate {
  private _domainEvent: IDomainEventService;
  _id: string;
  
  /**
   * Class constructor.
   */
  constructor () {}

  /**
   * Emit e new domain event.
   */
  emitDomainEvent <T> (name: string, payload: T) {
    this._domainEvent.emit(name, this._id, payload);
  }
}

/**
 * Aggregate interface.
 * 
 * @author Dragos Sebestin
 */
export interface IAggregate {

  /**
   * Create a new aggregate.
   */
  create (...args: any[]) : Promise<void>;
}

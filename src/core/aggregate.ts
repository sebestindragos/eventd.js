import {IDomainEventService} from './IDomainEventService';

/**
 * Aggregate base class.
 * 
 * @author Dragos Sebestin
 */
export class Aggregate {
  _id: string;
  _domainEvent: IDomainEventService;

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
  
  // empty method used for compiler warning
  create (...args: any[]) {}

  // --------------------------------------------------------------------------------
  // class internal methods
}

import {IDomainEventService} from './IDomainEventService';

/**
 * Aggregate base class.
 * 
 * @author Dragos Sebestin
 */
export class Aggregate {
  private id: string;
  _domainEvent: IDomainEventService;

  /**
   * Class constructor.
   */
  constructor () {}

  /**
   * Emit e new domain event.
   */
  emitDomainEvent <T> (name: string, payload: T) {
    this._domainEvent.emit(name, this.id, payload);
  }
  
  // empty method used for compiler warning
  create (...args: any[]) {}

  // --------------------------------------------------------------------------------
  // class internal methods
  set _id (id: string) {
    this.id = id;
  }
}

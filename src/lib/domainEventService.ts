import {DomainEventType} from './domainEventType';

/**
 * Class managing domain events.
 * Acts as a collection of domain event types.
 * @see DomainEventType
 * 
 * @author Dragos Sebestin
 */
export class DomainEventService {
  private _events = new Map<string, DomainEventType<any>>();

  /**
   * Class constructor.
   */
  constructor () {}

  add <T> (name: string) {
    if (this._events.has(name)) {
      throw new Error('Domain event type [' + name + '] is already registered');
    }
    
    let eventType = new DomainEventType<T>(name);
    this._events.set(name, eventType);
  }
}

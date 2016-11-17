import {DomainEventType} from './domainEventType';
import {IDomainEventService} from '../core/IDomainEventService'
import {EventStore} from './eventStore';

/**
 * Class managing domain events.
 * Acts as a collection of domain event types.
 * @see DomainEventType
 * 
 * @author Dragos Sebestin
 */
export class DomainEventService implements IDomainEventService {
  private _events = new Map<string, DomainEventType<any>>();

  /**
   * Class constructor.
   */
  constructor (private _eventStore: EventStore) {}

  add <T> (name: string) {
    if (this._events.has(name)) {
      throw new Error(`Domain event type [' + name + '] is already registered`);
    }
    
    let eventType = new DomainEventType<T>(name);
    this._events.set(name, eventType);
  }

  // ------------------------------------------------------------------------------------------
  // IDomainEventService interface methods
  emit <T> (name: string, aggregateId: string, payload: T) : void {
    if (!this._events.has(name))
      throw new Error(`Domain event type [${name}] is not registered.`);

    let type: DomainEventType<T> = this._events.get(name);
    let event = type.getInstance(aggregateId, payload);
    this._eventStore.add(event);
  }
}

import {DomainEventType} from './domainEventType';
import {DomainEvent} from '../../core/domainEvent';
import {EventStore} from '../eventStore';

/**
 * Domain event service interface.
 * 
 * @author Dragos Sebestin
 */
export interface IDomainEventService {

  /**
   * Emit a new domain event.
   */
  emit <T> (name: string, aggregateId: string, payload: T) : void;
}

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

  add <PayloadType> (name: string) {
    if (this._events.has(name)) {
      throw new Error(`Domain event type [${name}] is already registered.`);
    }
    
    let eventType = new DomainEventType<PayloadType>(name, DomainEvent);
    this._events.set(name, eventType);
  }

  // ------------------------------------------------------------------------------------------
  // IDomainEventService interface methods
  emit <PayloadType> (name: string, aggregateId: string, payload: PayloadType) : void {
    if (!this._events.has(name))
      throw new Error(`Domain event type [${name}] is not registered.`);

    let type: DomainEventType<PayloadType> = this._events.get(name);
    let event = type.getInstance(aggregateId, payload);
    this._eventStore.add(event);
  }
}

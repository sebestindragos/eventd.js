import {DomainEvent} from './domainEvent';

/**
 * Class managing a type of domain event.
 * 
 * @author Dragos Sebestin
 */
export class DomainEventType<Type> {

  /**
   * Class constructor.
   */
  constructor (private _name: string) {}

  /**
   * Get an instance of this domain event type.
   */
  getInstance (payload: Type) : DomainEvent<Type> {
    return new DomainEvent<Type>(this._name, payload);
  }
}

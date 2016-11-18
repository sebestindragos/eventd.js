import {DomainEvent} from '../../core/domainEvent';

/**
 * Class managing a type of domain event.
 * 
 * @author Dragos Sebestin
 */
export class DomainEventType<PayloadType> {

  /**
   * Class constructor.
   */
  constructor (private _name: string, private _type: {new (...args: any[]) : DomainEvent<PayloadType>}) {}

  /**
   * Get an instance of this domain event type.
   */
  getInstance (aggregateId: string, payload: PayloadType) : DomainEvent<PayloadType> {
    return new this._type(this._name, aggregateId, payload);
  }
}

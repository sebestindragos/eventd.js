/**
 * Class managing a domain event.
 * 
 * @author Dragos Sebestin
 */
export class DomainEvent<T> {
  _timestamp: number = Date.now();
  _name: string;
  _aggregateId: string;
  _payload: T; 

  /**
   * Class constructor.
   */
  constructor (name: string, aggregateId: string, payload: T) {
    this._name = name;
    this._aggregateId = aggregateId;
    this._payload = payload;
    
    console.log('DomainEvent()', name, payload);
  }
}

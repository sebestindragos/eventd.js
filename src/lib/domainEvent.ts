/**
 * Class managing a domain event.
 * 
 * @author Dragos Sebestin
 */
export class DomainEvent<T> {

  /**
   * Class constructor.
   */
  constructor (private _name: string, private _payload: T) {}
}

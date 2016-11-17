/**
 * Aggregate interface.
 * 
 * @author Dragos Sebestin
 */
export interface IAggregate {

  create (...args: any[]) : void;

  /**
   * Emit a new domain event.
   */
  //$emitDomainEvent <T> (name: string, payload: T) : void;
}

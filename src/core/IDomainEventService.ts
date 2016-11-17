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

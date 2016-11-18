import {DomainEvent} from '../core/domainEvent';

/**
 * Repository interface.
 * Classes of this type are responsible to persisting domain events.
 * 
 * @author Dragos Sebestin
 */
export interface IRepository {

  /**
   * Save a domain event.
   */
  save <T> (event: DomainEvent<T>) : Promise<any>;

  /**
   * Fetch events for a given aggregate.
   */
  loadEvents (aggregateId: string) : Promise<DomainEvent<any>[]>;
}

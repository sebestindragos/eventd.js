import {IEvent} from './event';

/**
 * Interface of a class used for persisting and retrieving domain events.
 *
 * @author Dragos Sebestin
 */
export interface IRepository {

  /**
   * Persist a new domain event.
   */
  save (event: IEvent<any>) : Promise<void>;

  /**
   * Load domain events for a given aggregate.
   */
  load (
    aggregateId: string,
    fromVersion: number
  ) : Promise<IEvent<any>[]>;
}

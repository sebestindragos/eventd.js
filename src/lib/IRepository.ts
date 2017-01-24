import * as uuid from 'node-uuid';

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
  load (aggregateId: uuid.UUID) : Promise<IEvent<any>[]>;
}

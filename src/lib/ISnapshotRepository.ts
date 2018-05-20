import { IAggregateSnapshot } from './IAggregateSnapshot';

/**
 * Interface of a class used for persisting and
 * retrieving aggregate snapshots.
 *
 * @author Dragos Sebestin
 */
export interface IAggregateSnapshotRepository {

  /**
   * Persist a new domain event.
   */
  save (snapshot: IAggregateSnapshot) : Promise<void>;

  /**
   * Load latest snapshot for a given aggregate.
   */
  load (aggregateId: string) : Promise<IAggregateSnapshot | undefined>;
}

import { IAggregateSnapshotRepository } from '../lib/ISnapshotRepository';
import { IAggregateSnapshot } from '../lib/IAggregateSnapshot';

/**
 * Class implementing an in memory snapshot repository.
 * Used for testing purposes.
 */
export class MemorySnapshotRepository implements IAggregateSnapshotRepository {
  private _storage: IAggregateSnapshot[] = [];

  /**
   * IRepository interface methods.
   */

  async save (event: IAggregateSnapshot) : Promise<void> {
    this._storage.push(event);
  }

  load (aggregateId: string) : Promise<IAggregateSnapshot | undefined> {
    let snapshots = this._storage.filter(
      snapshot => snapshot.aggregateId === aggregateId
    ).sort((a, b) => a.version < b.version ? 1 : -1);

    return Promise.resolve(snapshots[0]);
  }
}

import {IRepository} from '../lib/IRepository';
import {IEvent} from '../lib/event';

/**
 * Class implementing an in memory repository.
 * Used for testing purposes.
 */
export class MemoryRepository implements IRepository {
  private _storage: IEvent<any>[] = [];

  /**
   * IRepository interface methods.
   */
  async save (event: IEvent<any>) : Promise<void> {
    this._storage.push(event);
  }

  load (
    aggregateId: string,
    fromVersion: number
  ) : Promise<IEvent<any>[]> {
    let events = this._storage.filter(
      event => event.aggregateId === aggregateId && event.version > fromVersion
    )
    return Promise.resolve(events);
  }
}

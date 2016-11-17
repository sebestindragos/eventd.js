import {IRepository} from '../core/IRepository';
import {DomainEvent} from './domainEvent';

/**
 * Class implementing an in memory type repository.
 * It does not persist domain events.
 * Mainly used for testing purposes.
 * 
 * @author Dragos Sebestin
 */
export class MemoryRepository implements IRepository {
  private _events: DomainEvent<any>[] = [];

  /**
   * Class constructor.
   */
  constructor () {}

  // ------------------------------------------------------------------------------------------
  // IRepository interface methods

  save <T> (event: DomainEvent<T>) : Promise<any> {
    this._events.push(event);
    return Promise.resolve();
  }

  loadEvents (aggregateId: string) : Promise<DomainEvent<any>[]> {
    let events = this._events.filter(evt => evt._aggregateId === aggregateId);
    return Promise.resolve(events);
  }
}

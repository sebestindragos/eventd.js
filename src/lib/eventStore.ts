import {IRepository} from '../core/IRepository';
import {DomainEvent} from './domainEvent';

/**
 * Class used for managing persistance of domain events.
 * Supports pluggable repository types.
 * 
 * @author Dragos Sebestin
 */
export class EventStore {

  /**
   * Class constructor.
   */
  constructor (private _repository: IRepository) {}

  /**
   * Fetch domain events for a given aggregate.
   */
  getAggregateEvents (aggregateId: string) : Promise<DomainEvent<any>[]> {
    return this._repository.loadEvents(aggregateId);
  }
}

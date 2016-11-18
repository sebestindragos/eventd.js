import {IRepository} from '../core/IRepository';
import {DomainEvent} from '../core/domainEvent';
import {Subject} from 'rxjs';

/**
 * Class used for managing persistance of domain events.
 * Supports pluggable repository types.
 * 
 * @author Dragos Sebestin
 */
export class EventStore {

  eventStream = new Subject<DomainEvent<any>>();

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

  /**
   * Add a new event to the store.
   */
  add <T> (event: DomainEvent<T>) : Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._repository.save(event)
        .then(() => {
          this.eventStream.next(event);
        })
        .catch(err => reject(err));
    });
  }
}

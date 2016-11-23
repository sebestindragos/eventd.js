import {IRepository} from '../core/IRepository';
import {DomainEvent} from '../core/domainEvent';
import {IMessageBus} from '../core/IMessageBus';

/**
 * Class used for managing persistance of domain events.
 * Supports pluggable repository types.
 * 
 * @author Dragos Sebestin
 */
export class EventStore {

  eventStream: IMessageBus;

  /**
   * Class constructor.
   */
  constructor (private _repository: IRepository, messageBus: IMessageBus) {
    this.eventStream = messageBus;
  }

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
          this.eventStream.publish(event);
        })
        .catch(err => reject(err));
    });
  }
}

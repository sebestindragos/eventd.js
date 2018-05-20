import {IRepository} from './IRepository';
import {IEventBus} from './IEventBus';
import {AggregateRoot} from './aggregateRoot';
import { IAggregateSnapshotRepository } from './ISnapshotRepository';

/**
 * Event store class as defined by the Event Sourcing pattern.
 * It can persist domain events and publish them to subscribers.
 * Also used for rehydrating an aggregate root from it's stored domain events.
 *
 * @author Dragos Sebestin
 */
export class EventStore {

  /**
   * Class constructor.
   */
  constructor (
    private _eventBus: IEventBus,
    private _repository: IRepository,
    private _snapshotRepository: IAggregateSnapshotRepository
  ) { }

  /**
   * Persist an aggregate's uncommited changes to the repository and
   * publish the events to the bus.
   */
  async save (aggregate: AggregateRoot) : Promise<void> {
    let events = aggregate.getUncommitedChanges();

    // save events to the repository
    let promises = events.map(event => this._repository.save(event));
    await Promise.all(promises);

    // save aggregate snapshot
    if (
      aggregate.eventSnapshotCount > 0 &&
      aggregate.getCurrentVersion() % aggregate.eventSnapshotCount === 0
    ) {
      await this._snapshotRepository.save({
        aggregateId: aggregate.id,
        version: aggregate.getCurrentVersion(),
        data: aggregate.snapshot()
      });
    }

    // publish events to subscribers
    promises = events.map(event => this._eventBus.publish(event));
    await Promise.all(promises);
  }

  /**
   * Rehydrate an aggregate by replaying events from the store.
   */
  async rehydrate (aggregate: AggregateRoot) : Promise<void> {
    let fromVersion = -1;
    // load latest snapshot
    let snapshot = await this._snapshotRepository.load(aggregate.id);
    if (snapshot) {
      aggregate.applySnapshot(snapshot);
      fromVersion = snapshot.version;
    }

    // load remaining events
    let events = await this._repository.load(
      aggregate.id, fromVersion
    );
    aggregate.loadFromEvents(events);
  }
}

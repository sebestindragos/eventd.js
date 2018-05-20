import {IEvent} from './event';
import { IAggregateSnapshot } from './IAggregateSnapshot';

/**
 * Aggregate root base class.
 *
 * @author Dragos Sebestin
 */
export class AggregateRoot {
  private _id: string = ''; // UUID
  private _version: number = -1;

  private _changes: IEvent<any>[] = [];

  /**
   * Class constructor.
   */
  constructor (
    id: string,
    public eventSnapshotCount: number = 0
  ) {
    this._id = id;
  }

  get id () : string {
    return this._id;
  }

  getNextVersion () : number {
    return this._version + 1;
  }

  getCurrentVersion () : number {
    return this._version;
  }

  /**
   * Retrieve and reset the list of uncommited changes.
   */
  getUncommitedChanges () : IEvent<any>[] {
    return this._changes;
  }

  loadFromEvents (events: IEvent<any>[]) : void {
    events.forEach(event => {
      /**
       * Handle concurency exceptions.
       *
       * An event is conflicting if it's version is equal to the current version
       * of the aggregate, because it means it was generated from a past version of the AR.
       * Conflicts are resolved by calling a special event handler on the AR object with the
       * name of the event in cause prepended by a '@' symbol. In that handler the AR can decide
       * what action need to be done, it can completelly ignore the conflict or it can apply
       * a new change that sets or reverts the state to a previous value. These events will
       * then be published to the queue as new events.
       */
      if (this._version === event.version) {
        let eventHandlerName = `@${event.name}`;
        let internalHandler = (this as any)[eventHandlerName];
        if ( internalHandler && (typeof internalHandler === 'function') ) {
          internalHandler.call(this, event);
        }

        // do not apply the conflicting event
        return;
      }

      this.applyChange(event, false);
    });
  }

  snapshot () : any {
    throw new Error('Aggregate snapshot method not implemented.');
  }

  applySnapshot (snapshot: IAggregateSnapshot) : void {
    this._version = snapshot.version;
  }

  /**
   * Apply a domain event on the aggregate to change it's state.
   */
  protected applyChange (event: IEvent<any>, isNew: boolean = true) : void {
    if (isNew)
      this._changes.push(event);

    // call the internal event handler of the aggregate
    let internalHandler = (this as any)[event.name];
    if ( !internalHandler || (typeof internalHandler !== 'function') )
      throw new Error(`Aggregate must have a ${event.name} handler.`);

    internalHandler.call(this, event);

    // increase aggregate version
    this._version = event.version;
  }
}


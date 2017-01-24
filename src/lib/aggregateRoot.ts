import {IEvent, Event} from './event';

/**
 * Aggregate root base class.
 *
 * @author Dragos Sebestin
 */
export class AggregateRoot {
  private _id: string = null; // UUID
  private _version: number = -1;

  private _changes: IEvent<any>[] = [];

  /**
   * Class constructor.
   */
  constructor (id: string) {
    this._id = id;
   }

   get id () : string {
     return this._id;
   }

   get version () : number {
     return this._version;
   }

  /**
   * Retrieve and reset the list of uncommited changes.
   */
  getUncommitedChanges () : IEvent<any>[] {
    return this._changes;
  }

  loadFromEvents (events: IEvent<any>[]) : void {
    events.forEach(event => this.applyChange(event, false));
  }

  /**
   * Apply a domain event on the aggregate to change it's state.
   */
  protected applyChange (event: IEvent<any>, isNew: boolean = true) : void {
    if (isNew)
      this._changes.push(event);

    // call the internal event handler of the aggregate
    let internalHandler = this[event.name];
    if ( !internalHandler || (typeof internalHandler !== 'function') )
      throw new Error(`Aggregate must have a ${event.name} handler.`);

    internalHandler.call(this, event);

    // increase aggregate version
    this._version = event.version;
  }
}


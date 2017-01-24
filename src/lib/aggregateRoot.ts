import {IEvent, Event} from './event';

/**
 * Aggregate root base class.
 *
 * @author Dragos Sebestin
 */
export class AggregateRoot {
  id: string = null; // UUID
  version: number = -1;

  private _changes: IEvent<any>[] = [];

  /**
   * Class constructor.
   */
  constructor () { }

  /**
   * Retrieve and reset the list of uncommited changes.
   */
  getUncommitedChanges () : IEvent<any>[] {
    return this._changes;
  }

  /**
   * Apply a domain event on the aggregate to change it's state.
   */
  applyChange (event: IEvent<any>, isNew: boolean = true) : void {
    if (isNew)
      this._changes.push(event);

    // call the internal event handler of the aggregate
    let internalHandler = this[event.name];
    if ( !internalHandler || (typeof internalHandler !== 'function') )
      throw new Error(`Aggregate must have a ${event.name} handler.`);

    internalHandler.call(this, event);
  }
}


import {IEvent} from './event';

/**
 * Event dispatcher interface used registering handlers to events.
 *
 * @author Dragos Sebestin
 */
export interface IEventDispatcher {

  /**
   * Publish an event to the subscribers.
   */
  register (observer: {(event: IEvent<any>) : void}) : void;
}

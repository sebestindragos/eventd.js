import {IEvent} from './event';

/**
 * Event bus interface used for publishing events to the outside world.
 *
 * @author Dragos Sebestin
 */
export interface IEventBus {

  /**
   * Publish an event to the subscribers.
   */
  publish (event: IEvent<any>) : Promise<void>;
}

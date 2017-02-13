import {IEvent} from './event';
import {IEventDispatcher} from './IEventDispatcher';

/**
 * Base event handler class.
 * Attempts to call a method on the class with the same name as the event being dispatched.
 *
 * @author Dragos Sebestin
 */
export class EventHandler {

  /**
   * Class constructor.
   */
  protected constructor (eventDispatcher: IEventDispatcher) {
    eventDispatcher.register((event: IEvent<any>) => {
      this.dispatch(event);
    });
  }

  /**
   * Dispatch the incoming event to the appropriate handler.
   */
  private dispatch (event: IEvent<any>) : void {
    let handler = this[event.name];
    if ( handler && (typeof handler === 'function') ) {
      handler.call(this, event);
    }
  }
}

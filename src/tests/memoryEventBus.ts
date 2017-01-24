import {IEventBus} from '../lib/IEventBus';
import {IEventDispatcher} from '../lib/IEventDispatcher';
import {IEvent} from '../lib/event';

/**
 * Class implementing an in memory event bus.
 *
 * @author Dragos Sebestin
 */
export class MemoryEventBus implements IEventBus, IEventDispatcher {
  private observers: {(event: IEvent<any>) : void}[] = [];

  /**
   * IEventBus interface methods.
   */

  register (observer: {(event: IEvent<any>) : void}) : void {
    this.observers.push(observer);
  }

  /**
   * IEventBus interface methods.
   */

  async publish (event: IEvent<any>) : Promise<void> {
    this.observers.forEach(observer => observer(event));
  }
}

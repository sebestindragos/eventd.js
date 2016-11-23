import {Subject, Subscription} from 'rxjs';
import {IMessageBus} from '../core/IMessageBus';
import {DomainEvent} from '../core/domainEvent';


/**
 * Class implementing an in-memory message transport.
 * 
 * @author Dragos Sebestin
 */
export class MemoryMessageBus implements IMessageBus {
  private _subscription = new Subject<DomainEvent<any>>();

  constructor () { }

  publish (event: DomainEvent<any>) : Promise<any> {
    this._subscription.next(event);
    return Promise.resolve();
  }

  subscribe (name: string, callback: {(event: DomainEvent<any>) : void}) : Subscription {
    let obs = this._subscription.asObservable();

    if (name)
      obs = obs.filter(event => event._name === name);

    return obs.subscribe(callback);
  }
}

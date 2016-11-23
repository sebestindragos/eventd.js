import {Subscription} from 'rxjs';
import {DomainEvent} from './domainEvent';

/**
 * Message bus interface. Used for pub/sub messaging.
 * 
 * @author Dragos Sebestin
 */
export interface IMessageBus {

  /**
   * Publish a new domain event to subscribers. 
   */
  publish (event: DomainEvent<any>) : Promise<any>;

  /**
   * Subscribe to domain events.
   * 
   * @param name Name of the domain event to subscribe to. 
   *             If this parameter is null or empty string, it will subscribe to all events.
   */
  subscribe (name: string, callback: {(event: DomainEvent<any>) : void}) : Subscription;
}

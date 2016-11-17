import {IDomainEventService} from './IDomainEventService';

/**
 * Aggregate interface.
 * 
 * @author Dragos Sebestin
 */
export interface IAggregate {
  /**
   * Create a new aggregate.
   */
  create (...args: any[]) : void;
}

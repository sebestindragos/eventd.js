import {IEvent} from './event';

/**
 * Projection interface.
 * Projections act as event handlers, used in the denormalizer part
 * of the application.
 *
 * @author Dragos Sebestin
 */
export interface IProjection {

  /**
   * Handle a domain event.
   */
  handle (event: IEvent<any>) : void;
}

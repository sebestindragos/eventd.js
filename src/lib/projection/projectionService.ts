import {ProjectionType} from './projectionType';
import {Projection, IProjection} from '../../core/projection';
import {EventStore} from '../eventStore';
import {DomainEvent} from '../../core/domainEvent';

/**
 * Class managing projections.
 * 
 * @author Dragos Sebestin
 */
export class ProjectionService {
  private _projections: IProjection[] = [];

  /**
   * Class constructor.
   */
  constructor (private _eventStore: EventStore) {
    _eventStore.eventStream.subscribe('', event => {
      for (let projection of this._projections) {
        if (typeof projection[event._name] === 'function') {
          projection[event._name](event);
        }
      }
    });
  }

  /**
   * Add a new projection.
   */
  add <T extends Projection> (typeClass: {new (...args: any[]) : T}) : void {
    let projection = new typeClass();
    this._projections.push(projection);
  }
}

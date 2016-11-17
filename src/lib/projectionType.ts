import {Projection} from '../core/projection';

/**
 * Class representing a type of projection.
 * 
 * @author Dragos Sebestin
 */
export class ProjectionType <T extends Projection> {

  /**
   * Class constructor.
   */
  constructor (private _type: {new (...args: any[]) : T}) {}
}

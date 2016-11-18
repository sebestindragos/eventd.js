import {ICommand, Command} from '../../core/command';

/**
 * Class managing a registered command type on the context.
 * 
 * @author Dragos Sebestin
 */
export class CommandType<T extends ICommand & Command> {

  /**
   * Class constructor.
   */
  constructor (private _constructor: {new (...args: any[]) : T}) {}

  /**
   * Get an instance of this command type.
   */
  getInstance (...args: any[]) : T {
    return new this._constructor(...args);
  }
}

import {CommandType} from './commandType';
import {Command, ICommand} from '../core/command';

/**
 * Class managing context commands.
 * 
 * @author Dragos Sebestin
 */
export class CommandService {
  private _commands = new Map<string, CommandType<any>>();

  /**
   * Class constructor.
   */
  constructor () {}

  /**
   * Add a new type of command.
   */
  add <T extends Command> (name: string, typeClass: {new (...args: any[]) : T}) : void {
    if (this._commands.has(name))
      throw new Error(`Command type [' + name + '] is already registered`);

    let type = new CommandType<T>(typeClass);
    this._commands.set(name, type);
  }

  /**
   * Create an instance of a registered command object.
   */
  create (name: string, ...args: any[]) : ICommand {
    if (!this._commands.has(name))
      throw new Error(`There is no [${name}] command registered`);

    let type = this._commands.get(name);
    return type.getInstance(...args);
  }
}

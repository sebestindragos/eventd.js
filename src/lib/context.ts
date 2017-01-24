import {EventStore} from './eventStore';
import {ICommandHandler} from './ICommandHandler';
import {ICommand} from './command';

/**
 * Bounded context interface.
 *
 * @author Dragos Sebestin
 */
export interface IContext {

  /**
   * Register a new command handler on the context.
   */
  registerCommandHandler (name: string, handler: ICommandHandler<any>) : void;

  /**
   * Execute a command on the context
   */
  command (name: string, command: ICommand<any>) : Promise<void>;
}

/**
 * Class implementing a local bounded context.
 *
 * @author Dragos Sebestin
 */
export class LocalContext implements IContext {
  private _commandHandlers: Map<string, ICommandHandler<any>> = new Map();

  /**
   * Class constructor.
   */
  constructor (private _name: string, private _eventStore: EventStore) {}

  /**
   * IContext interface methods.
   */
  registerCommandHandler (commandName: string, handler: ICommandHandler<any>) : void {
    if (this._commandHandlers.has(commandName))
      throw new Error(`${this._name} context already has a command handler for ${commandName}.`);

    this._commandHandlers.set(commandName, handler);
  }

  async command (commandName: string, command: ICommand<any>) : Promise<void> {
    if (!this._commandHandlers.has(commandName))
      throw new Error(`${this._name} context has no command handler registered for ${commandName}.`);

    let handler = this._commandHandlers.get(commandName);

    await handler.execute(command);
  }
}

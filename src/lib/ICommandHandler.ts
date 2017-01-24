import {ICommand} from './command';

/**
 * Command handler interface.
 *
 * @author Dragos Sebestin
 */
export interface ICommandHandler <CommandType> {

  /**
   * Execute the given command.
   */
  execute (cmd: ICommand<CommandType>) : Promise<void>;
}

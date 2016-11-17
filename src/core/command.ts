import {IAggregateService} from '../lib/aggregateService';

/**
 * Class representing a context command.
 * 
 * @author Dragos Sebestin
 */
export class Command {
  public $aggregate: IAggregateService;

  /**
   * Class constructor.
   */
  constructor () {}
}

/**
 * Command interface.
 * 
 * @author Dragos Sebestin
 */
export interface ICommand {
  $aggregate: IAggregateService;

  /**
   * execute this command.
   */
  execute () : Promise<any>;
}

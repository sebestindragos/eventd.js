import {IAggregateService} from '../lib/aggregate/aggregateService';

/**
 * Class representing a context command.
 * 
 * @author Dragos Sebestin
 */
export class Command {
  $aggregate: IAggregateService;

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

  /**
   * execute this command.
   */
  execute (...args: any[]) : Promise<any>;
}

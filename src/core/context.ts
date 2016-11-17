import {DomainEventService} from '../lib/domainEventService';
import {AggregateService} from '../lib/aggregateService';
import {Aggregate} from './aggregate';
import {CommandService} from '../lib/commandService';
import {Command} from './command';

/**
 * Class representing a bounded context.
 * 
 * @author Dragos Sebestin
 */
export class Context {
  private _domainEventService = new DomainEventService();
  private _aggregateService = new AggregateService();
  private _commandService = new CommandService();

  /**
   * Class contructor.
   */
  constructor () { }

  /**
   * Define a new domain event on this context.
   * 
   * @param name unique name of the event
   */
  defineDomainEvent <PayloadType> (name: string) {
    this._domainEventService.add<PayloadType>(name);
  }

  /**
   * Register a new type of aggregate on this context.
   * 
   * @param name unique name of the aggregate
   * @param typeClass
   */
  registerAggregate <T extends Aggregate> (name, typeClass: {new (...args: any[]) : T}) : void {
    this._aggregateService.add<T>(name, typeClass);
  }

  /**
   * Register a new type of command on this context.
   * 
   * @param name unique name of the command
   * @param typeClass
   */
  registerCommand <T extends Command> (name: string, typeClass: {new (...args: any[]) : T}) : void {
    this._commandService.add<T>(name, typeClass);
  }

  /**
   * Execute a registered command.
   * 
   * @param name the unique name of the command.
   */
  command (name: string, ...args: any[]) : Promise<any> {
    let cmd = this._commandService.create(name, ...args);
    cmd.$aggregate = this._aggregateService;

    return cmd.execute();
  }
}
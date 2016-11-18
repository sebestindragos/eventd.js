import {DomainEventService} from '../lib/domainEventService';
import {AggregateService} from '../lib/aggregateService';
import {Aggregate} from './aggregate';
import {CommandService} from '../lib/commandService';
import {Command} from './command';
import {EventStore} from '../lib/eventStore';
import {MemoryRepository} from '../lib/memoryRepository';
import {ProjectionService} from '../lib/projectionService';
import {Projection} from './projection';
import {QueryService} from '../lib/queryService';
import {IQuery, Query} from './query';

/**
 * Class representing a bounded context.
 * 
 * @author Dragos Sebestin
 */
export class Context {
  private _eventStore = new EventStore(new MemoryRepository());
  private _domainEventService = new DomainEventService(this._eventStore);
  private _aggregateService = new AggregateService(this._domainEventService, this._eventStore);
  private _commandService = new CommandService();
  private _projectionService = new ProjectionService(this._eventStore);
  private _queryService = new QueryService();

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

  /**
   * Register a new type of projection on this context.
   */
  registerProjection <T extends Projection> (typeClass: {new (...args: any[]) : T}) : void {
    this._projectionService.add(typeClass);
  }

  /**
   * Register a new type of query on this context.
   */
  registerQuery <PayloadType, T extends IQuery<PayloadType> & Query> (typeClass: {new (...args: any[]) : T}) : void {
    this._queryService.add(typeClass);
  }

  /**
   * Run a query.
   * 
   * @param name the name of the registered query to execute.
   */
  query <PayloadType> (name: string) : Promise<PayloadType> {
    return this._queryService.run<PayloadType>(name);
  }
}
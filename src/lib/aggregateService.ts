import {AggregateType} from './aggregateType';
import {Aggregate} from '../core/aggregate';
import {IAggregate} from '../core/IAggregate';

/**
 * Aggregate service interface.
 */
export interface IAggregateService {

  /**
   * Create a new aggregate.
   * 
   * @param name unique name of the registered aggregate
   */
  create (name: string, ...args: any[]) : Promise<IAggregate>;
}

/**
 * Class managing aggregates.
 * 
 * @author Dragos Sebestin
 */
export class AggregateService implements IAggregateService {
  private _aggregates = new Map<string, AggregateType<any>>();

  /**
   * Class constructor.
   */
  constructor () {}

  /**
   * Add a type of aggregate.
   * 
   * @param name unique name of the aggregate.
   * @param typeClass class type that will be used to initialize objects.
   */
  add <T extends Aggregate> (name, typeClass: {new (...args: any[]) : T}) : void {
    if (this._aggregates.has(name))
      throw new Error('Aggregate type [' + name +'] is already registered');

    let type = new AggregateType<T>(typeClass);
    this._aggregates.set(name, type);
  }

  // ------------------------------------------------------------------------------------------
  // IAggregateService interface methods

  create (name: string, ...args: any[]) : Promise<IAggregate> {
    if (!this._aggregates.has(name))
      throw new Error('There is no [${name} aggregate registered.');

    let type = this._aggregates.get(name);
    let aggregate = type.getInstance();
    aggregate.create(...args);
    return Promise.resolve(aggregate);
  } 
}

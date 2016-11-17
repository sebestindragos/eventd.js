import * as uuid from 'node-uuid';

import {AggregateType} from './aggregateType';
import {Aggregate} from '../core/aggregate';
import {IAggregate} from '../core/IAggregate';
import {IDomainEventService} from '../core/IDomainEventService';
import {EventStore} from './eventStore';
import {IRepository} from '../core/IRepository';
import {DomainEvent} from './domainEvent';

/**
 * Aggregate service interface.
 */
export interface IAggregateService {

  /**
   * Create a new aggregate.
   * 
   * @param name unique name of the registered aggregate
   */
  create (name: string, ...args: any[]) : Promise<string>;

  /**
   * Load an aggregate by id.
   * 
   * @param name registered aggregate name
   * @param aggregateId aggregate instance id
   */
  load (name: string, aggregateId: string) : Promise<IAggregate>;
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
  constructor (private _domainEventService: IDomainEventService, private _eventStore: EventStore) { }

  /**
   * Add a type of aggregate.
   * 
   * @param name unique name of the aggregate.
   * @param typeClass class type that will be used to initialize objects.
   */
  add <T extends Aggregate> (name, typeClass: {new (...args: any[]) : T}) : void {
    if (this._aggregates.has(name))
      throw new Error(`Aggregate type [' + name +'] is already registered`);

    let type = new AggregateType<T>(typeClass);
    this._aggregates.set(name, type);
  }

  // ------------------------------------------------------------------------------------------
  // IAggregateService interface methods

  create (name: string, ...args: any[]) : Promise<string> {
    let aggregate = this.getAggregateInstance(name, uuid.v4());

    // run methods
    aggregate.create(...args);

    return Promise.resolve(aggregate._id);
  } 

  load (name: string, aggregateId: string) : Promise<IAggregate> {
    return new Promise<IAggregate>((resolve, reject) => {
      this._eventStore.getAggregateEvents(aggregateId)
        .then(events => {
          let aggregate = this.getAggregateInstance(name, aggregateId);
          this.applyDomainEvents(events, aggregate);
          resolve(aggregate);
        })
        .catch(err => reject(err));
    });
  }
  
  // ------------------------------------------------------------------------------------------
  // class private methods
  getAggregateInstance (name: string, id: string) : Aggregate {
    if (!this._aggregates.has(name))
      throw new Error(`There is no [${name} aggregate registered.`);
    
    // create aggregate instance
    let type = this._aggregates.get(name);
    let aggregate = type.getInstance() as Aggregate;

    // configure instance
    aggregate._id = id;
    aggregate._domainEvent = this._domainEventService;

    return aggregate;
  }

  applyDomainEvents (events: DomainEvent<any>[], aggregate: Aggregate) {
    // to-do
  }
}

import * as uuid from 'node-uuid';

import {AggregateType} from './aggregateType';
import {Aggregate,IAggregate} from '../../core/aggregate';
import {IDomainEventService} from '../domainEvent/domainEventService';
import {EventStore} from '../eventStore';
import {DomainEvent} from '../../core/domainEvent';

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
  add <T extends IAggregate & Aggregate> (typeClass: {new (...args: any[]) : T}) : void {
    let name = typeClass.name;
    if (this._aggregates.has(name))
      throw new Error(`Aggregate type [' + name +'] is already registered.`);

    let type = new AggregateType<T>(typeClass);
    this._aggregates.set(name, type);
  }

  // ------------------------------------------------------------------------------------------
  // IAggregateService interface methods

  create (name: string, ...args: any[]) : Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let aggregate = this.getAggregateInstance(name, uuid.v4());

      // run methods
      aggregate.create(...args);

      resolve(aggregate._id);
    });
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
  getAggregateInstance (name: string, id: string) : Aggregate & IAggregate {
    if (!this._aggregates.has(name))
      throw new Error(`There is no [${name} aggregate registered.`);
    
    // create aggregate instance
    let type = this._aggregates.get(name);
    let aggregate = type.getInstance();

    // configure instance
    aggregate._id = id;
    aggregate._domainEvent = this._domainEventService;

    return aggregate;
  }

  applyDomainEvents (events: DomainEvent<any>[], aggregate: Aggregate) {
    // to-do
  }
}

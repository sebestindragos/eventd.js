import {IQuery, Query} from '../core/query';

/**
 * Class managing queries.
 * 
 * @author Dragos Sebestin
 */
export class QueryService {
  private _queries = new Map<string, IQuery<any>>();

  add <PayloadType, ClassType extends IQuery<PayloadType>, Query> (typeClass: {new (...args: any[]) : ClassType}) : void {
    let name = typeClass.name;
    if (this._queries.has(name))
      throw new Error(`Query type [${name}] has already been registered`);

    this._queries.set(name, new typeClass());
  }

  run <PayloadType> (name: string, ...args: any[]) : Promise<PayloadType> {
    if (!this._queries.has(name))
      throw new Error(`There is no [${name}] type query registered.`);

    let query: IQuery<PayloadType> = this._queries.get(name);
    return query.execute();
  } 
}

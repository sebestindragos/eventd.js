/**
 * Domain event interface.
 *
 * @author Dragos Sebestin
 */
export interface IEvent <Payload, IndexType = string> {
  aggregateId: IndexType,
  name: string,
  timestamp: number,
  version: number,
  payload: Payload
}

/**
 * Class representing a domain event.
 *
 * @author Dragos Sebestin
 */
export class Event <Payload, IndexType = string> implements IEvent<Payload, IndexType> {
  aggregateId: IndexType;
  name = '';
  timestamp = Date.now();
  version = -1;
  payload: Payload;

  /**
   * Class constructor.
   */
  constructor (
    aggregateId: IndexType,
    name: string,
    version: number,
    payload: Payload
  ) {
    this.aggregateId = aggregateId;
    this.name = name;
    this.version = version;
    this.payload = payload;
  }
}

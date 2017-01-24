import * as uuid from 'node-uuid';

/**
 * Domain event interface.
 *
 * @author Dragos Sebestin
 */
export interface IEvent <Payload> {
  aggregateId: uuid.UUID,
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
export class Event <Payload> implements IEvent<Payload> {
  aggregateId = null;
  name = '';
  timestamp = Date.now();
  version = -1;
  payload = null;

  /**
   * Class constructor.
   */
  constructor (
    aggregateId: uuid.UUID,
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

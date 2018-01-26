/**
 * Domain event interface.
 *
 * @author Dragos Sebestin
 */
export interface IEvent <Payload> {
  aggregateId: string,
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
  aggregateId = '';
  name = '';
  timestamp = Date.now();
  version = -1;
  payload: Payload;

  /**
   * Class constructor.
   */
  constructor (
    aggregateId: string,
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

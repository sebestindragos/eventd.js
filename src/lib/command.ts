import * as uuid from 'node-uuid';

/**
 * Command interface.
 *
 * @author Dragos Sebestin
 */
export interface ICommand <Payload> {
  aggregateId: uuid.UUID,
  timestamp: number,

  payload: Payload
}

/**
 * Base command class.
 *
 * @author Dragos Sebestin
 */
export class Command <Payload> implements ICommand<Payload> {
  aggregateId: uuid.UUID = null;
  timestamp: number = Date.now();

  payload: Payload = null;

  /**
   * Class constructor.
   */
  constructor (
    aggregateId: uuid.UUID,
    payload: Payload
  ) {
    this.aggregateId = aggregateId;
    this.payload = payload;
  }
}

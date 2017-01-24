/**
 * Command interface.
 *
 * @author Dragos Sebestin
 */
export interface ICommand <Payload> {
  aggregateId: string,
  timestamp: number,

  payload: Payload
}

/**
 * Base command class.
 *
 * @author Dragos Sebestin
 */
export class Command <Payload> implements ICommand<Payload> {
  aggregateId: string = null;
  timestamp: number = Date.now();

  payload: Payload = null;

  /**
   * Class constructor.
   */
  constructor (
    aggregateId: string,
    payload: Payload
  ) {
    this.aggregateId = aggregateId;
    this.payload = payload;
  }
}

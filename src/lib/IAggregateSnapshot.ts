/**
 * Interface representing an
 * aggregate snapshoted in a given point in time.
 */
export interface IAggregateSnapshot {
  aggregateId: string,
  version: number,
  data: any
}

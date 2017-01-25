/**
 * Domain query interface.
 *
 * @author Dragos Sebestin
 */
export interface IQuery <ReturnType> {

  /**
   * Run the query and return the results.
   */
  execute (filters: any) : Promise<ReturnType>;
}

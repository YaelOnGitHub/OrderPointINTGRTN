/**
 * Represents a current page of a result set from the server.  Includes the total number of records available on the server.
 */
export class PagedResultsSet<T>{
    /**
     * Current page of data
     */
    data?:T[];
    /**
     * Total number of records available
     */
    total:number = 0;
}
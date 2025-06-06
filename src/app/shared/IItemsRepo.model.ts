export interface IItemsRepo {
    user: string,                 // User for whom to retrieve Items</param>
    clientId: string,             // Id of the Client for which to retrieve Items</param>
    itemCategory: string,         // Category to which the items must belong. Used to retrieve Package Inserts instead of Order Items.</param>
    addressType: string,          // Address type to which items are being sent. (Optional)</param>
    repId: string,                // User for whom to retrieve items. (Optional)</param>
    territoryId: string,          // Territory for which items are being retrieved. (Used for DM Allocation feature) (Optional)</param>
    recipientId: string,          // Recipient ID to whom the items are being sent. (For filtering items based upon state license validation) (Optional)</param>
    state: string,                // State in which the recipient ID resides. (For filtering items based upon state license validation) (Optional)</param>
    itemType: string,             // Item type by which to filter Items. (Optional)</param>
    itemTag: string,              // Item tag by which to filter Items. (Optional)</param>
    status: string,               // The status (availability) by which to filter Items. (Optional). If null, all statuses are allowed.</param>
    ndc: string,                  // Item NDC number by which to filter Items. (Optional)</param>
    search: string,               // Search phrase by which to filter Items. (Optional)</param>
    skip: string,                 // Number or records to skip</param>
    take: string,                 // Number of records to take</param>
    sort: string,                 // Field sorting information.</param>
}
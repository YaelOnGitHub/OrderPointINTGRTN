export interface addressRequest {
    id?: string,
    userId?: string,
    name: string,
    address1: string,
    address2: string,
    city: string,
    state: string,
    country: string,
    zip: string,
    isPreferredAddress?: boolean,
    OrderType?: string,
} 
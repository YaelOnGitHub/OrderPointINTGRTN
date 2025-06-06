export interface CartRequest {
    orderType: any,
    shippingPriority: any,
    items: ItemRequest[],
    shipToAddressId?: string,
    shipToAddress?: any,
    recipientFirstName?: string,
    recipientLastName?: string,
    deliveryInstructions?: string,
    orderedForRepId?: any
    orderedForTerritoryId?:any,
    cid?:string,
    serviceRequestId?:string
}

// export enum OrderType {
//     SelfOrder = 1,
//     ConventionShipment = 2,
//     DropShipmentRetail = 3,
//     DropShipmentVaccine = 4,
// }
// export enum ShippingPriority {
//     Normal = 1,
//     Rush = 2,
//     Urgent = 3,
// }

export interface ItemRequest {
    id: string,
    quantity: number
}
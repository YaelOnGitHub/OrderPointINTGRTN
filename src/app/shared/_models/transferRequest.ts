import { TransferType } from 'src/app/shared/_models/transferType';

export interface TransferRequest {
    repTo?: string,
    transferType: TransferType | undefined,
    products: TransferProductRequest[],
    repFrom? : string,
    fromTerritoryId? :string,
    toTerritoryId? : string
}

export interface TransferProductRequest {
    productId: string,
    transferUnit: number
}
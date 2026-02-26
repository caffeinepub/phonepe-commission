import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Stats {
    averageCommissionRate: number;
    totalTransactionVolume: number;
    totalCommissionEarned: number;
    totalTransactions: bigint;
}
export interface FrontPhoto {
    front_id_card_image: Uint8Array;
    front_id_card_image_name: string;
}
export type Time = bigint;
export interface CommissionEntry {
    merchantName: string;
    transactionDate: Time;
    commissionEarned: number;
    transactionAmount: number;
    category: string;
    commissionRate: number;
    transactionId: string;
}
export interface backendInterface {
    addCommission(transactionId: string, transactionAmount: number, commissionRate: number, transactionDate: Time, merchantName: string, category: string): Promise<void>;
    addPhoto(id: bigint, photo: FrontPhoto): Promise<void>;
    deleteCommission(transactionId: string): Promise<void>;
    deletePhoto(id: bigint): Promise<void>;
    getAllCommissions(): Promise<Array<CommissionEntry>>;
    getAllPhotos(): Promise<Array<FrontPhoto>>;
    getPhoto(id: bigint): Promise<FrontPhoto | null>;
    getStats(): Promise<Stats>;
}

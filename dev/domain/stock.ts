import {Item} from "./item";

export class Stock {
    public stockId: number;
    public item: Item;
    public quantity: number;
    public safetyStocks: number;
    public warehouse: string;
    public storagePlace: string;

    constructor(item, quantity, safetyStocks, warehouse, storagePlace) {
        this.item = item;
        this.quantity = quantity;
        this.safetyStocks = safetyStocks;
        this.warehouse = warehouse;
        this.storagePlace = storagePlace

    }
}
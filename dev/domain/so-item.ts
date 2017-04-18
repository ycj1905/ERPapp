import {SalesOrder} from "./sales-order";
import {SalesItem} from "./sales-item";

export class SOItem {
    public salesOrder: SalesOrder;
    public salesItem: SalesItem;
    public quantity: number;
    public price: number;
    public serial: number;

    constructor(sItem, quantity, price, serial) {
        this.salesOrder = null;
        this.salesItem = sItem;
        this.quantity = quantity;
        this.price = price;
        this.serial = serial;
        
    }
}
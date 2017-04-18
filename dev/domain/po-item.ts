import {Item} from "./item";
import {PurchaseOrder} from "./purchase-order";

export class POItem {
    public purchaseOrder: PurchaseOrder;
    public item: Item;
    public quantity: number;
    public price: number;
    
    constructor(item, quantity, price) {
        this.purchaseOrder = null;
        this.item = item;
        this.quantity = quantity;
        this.price = price;
    }
}
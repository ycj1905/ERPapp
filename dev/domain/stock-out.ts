import {Employee} from "./employee";
import {Item} from "./item";
import {PurchaseOrder} from "./purchase-order";

export class StockOut {
    public stockOutId: number;
    public employee: Employee;
    public item: Item;
    public purchaseOrder: PurchaseOrder;
    public quantity: number;
    public createTime: string;
    public remark: string;


    constructor(employee:Employee, item:Item, purchaseOrder:PurchaseOrder, quantity:number, createTime, remark) {
        this.employee = employee;
        this.item = item;
        this.purchaseOrder = purchaseOrder;
        this.quantity = quantity;
        this.createTime = createTime;
        this.remark = remark;
    }
}


import {Employee} from "./employee";
import {Vendor} from "./vendor";
import {POStatus} from "./po-status";

export class PurchaseOrder {
    public poId: number;
    public vendor: Vendor;
    public employee: Employee;
    public tax: number;
    public amount: number;
    public createTime: string;
    public stockWhether: boolean;
    public poStatus: POStatus;

    constructor() {
        this.vendor = null;
        this.employee = null;
        this.tax = null;
        this.amount = null;
        this.stockWhether = null;
        this.poStatus = null;
    }
}


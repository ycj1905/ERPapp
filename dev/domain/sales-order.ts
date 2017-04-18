import {Employee} from "./employee";
import {Distributor} from "./distributor";
import {SOStatus} from "./so-status";

export class SalesOrder {
    public soId: number;
    public distributor: Distributor;
    public employee: Employee;
    public tax: number;
    public amount: number;
    public createTime: string;
    public soStatus: SOStatus;


    constructor() {
        this.distributor = null;
        this.employee = null;
        this.tax = null;
        this.amount = null;
        this.soStatus = null;
    }
}


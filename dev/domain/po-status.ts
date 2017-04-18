export class POStatus {
    public updateTime: string;
    public created: boolean;
    public approved: boolean;
    public executed: boolean;
    public goodReceipt: boolean;
    public stockIn: boolean;
    public payment: boolean;
    public invoiceReceipt: boolean;
    public completed: boolean;
    public enabled: boolean;
    
    constructor() {
        this.created = true;
        this.approved = false;
        this.executed = false;
        this.goodReceipt = false;
        this.stockIn = false;
        this.payment = false;
        this.invoiceReceipt = false;
        this.completed = false;
    }
}
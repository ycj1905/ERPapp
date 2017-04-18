export class SOStatus {

    public updateTime: string;
    public created: boolean;
    public approved: boolean;
    public executed: boolean;
    public shipments: boolean;
    public payment: boolean;
    public invoice: boolean;
    public completed: boolean;
    public enabled: boolean;

    constructor() {
        this.created = true;
        this.approved = false;
        this.executed = false;
        this.shipments = false;
        this.payment = false;
        this.invoice = false;
        this.completed = false;
    }
}
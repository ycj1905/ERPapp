import {Component, Output, EventEmitter} from "angular2/core";
import {Employee} from "../../domain/employee";
import {HTTPPurchaseService} from "../../services/http-service/http-purchase.service";
import {Distributor} from "../../domain/distributor";
import {SOStatus} from "../../domain/so-status";
import {SOItem} from "../../domain/so-item";
import {HTTPSalesService} from "../../services/http-service/http-sales.service";
import {SOBom} from "./so-bom.component";
@Component({
    selector: 'so-detail',
    template: `

        <header>
            <h2>銷貨單基本資料</h2>
            <paper-icon-button icon="close" dialog-dismiss></paper-icon-button>
        </header>
        
        <div class="flex-vertical">
            <div class="detail-header">
                <ul>
                    <li>建單時間: {{selectedOrder.createTime}}</li>
                    <li class="vendor-li" (click)="distributorDialog.open();">供應商: {{distributor.dtName}}</li>
                    <li>負責員工: {{employee.firstName}}</li>
                </ul>
                <ul >
                    <li>稅: {{selectedOrder.tax}}</li>
                    <li>總價: {{selectedOrder.amount}}</li>
                </ul>
            </div>
            <div class="status-layout">
                    <div style="display: inline-block">
                        <paper-radio-button name="createdStatus" 
                        [checked]="createdChecked" disabled >建單</paper-radio-button>
                        <paper-radio-button name="approvedStatus" 
                        [checked]="approvedChecked" disabled>核准</paper-radio-button>
                        <paper-radio-button name="executedStatus" 
                        [checked]="executedChecked" disabled>執行</paper-radio-button>
                    </div>
                    <div style="display: inline-block">
                        <paper-radio-button name="goodReceiptStatus" 
                        [checked]="goodReceiptChecked" disabled>收貨</paper-radio-button>
                        <paper-radio-button name="paymentStatus" 
                        [checked]="paymentChecked" disabled>付款</paper-radio-button>
                        <paper-radio-button name="invoiceReceiptStatus" 
                        [checked]="invoiceReceiptChecked" disabled>發票</paper-radio-button>
                    </div>
                    <div style="display: inline-block">
                        <paper-radio-button name="completedStatus"
                                            [checked]="completedChecked" disabled>完成</paper-radio-button>
                        <paper-button raised (click)="statusDialog.open();">編輯狀態</paper-button>
                    </div>
            </div>
            <div class="flexchild-vertical">
                <vaadin-grid #grid  visible-rows="5" [items]="soItems" >
                    <table>
                        <colgroup>
                            <col name="salesItem.sItemName">
                            <col name="price">
                            <col name="quantity">
                            <col name="salesItem.sItemVendorNum">
                            <col name="serial">
                        </colgroup>
                        <thead>
                        <tr>
                            <th>產品名稱</th>
                            <th>總價</th>
                            <th>數量</th>
                            <th>廠內版本號</th>
                            <th>序號</th>
                        </tr>
                        </thead>
                    </table>
                </vaadin-grid>
            </div>
        </div>
        
        
        
        
        
        
        <paper-dialog #distributorDialog id="distributorDialog" modal>
            <div class="vendor-detail-header">
                <h2>經銷商基本資料</h2>
                <paper-icon-button icon="close" dialog-dismiss></paper-icon-button>
            </div>
            
            <div>
                <ul>
                    <li>經銷商名稱: {{distributor.dtName}}</li>
                    <li>統一編號: {{distributor.vatNum}}</li>
                    <li>電話: {{distributor.dtTel}}</li>
                    <li>傳真: {{distributor.dtFax}}</li>
                    <li>地址: {{distributor.dtAddr}}</li>
                    <li>網址: {{distributor.dtWeb}} </li>
                    <li>連絡人姓名: {{distributor.contactName}}</li>
                    <li>聯絡人職稱: {{distributor.contactPosition}}</li>
                    <li>聯絡人電話: {{distributor.contactPhone}}</li>
                    <li>聯絡人郵箱: {{distributor.contactEmail}}</li>
                </ul>
            </div>
        </paper-dialog>
        
        
        
        
        <paper-dialog #statusDialog id="statusDialog" modal>
            <div class="vendor-detail-header">
                <h2>銷貨單狀態</h2>
                <paper-icon-button icon="close" dialog-dismiss></paper-icon-button>
            </div>
            <div style="display: inline-block">
                <div style="display: inline-block">
                    <paper-radio-button name="createdStatus"
                                        [checked]="createdChecked" disabled (change)="updateStatus($event);">建單</paper-radio-button>
                    <paper-radio-button name="approvedStatus"
                                        [checked]="approvedChecked" [disabled]="!approvedStatus" (change)="updateStatus($event);">核准</paper-radio-button>
                    <paper-radio-button name="executedStatus"
                                        [checked]="executedChecked" [disabled]="!executedStatus" (change)="updateStatus($event);">執行</paper-radio-button>
                </div>
                <div style="display: inline-block">
                    <paper-radio-button name="goodReceiptStatus"
                                        [checked]="goodReceiptChecked" [disabled]="!goodReceiptStatus" (change)="updateStatus($event);">收貨</paper-radio-button>
                    <paper-radio-button name="paymentStatus"
                                        [checked]="paymentChecked" [disabled]="!paymentStatus" (change)="updateStatus($event);">付款</paper-radio-button>
                    <paper-radio-button name="invoiceReceiptStatus"
                                        [checked]="invoiceReceiptChecked" [disabled]="!invoiceReceiptStatus" (change)="updateStatus($event);">發票</paper-radio-button>
                </div>
                <div style="display: inline-block">
                    <paper-radio-button name="completedStatus"
                                        [checked]="completedChecked" [disabled]="!completedStatus" (change)="updateStatus($event);">完成</paper-radio-button>
                    <paper-button raised (mousedown)="onSubmit()" (click)="onRefresh(); statusDialog.close()">submit</paper-button>
                </div>
            </div>
        </paper-dialog>

        `,
    styles: [`
        .flex-vertical {
            @apply(--layout-vertical);
        }
        .flexchild-vertical {
            @apply(--layout-flex);
        }
        .flex-equal-justified {
            @apply(--layout-horizontal);
            @apply(--layout-justified);
        }
        header {
            display: flex;
            justify-content: space-between;
        }
        .vendor-detail-header {
            display: flex;
            justify-content: space-between;
        }
        
        paper-dialog {
            position: absolute;
            top: 0px;       
            width: 100%;
        }
        .detail-header {
            color: grey;
            display: flex;
            padding: 1% 0 10% 0;

        }
        .vendor-li {
            font-weight: bold;
        }
        .vendor-li:hover{
            cursor: pointer;
            color: #000000;
            font-weight: bold;
        }
        li {
            list-style-type: none;
        }
        vaadin-grid {
            --vaadin-grid-row-height: 50px;
            font-size: 12px;
        }
        .status-layout {
            padding-left: 30px;
        }
        `],
    providers: [HTTPPurchaseService, HTTPSalesService]
})
export class SODetail{
    @Output() closeDialog = new EventEmitter();
    selectedOrder: Object = {};
    distributor: Distributor = new Distributor;
    employee: Employee = new Employee;
    soStatus: SOStatus = new SOStatus;
    soItems: SOItem[] = [];

    createdStatus: boolean = true;
    approvedStatus: boolean = true;
    executedStatus: boolean = true;
    goodReceiptStatus: boolean = true;
    paymentStatus: boolean = true;
    invoiceReceiptStatus: boolean = true;
    completedStatus: boolean = true;

    createdChecked: boolean;
    approvedChecked: boolean;
    executedChecked: boolean;
    goodReceiptChecked: boolean;
    paymentChecked: boolean;
    invoiceReceiptChecked: boolean;
    completedChecked: boolean;

    constructor(private _httpSalesService: HTTPSalesService) {}

    setDetail() {
        // console.log(this.selectedOrder);
        this.distributor = this.selectedOrder["distributor"];
        this.employee = this.selectedOrder["employee"];
        this.soStatus = this.selectedOrder["soStatus"];

        this.createdChecked = this.soStatus.created;
        this.approvedChecked = this.soStatus.approved;
        this.executedChecked = this.soStatus.executed;
        this.goodReceiptChecked = this.soStatus.shipments;
        this.paymentChecked = this.soStatus.payment;
        this.invoiceReceiptChecked = this.soStatus.invoice;
        this.completedChecked = this.soStatus.completed;

        this.approvedStatus = !this.approvedChecked;

        if (this.approvedStatus) {
            this.executedStatus = false;
        } else {
            this.executedStatus = !this.executedChecked;
        }

        if (this.executedStatus) {
            this.goodReceiptStatus = false;
            this.paymentStatus = false;
            this.invoiceReceiptStatus = false;
        } else if (this.goodReceiptChecked && this.paymentChecked && this.invoiceReceiptChecked || !this.executedChecked){
            this.goodReceiptStatus = false;
            this.paymentStatus = false;
            this.invoiceReceiptStatus = false;
        } else {
            this.goodReceiptStatus = true;
            this.paymentStatus = true;
            this.invoiceReceiptStatus = true;
        }
        this.completedStatus = !!(this.goodReceiptChecked && this.paymentChecked && this.invoiceReceiptChecked);

        this.getSoItems(this.selectedOrder["soId"]);
        // console.log("this.approvedStatus:  " + this.approvedStatus);
    }

    onSubmit() {
        console.log("submit soStatus");
        this.soStatus.approved = this.approvedChecked;
        this.soStatus.executed = this.executedChecked;
        this.soStatus.shipments = this.goodReceiptChecked;
        this.soStatus.payment = this.paymentChecked;
        this.soStatus.invoice = this.invoiceReceiptChecked;
        this.soStatus.completed = this.completedChecked;

        this._httpSalesService.updateSoStatus(this.soStatus).subscribe(
            data => {console.log(data)},
            error => alert(error), //error case
            () => console.log("Finished") //pass a function when everything is completed
        );
    }
    onRefresh() {
        this.closeDialog.emit("");
    }

    // checkInfo() {
    //     console.log("### check Info");
    //
    //     console.log(this.createdChecked);
    //     console.log(this.approvedChecked);
    //     console.log(this.executedChecked);
    //     console.log(this.goodReceiptChecked);
    //     console.log(this.paymentChecked);
    //     console.log(this.invoiceReceiptChecked);
    //     console.log(this.completedChecked);
    // }

    getSoItems(soId: string) {
        this._httpSalesService.getSoItemsBySo(soId).subscribe(
            data => {
                this.soItems = data;
                // console.log(this.soItems);
            },
            error => alert(error) //error case
            // () => console.log("Finished") //pass a function when everything is completed
        );
    }

    private updateStatus(e) {
        // console.log("@@@@ this.selectedOrder['approvedStatus']: " + this.selectedOrder['approvedStatus']);
        const status = e.target.name;
        const toggle = e.target.checked;
        // console.log("status: " + status);
        // console.log("toggle: " + toggle);

        switch (status) {
            case "approvedStatus":
                this.approvedChecked = toggle;
                this.executedStatus = !!toggle;
                break;
            case "executedStatus":
                this.executedChecked = toggle;
                if (toggle){
                    this.goodReceiptStatus = true;
                    this.paymentStatus = true;
                    this.invoiceReceiptStatus =true;
                } else {
                    this.goodReceiptStatus = false;
                    this.paymentStatus = false;
                    this.invoiceReceiptStatus = false;
                }
                break;
            case "goodReceiptStatus":
                this.goodReceiptChecked = toggle;
                this.completedStatus = !!(this.goodReceiptChecked && this.paymentChecked && this.invoiceReceiptChecked);
                break;
            case "paymentStatus":
                this.paymentChecked = toggle;
                this.completedStatus = !!(this.goodReceiptChecked && this.paymentChecked && this.invoiceReceiptChecked);
                break;
            case "invoiceReceiptStatus":
                this.invoiceReceiptChecked = toggle;
                this.completedStatus = !!(this.goodReceiptChecked && this.paymentChecked && this.invoiceReceiptChecked);
                break;
            case "completedStatus":
                this.completedChecked = toggle;
                break;
        }

    }

}
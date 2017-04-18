import {Component, Output, EventEmitter} from "angular2/core";
import {POItem} from "../../domain/po-item";
import {POStatus} from "../../domain/po-status";
import {Vendor} from "../../domain/vendor";
import {Employee} from "../../domain/employee";
import {HTTPPurchaseService} from "../../services/http-service/http-purchase.service";
import {HTTPStockService} from "../../services/http-service/http-stock.service";
@Component({
    selector: 'po-detail',
    template: `
        
        <!--1. 採購單資料-->
        <header>
            <h2>採購單基本資料</h2>
            <paper-icon-button icon="close" dialog-dismiss></paper-icon-button>     //dismiss dialog
        </header>
        
        <div class="flex-vertical">
            <div class="detail-header">
                <ul>
                    <li>建單時間: {{selectedOrder.createTime}}</li>
                    <li class="vendor-li" (click)="vendorDialog.open();">供應商: {{vendor.vendorName}}</li>
                    <li>負責員工: {{employee.firstName}}</li>
                </ul>
                <ul >
                    <li>稅: {{selectedOrder.tax}}</li>
                    <li>總價: {{selectedOrder.amount}}</li>
                    <li>能否被入庫: {{selectedOrder.stockWhether}}</li>
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
                <vaadin-grid #grid  visible-rows="5" [items]="poItems" >
                    <table>
                        <colgroup>
                            <col name="item.itemName" >
                            <col name="quantity">
                            <col name="price">
                            <col name="item.itemVendorNum">
                        </colgroup>
                        <thead>
                          <tr>
                              <th>項目名稱</th>
                              <th>數量</th>
                              <th>價格</th>
                              <th>負責人</th>
                          </tr>
                        </thead>
                    </table>
                </vaadin-grid>
            </div>
            <div class="status-layout">
                <paper-button class="submit-button" raised  [disabled]="!goodReceiptChecked || !stockWhether" (click)="onStockIn()" dialog-dismiss>入庫</paper-button>
            </div>
        </div>
        
        
        
        <!--2 Dialog: 供應商資料 -->
        <paper-dialog #vendorDialog id="vendorDialog" modal>
            <div class="vendor-detail-header">
                <h2>供應商基本資料</h2>
                <paper-icon-button icon="close" dialog-dismiss></paper-icon-button>
            </div>
            
            <div>
                <ul>
                    <li>供應商名稱: {{vendor.coName}}</li>
                    <li>統一編號: {{vendor.vatNum}}</li>
                    <li>電話: {{vendor.coTel}}</li>
                    <li>傳真: {{vendor.coFax}}</li>
                    <li>地址: {{vendor.coAddr}}</li>
                    <li>網址: {{vendor.coWeb}} </li>
                    <li>連絡人姓名: {{vendor.contactName}}</li>
                    <li>聯絡人職稱: {{vendor.contactPosition}}</li>
                    <li>聯絡人電話: {{vendor.contactPhone}}</li>
                    <li>聯絡人郵箱: {{vendor.contactEmail}}</li>
                </ul>
            </div>
            
            
        </paper-dialog>
        
        <!--3. Dialog: 採購單狀態-->
        <paper-dialog #statusDialog id="statusDialog" modal>
            <div class="vendor-detail-header">
                <h2>採購單狀態</h2>
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
        .submit-button {
          margin: 5px;
          padding: 8px;
          width: 70%;
        }
        paper-radio-button {
            color: whitesmoke;
            margin-right: 15px;
            --paper-radio-button-checked-color: red;
            --paper-radio-button-checked-ink-color: red;
            --paper-radio-button-unchecked-color: red;
            --paper-radio-button-unchecked-ink-color: red;
            --paper-radio-button-label-color: red;
        }`],
    providers: [HTTPPurchaseService, HTTPStockService]

})
export class PODetail{
    @Output() closeDialog: EventEmitter<any> = new EventEmitter();
    selectedOrder: Object = {};
    vendor: Vendor = new Vendor;
    employee: Employee = new Employee;
    poStatus: POStatus = new POStatus;
    poItems: POItem[] = [];
    stockWhether: boolean = true;

    //狀態
    createdStatus: boolean = true;
    approvedStatus: boolean = true;
    executedStatus: boolean = true;
    goodReceiptStatus: boolean = true;
    paymentStatus: boolean = true;
    invoiceReceiptStatus: boolean = true;
    completedStatus: boolean = true;

    //Check
    createdChecked: boolean;
    approvedChecked: boolean;
    executedChecked: boolean;
    goodReceiptChecked: boolean;
    paymentChecked: boolean;
    invoiceReceiptChecked: boolean;
    completedChecked: boolean;

    constructor(private _httpPurchaseService: HTTPPurchaseService, private _httpStockService: HTTPStockService) {}

    setDetail() {
        // console.log(this.selectedOrder);
        this.vendor = this.selectedOrder["vendor"];
        this.employee = this.selectedOrder["employee"];
        this.poStatus = this.selectedOrder["poStatus"];
        this.stockWhether = this.selectedOrder["stockWhether"];

        this.createdChecked = this.poStatus.created;
        this.approvedChecked = this.poStatus.approved;
        this.executedChecked = this.poStatus.executed;
        this.goodReceiptChecked = this.poStatus.goodReceipt;
        this.paymentChecked = this.poStatus.payment;
        this.invoiceReceiptChecked = this.poStatus.invoiceReceipt;
        this.completedChecked = this.poStatus.completed;

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

        this.getPoItems(this.selectedOrder["poId"]);
        // console.log("this.approvedStatus:  " + this.approvedStatus);
    }

    onSubmit() {
        console.log("submit poStatus");
        this.poStatus.approved = this.approvedChecked;
        this.poStatus.executed = this.executedChecked;
        this.poStatus.goodReceipt = this.goodReceiptChecked;
        this.poStatus.payment = this.paymentChecked;
        this.poStatus.invoiceReceipt = this.invoiceReceiptChecked;
        this.poStatus.completed = this.completedChecked;

        this._httpPurchaseService.updatePoStatus(this.poStatus).subscribe(
            data => {console.log(data)},
            error => alert(error), //error case
            () => console.log("Finished") //pass a function when everything is completed
        );
    }
    onRefresh() {
        this.closeDialog.emit("");
    }

    onStockIn() {
        console.log(this.poStatus);
        if (this.stockWhether === true) {
            if (this.poStatus.stockIn !== true) {
                this.poStatus.stockIn = true;
                this._httpPurchaseService.updatePoStatus(this.poStatus).subscribe(
                    data => {console.log(data)},
                    error => alert(error), //error case
                    () => console.log("poStatus update Finished") //pass a function when everything is completed
                );
                this._httpStockService.postStockInByPo(this.selectedOrder).subscribe(
                    error => alert(error),
                    () => console.log("post StockIn Finished")
                );
            } else {
                alert("此採購單已經入庫，不要無聊一直按！！！");
            }
        }


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

    getPoItems(createTime: string) {
        this._httpPurchaseService.getPoItemsByPo(createTime).subscribe(
            data => {
                this.poItems = data;
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

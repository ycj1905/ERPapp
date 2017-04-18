import {Component, OnInit, Output, EventEmitter} from "angular2/core";
import {POSearchFilter} from "./po-search-filter.component";
import {PurchaseOrder} from "../../domain/purchase-order";
import {HTTPPurchaseService} from "../../services/http-service/http-purchase.service";
declare var moment: any;

@Component({
    selector: 'po-list',
    template: `

        <!--過濾After, Befor, 供應商, 負責人-->
        <!--自訂事件(filtersChange)="filters=$event"-->
        <!--onFilter($event)-->
        <po-search-filter (filtersChange)="filters=$event; onFilter($event);"></po-search-filter>
        
        <!--loading-->
        <paper-progress  [indeterminate]="progress"></paper-progress>
        
        
        <!--過濾後的採購單資訊: displayedPurchaseOrders-->
        <!--事件(selected-times-changed): selected(grid)-->
        <!--事件(value-changed): onChange($event)-->
        <!--事件(sort-order-changed): sortItem($event)-->
        <vaadin-grid id="grid" #grid  [items]="displayedPurchaseOrders" [frozenColumns]="2" 
                     (selected-items-changed)="selected(grid)" (value-changed)="onChange($event)"
                     (sort-order-changed)="sortItem($event)"
                     >
                     
              <table>
                
                  <thead>
                  <tr>
                      <th>建單時間</th>
                      <th>編號</th>
                      <th>供應商</th>
                      <th>負責人</th>
                      <th>總價</th>
                  </tr>
                  </thead>
                  
                  <!--排列, default為descending                  -->
                  <colgroup>
                  <col name="createTime" sortable sort-direction="desc">  
                  <col name="poId" sortable>
                  <col name="vendor.vendorName" sortable >
                  <col name="employee.firstName" sortable >
                  <col name="amount" sortable >
                  <col name="poStatus.approved">
                  <col name="poStatus.executed">
                  <col name="poStatus.goodReceipt">
                  <col name="poStatus.payment">
                  <col name="poStatus.invoiceReceipt">
                  <col name="poStatus.completed">
                </colgroup>
                  
              </table>
              
        </vaadin-grid>
        `,
    styleUrls: ['../../../src/css/po-list.component.css'],
    directives: [POSearchFilter],
    providers: [HTTPPurchaseService]
})

export class POList implements OnInit{
    @Output() viewDetail:EventEmitter<any> = new EventEmitter();

    //所有採購清單
    purchaseOrders: PurchaseOrder[];

    //過濾後所顯示的採購清單
    displayedPurchaseOrders: PurchaseOrder[] = [];

    progress: boolean = true;
    sortOrder: Object;
    filters: Object;

    constructor(private _httpPurchaseService: HTTPPurchaseService) {};

    //OnInit: refreshItems() 更新清單, displayPurchaseOrder = 所有purchaseOrder
    ngOnInit():any {
        this.refreshItems();
    }

    onFilter(event: any) {

        //把過濾用的vendorName, firstName, status, after, before 各別存入常數
        const filterVendor: string = event["vendorName"];
        const filterEmployee: string = event["firstName"];
        const statusText: Object = event["status"];
        const after: Date = event["after"];
        const before: Date = event["before"];

        // console.log(filterText);
        // console.log(statusText);
        // console.log(after);
        // console.log(before);

        //過濾 Vendor不同, purchaseOrder.vendorName.indexOf(filterVendor) > -1
        this.displayedPurchaseOrders = this.purchaseOrders.filter((purchaseOrder: PurchaseOrder) =>
            !filterVendor || purchaseOrder.vendor.vendorName.indexOf(filterVendor) > -1
        );

        //過濾 Emplyees不同, purchaseOrder.employee.firstName.indexOf(filterEmployee) > -1
        this.displayedPurchaseOrders = this.displayedPurchaseOrders.filter((purchaseOrder: PurchaseOrder) =>
            !filterEmployee || purchaseOrder.employee.firstName.indexOf(filterEmployee) > -1
        );


        //過濾不同 status(executed, payment, goodReceipt)
        if (statusText) {
            switch (statusText["name"]) {
                case "executed":
                    if(statusText["toggle"]) {
                        //過濾 executed不同
                        this.displayedPurchaseOrders = this.displayedPurchaseOrders.filter((purchaseOrder: PurchaseOrder) =>
                            purchaseOrder.poStatus.executed !== statusText["toggle"]
                        );
                    }
                    break;
                case "payment":
                    if(statusText["toggle"]) {
                        //過濾 payment不同
                        this.displayedPurchaseOrders = this.displayedPurchaseOrders.filter((purchaseOrder: PurchaseOrder) =>
                            purchaseOrder.poStatus.payment !== statusText["toggle"]
                        );
                    }
                    break;
                case "goodReceipt":
                    if(statusText["toggle"]) {
                        //過濾goodReceipt不同
                        this.displayedPurchaseOrders = this.displayedPurchaseOrders.filter((purchaseOrder: PurchaseOrder) =>
                            purchaseOrder.poStatus.goodReceipt !== statusText["toggle"]
                        );
                    }
                    break;
            }
        }

        if (after) {
            //過濾時間不是after
            this.displayedPurchaseOrders = this.displayedPurchaseOrders.filter((purchaseOrder: PurchaseOrder) =>
                <Date><any>purchaseOrder.createTime >= after
            );
        }

        if (before) {
            //過濾時間不是before
            this.displayedPurchaseOrders = this.displayedPurchaseOrders.filter((purchaseOrder: PurchaseOrder) =>
                <Date><any>purchaseOrder.createTime <= before
            );
        }
    }


    sortItem(event: any) {
        const grid = event.target;
        const sortOrder = grid.sortOrder[0];
        const sortProperty = grid.columns[sortOrder.column].name;
        const sortDirection = sortOrder.direction;
        this.displayedPurchaseOrders.sort((a, b) => {
            let res: number;
            let valueA: string = grid.get(sortProperty, a),
                valueB: string = grid.get(sortProperty, b);

            if (!isNaN(<number><any>valueA)) {          //比較數字
                res = parseInt(valueA, 10) - parseInt(valueB, 10);
            } else {                //比較字串
                res = valueA.localeCompare(valueB);
            }

            if (sortDirection === 'desc') {
                res *= -1;
            }
            return res;
        });
    }

    private selected(grid) {
        var selection = grid.selection.selected();
        if (selection.length === 1) {
            grid.selection.clear();
            grid.getItem(selection[0], (err, item) => {
                this.viewDetail.emit(item);
            });
        }
    }

    refreshItems() {
        // console.log("refreshItems");
        this.progress = true;           //loading
        this.displayedPurchaseOrders = [];  //清空displayedPurchaseOrders

        //重新 Get 採購清單
        this._httpPurchaseService.getPurchaseOrders().subscribe(
            data => {
                this.purchaseOrders = data;
                this.displayedPurchaseOrders = this.purchaseOrders;     //把data存到displayedPurchaseOrders
                for (let i in this.displayedPurchaseOrders) {       //format時間
                    // console.log(this.purchaseOrders[i].createTime);
                    // console.log(moment(this.purchaseOrders[i].createTime ).format('LLLL'));
                    this.displayedPurchaseOrders[i].createTime = moment(this.displayedPurchaseOrders[i].createTime).format('YYYY-MM-DD');
                    // this.displayedPurchaseOrders[i].poStatus.approved;
                    // console.log(moment(this.purchaseOrders[i].createTime ).format('LLLL'));
                    // console.log(this.displayedPurchaseOrders[i].createTime);

                }
                this.progress = false;      //loaded
                // console.log(this.purchaseOrders);
            },
            error => alert(error)
        );


    }

    onChange(e) {
        console.log(e);
    }



}

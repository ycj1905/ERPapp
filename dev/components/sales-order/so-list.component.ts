import {Component, OnInit, Output, EventEmitter} from "angular2/core";
import {HTTPPurchaseService} from "../../services/http-service/http-purchase.service";
import {SOSearchFilter} from "./so-search-filter.component";
import {HTTPSalesService} from "../../services/http-service/http-sales.service";
import {SalesOrder} from "../../domain/sales-order";
declare var moment: any;

@Component({
    selector: 'so-list',
    template: `


        <so-search-filter (filtersChange)="filters=$event; onFilter($event);"></so-search-filter>
        
        <!--loading-->
        <paper-progress  [indeterminate]="progress"></paper-progress>
        
        <vaadin-grid #grid  [items]="displayedSalesOrders" [frozenColumns]="1" 
                     (selected-items-changed)="selected(grid)" (value-changed)="onChange($event)"
                     (sort-order-changed)="sortItem($event)"
                     >
                     <!--(sort-order-changed)="sortItem($event)"-->
              <table>
                
                <colgroup>
                  <col name="createTime" sortable sort-direction="desc">
                  <col name="distributor.dtName" sortable >
                  <col name="employee.firstName" sortable >
                  <col name="amount" sortable >
                  <col name="soStatus.approved">
                  <col name="soStatus.executed">
                  <col name="soStatus.shipments">
                  <col name="soStatus.payment">
                  <col name="soStatus.invoice">
                  <col name="soStatus.completed">
                </colgroup>

                  <thead>
                  <tr>
                      <th>建單時間</th>
                      <th>經銷商</th>
                      <th>負責人</th>
                      <th>總價</th>
                  </tr>
                  </thead>

                  
              </table>
              
        </vaadin-grid>
        `,
    styleUrls: ['../../../src/css/so-list.component.css'],
    directives: [SOSearchFilter],
    providers: [HTTPPurchaseService, HTTPSalesService]
})

export class SOList implements OnInit{
    @Output() viewDetail = new EventEmitter();

    // stockOuts: SalesOrder[];
    // displayedStockOuts: SalesOrder[];
    salesOrders: SalesOrder[];
    displayedSalesOrders: SalesOrder[] = [];
    progress: boolean = true;
    sortOrder: Object;
    filters: Object;

    constructor(private _httpSalesService: HTTPSalesService) {};

    ngOnInit():any {
        this.refreshItems();
    }

    onFilter(event: any) {

        const filterDistributor: string = event["dtName"];
        const filterEmployee: string = event["firstName"];
        const statusText: Object = event["status"];
        const after: Date = event["after"];
        const before: Date = event["before"];

        // console.log(filterText);
        // console.log(statusText);
        // console.log(after);
        // console.log(before);

        this.displayedSalesOrders = this.salesOrders.filter((salesOrder: SalesOrder) =>
            !filterDistributor || salesOrder.distributor.dtName.indexOf(filterDistributor) > -1
        );
        this.displayedSalesOrders = this.displayedSalesOrders.filter((salesOrder: SalesOrder) =>
            !filterEmployee || salesOrder.employee.firstName.indexOf(filterEmployee) > -1
        );



        if (statusText) {
            switch (statusText["name"]) {
                case "executed":
                    if(statusText["toggle"]) {
                        this.displayedSalesOrders = this.displayedSalesOrders.filter((salesOrder: SalesOrder) =>
                            salesOrder.soStatus.executed !== statusText["toggle"]
                        );
                    }
                    break;
                case "payment":
                    if(statusText["toggle"]) {
                        this.displayedSalesOrders = this.displayedSalesOrders.filter((salesOrder: SalesOrder) =>
                            salesOrder.soStatus.payment !== statusText["toggle"]
                        );
                    }
                    break;
                case "goodReceipt":
                    if(statusText["toggle"]) {
                        this.displayedSalesOrders = this.displayedSalesOrders.filter((salesOrder: SalesOrder) =>
                            salesOrder.soStatus.shipments !== statusText["toggle"]
                        );
                    }
                    break;
            }
        }

        if (after) {
            this.displayedSalesOrders = this.displayedSalesOrders.filter((salesOrder: SalesOrder) =>
                <Date><any>salesOrder.createTime >= after
            );
        }

        if (before) {
            this.displayedSalesOrders = this.displayedSalesOrders.filter((salesOrder: SalesOrder) =>
                <Date><any>salesOrder.createTime <= before
            );
        }



    }

    sortItem(event: any) {
        const grid = event.target;
        const sortOrder = grid.sortOrder[0];
        const sortProperty = grid.columns[sortOrder.column].name;
        const sortDirection = sortOrder.direction;
        this.displayedSalesOrders.sort((a, b) => {
            let res: number;
            let valueA: string = grid.get(sortProperty, a),
                valueB: string = grid.get(sortProperty, b);
            if (!isNaN(<number><any>valueA)) {
                res = parseInt(valueA, 10) - parseInt(valueB, 10);
            } else {
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
        console.log("refreshItems");
        this._httpSalesService.getSalesOrders().subscribe(
            data => {
                this.salesOrders = data;
                // this.displayedPurchaseOrders = JSON.parse(JSON.stringify(this.purchaseOrders));
                this.displayedSalesOrders = this.salesOrders;
                for (let i in this.displayedSalesOrders) {
                    // console.log(this.purchaseOrders[i].createTime);
                    // console.log(moment(this.purchaseOrders[i].createTime ).format('LLLL'));
                    this.displayedSalesOrders[i].createTime = moment(this.displayedSalesOrders[i].createTime).format('YYYY-MM-DD');
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
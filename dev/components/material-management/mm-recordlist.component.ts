import {Component, OnInit, Output, EventEmitter} from "angular2/core";
import {HTTPStockService} from "../../services/http-service/http-stock.service";
import {MMRecordListFilter} from "./mm-recordlist-filter.component";
import {StockOut} from "../../domain/stock-out";
declare var moment: any;

@Component({
    selector: 'mm-recordlist',
    template: `


        <header>
            <h2>出入庫紀錄</h2>
            <paper-icon-button icon="close" dialog-dismiss></paper-icon-button>
        </header>
        <mm-recordlist-filter (filtersChange)="filters=$event; onFilter($event);"></mm-recordlist-filter>
        <paper-progress  [indeterminate]="progress"></paper-progress>
        <vaadin-grid #grid  [items]="displayedStockOuts" [frozenColumns]="2" 
                     (selected-items-changed)="selected(grid)" (value-changed)="onChange($event)"
                     (sort-order-changed)="sortItem($event)"
                     >
                     <!--(sort-order-changed)="sortItem($event)"-->
              <table>
                    <colgroup>
                        <col name="createTime" sortable sort-direction="desc">
                        <col name="item.itemName" sortable>
                        <col name="quantity" sortable >
                        <col name="item.itemVendorNum" >
                        <col name="employee.firstName" sortable >
                        <col name="purchaseOrder.poId" sortable >
                        <col name="remark" >
                    </colgroup>
                  <thead>
                  <tr>
                      <th>時間</th>
                      <th>物料名稱</th>
                      <th>異動數量</th>
                      <th>物料料號</th>
                      <th>人員</th>
                      <th>採購單號</th>
                      <th>出庫備註資訊</th>
                  </tr>
                  </thead>

                  
              </table>
              
        </vaadin-grid>
        `,
    styles: [`

        header {
            display: flex;
            justify-content: space-between;
        }
        vaadin-grid {
            --vaadin-grid-row-height: 50px;
            font-size: 12px;
        }
        mm-recordlist-filter {
            background-color: ghostwhite;
        }
        paper-progress {
            width: 100%;
            --paper-progress-indeterminate-cycle-duration: 2s;
            --paper-progress-transition-duration: 0.08s;
            --paper-progress-transition-transition-delay: 0s;
        }
        `],
    directives: [MMRecordListFilter],
    providers: [HTTPStockService]
})

export class MMRecordList{
    @Output() viewDetail:EventEmitter<any> = new EventEmitter();

    // stockOuts: SalesOrder[];
    // displayedStockOuts: SalesOrder[];
    stockOuts: StockOut[];
    displayedStockOuts: StockOut[] = [];
    progress: boolean = true;

    sortOrder: Object;
    filters: Object;

    constructor(private _httpStockService: HTTPStockService) {};

    onFilter(event: any) {
        console.log("onFilter");

        const filterItemCategory: string = event["categoryName"];
        const filterItemName: string = event["itemName"];
        const filterEmployee: string = event["firstName"];
        const statusText: Object = event["status"];
        const after: Date = event["after"];
        const before: Date = event["before"];

        // console.log(filterText);
        // console.log(statusText);
        // console.log(after);
        // console.log(before);

        this.displayedStockOuts = this.stockOuts.filter((stockout: StockOut) =>
            !filterItemCategory || stockout.item.itemCategory.categoryName.indexOf(filterItemCategory) > -1
        );

        this.displayedStockOuts= this.displayedStockOuts.filter((stockout: StockOut) =>
            !filterEmployee || stockout.employee.firstName.indexOf(filterEmployee) > -1
        );

        this.displayedStockOuts = this.displayedStockOuts.filter((stockout: StockOut) =>
            !filterItemName || stockout.item.itemName.indexOf(filterItemName) > -1
        );

        if (statusText) {
            switch (statusText["name"]) {
                case "finishedProduct":
                    if(statusText["toggle"]) {
                        console.log(statusText["toggle"]);
                        this.displayedStockOuts = this.displayedStockOuts.filter((stockOut: StockOut) =>
                            stockOut.item.itemType.itemTypeName === "成品"
                        );
                    }
                    break;
                case "rawMaterial":
                    if(statusText["toggle"]) {
                        console.log(statusText["toggle"]);
                        this.displayedStockOuts = this.displayedStockOuts.filter((stockOut: StockOut) =>
                            stockOut.item.itemType.itemTypeName === "原料"
                        );
                    }
                    break;
            }
        }

        if (after) {
            this.displayedStockOuts = this.displayedStockOuts.filter((stockOut: StockOut) =>
                <Date><any>stockOut.createTime >= after
            );
        }

        if (before) {
            this.displayedStockOuts = this.displayedStockOuts.filter((stockOut: StockOut) =>
                <Date><any>stockOut.createTime <= before
            );
        }




    }

    sortItem(event: any) {
        const grid = event.target;
        const sortOrder = grid.sortOrder[0];
        const sortProperty = grid.columns[sortOrder.column].name;
        const sortDirection = sortOrder.direction;
        this.displayedStockOuts.sort((a, b) => {
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
        this.progress = true;
        this._httpStockService.getStockOuts().subscribe(
            data => {
                this.stockOuts = data;
                this.displayedStockOuts = this.stockOuts;
                for (let i in this.displayedStockOuts) {
                    this.displayedStockOuts[i].createTime = moment(this.displayedStockOuts[i].createTime).format('YYYY-MM-DD');
                }
                this.progress = false;
                console.log(this.stockOuts);
            },
            error => alert(error)
        );


    }

    onChange(e) {
        console.log(e);
    }



}

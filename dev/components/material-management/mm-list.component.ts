import {Component, OnInit, Output, EventEmitter} from "angular2/core";
import {HTTPStockService} from "../../services/http-service/http-stock.service";
import {MMSearchFilter} from "./mm-search-filter.component";
import {Stock} from "../../domain/stock";
declare var moment: any;

@Component({
    selector: 'mm-list',
    template: `
        <mm-search-filter (filtersChange)="filters=$event; onFilter($event);"></mm-search-filter>
        <paper-progress  [indeterminate]="progress"></paper-progress>
        <vaadin-grid #grid  [items]="displayedStocks" [frozenColumns]="1" 
                     (selected-items-changed)="selected(grid)" (value-changed)="onChange($event)"
                     (sort-order-changed)="sortItem($event)"
                     >
                     <!--(sort-order-changed)="sortItem($event)"-->
              <table>
                
                <colgroup>
                  <col name="item.itemName" sortable sort-direction="desc">
                  <col name="quantity" sortable >
                  <col name="item.itemVendorNum" sortable >
                </colgroup>

                  <thead>
                  <tr>
                      <th>物料名稱</th>
                      <th>數量</th>
                      <th>料號</th>
                  </tr>
                  </thead>

                  
              </table>
              
        </vaadin-grid>
        `,
    styleUrls: ['../../../src/css/mm-list.component.css'],
    directives: [MMSearchFilter],
    providers: [HTTPStockService]
})

export class MMList implements OnInit{
    @Output() viewDetail: EventEmitter<any> = new EventEmitter();
    @Output() stockResult: EventEmitter<any> = new EventEmitter();
    // stockOuts: SalesOrder[];
    // displayedStockOuts: SalesOrder[];
    stocks: Stock[];
    displayedStocks: Stock[];

    progress: boolean = true;
    sortOrder: Object;
    filters: Object;

    constructor(private _httpStockService: HTTPStockService) {};

    //OnInit: 更新清單
    ngOnInit():any {
        this.refreshItems();
    }

    onFilter(event: any) {
        const filterItemCategory: string = event["categoryName"];
        const filterItemName: string = event["itemName"];
        const statusText: Object = event["status"];
        const after: Date = event["after"];
        const before: Date = event["before"];

        // console.log(filterText);
        console.log(filterItemName);
        // console.log(statusText);
        // console.log(after);
        // console.log(before);

        this.displayedStocks = this.stocks.filter((stock: Stock) =>
            !filterItemCategory || stock.item.itemCategory.categoryName.indexOf(filterItemCategory) > -1
        );

        this.displayedStocks = this.displayedStocks.filter((stock: Stock) =>
            !filterItemName || stock.item.itemName.indexOf(filterItemName) > -1
        );

        if (statusText) {
            switch (statusText["name"]) {
                case "finishedProduct":
                    if(statusText["toggle"]) {
                        console.log(statusText["toggle"]);
                        this.displayedStocks = this.displayedStocks.filter((stock: Stock) =>
                            stock.item.itemType.itemTypeName === "成品"
                        );
                    }
                    break;
                case "rawMaterial":
                    if(statusText["toggle"]) {
                        console.log(statusText["toggle"]);
                        this.displayedStocks = this.displayedStocks.filter((stock: Stock) =>
                            stock.item.itemType.itemTypeName === "原料"
                        );
                    }
                    break;
            }
        }
    }

    sortItem(event: any) {
        const grid = event.target;
        const sortOrder = grid.sortOrder[0];
        const sortProperty = grid.columns[sortOrder.column].name;
        const sortDirection = sortOrder.direction;
        this.displayedStocks.sort((a, b) => {
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
        // console.log("refreshItems");
        this.displayedStocks = [];
        this.progress = true;
        this._httpStockService.getViewStocks().subscribe(
            data => {
                this.stocks = data;
                this.displayedStocks = this.stocks;
                // console.log(this.stocks);
                this.progress = false;

                let resultInfo = [];
                resultInfo.push("庫存數量小於五的原料：");
                for (let element in this.stocks) {
                    if (this.stocks[<string>element]["quantity"] <= 5 && this.stocks[<string>element]["item"]["itemType"]["itemTypeName"] === "原料") {
                        console.log(this.stocks[<string>element]["item"]["itemType"]);
                        resultInfo.push(this.stocks[<string>element]["item"]["itemName"]+ " " + this.stocks[<string>element]["item"]["itemVendorNum"] + " 剩餘數量: " + this.stocks[<string>element]["quantity"]);
                    }

                }

                if (resultInfo.length > 0) {
                    console.log(resultInfo);
                    alert(resultInfo.join("\n"));
                }

                this.stockResult.emit(this.stocks)
            },
            error => alert(error)
        );
    }

    onChange(e) {
        console.log(e);
    }



}

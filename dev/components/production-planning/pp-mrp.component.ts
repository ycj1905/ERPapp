import {Component} from "angular2/core";
import {HTTPStockService} from "../../services/http-service/http-stock.service";
import {Stock} from "../../domain/stock";
import {OnInit} from "angular2/src/core/linker/interfaces";
import {Bom} from "../../domain/bom";
import {HTTPBomService} from "../../services/http-service/http-bom.service";
import {HTTPSalesService} from "../../services/http-service/http-sales.service";
import {SalesItem} from "../../domain/sales-item";
declare var moment: any;

@Component({
    selector: 'pp-mrp',
    template: `

        <section class="top-controller">
            <!--1. 成品品項-->
            <div class="controller-layout">
                <vaadin-combo-box label="成品品項" [items]="salesItems" item-label-path="sItemName" item-value-path="sItemName"
                                  (selected-item-changed)="onItemSelected($event)" [disabled]="disabled"></vaadin-combo-box>
                <p>版本號： {{itemVendorNum}} </p>
                <p>當前庫存量： {{stockQuantity}}</p>
            </div>
            <!--2. 需求數量-->
            <div class="controller-layout">
                <paper-input label="需求數量" type="number" [disabled]="disabled" [(ngModel)]="requiredQuantity" ngDefaultControl ></paper-input>
                <paper-button (click)="onEnter()" [disabled]="disabled">Enter</paper-button>
                <paper-button (click)="onBack()" [disabled]="!disabled">Back</paper-button>
            </div>
            
            
        </section>

        
       <!--on Enter > True-->
        <section *ngIf="disabled" class="expand-layout">        
        
            <div>
                <paper-button raised (click)="onExpanded()">{{expandedLabel}}物料清單</paper-button>
            </div>
            
            <paper-dialog-scrollable>
                <ul>
                    <li *ngFor="#element of semiBoms" >
                        <!--1. BOM 品項-->
                        {{ element.bomName }} 
                        
                                                      
                        <!--2. BOM的物料內容, 按展開才會顯示-->
                        <div *ngIf="expanded">
                            <ul *ngFor="#material of boms" >
                                <div *ngIf="element.bomName === material.bom.bomName">      
                                    <div *ngIf="material.stockQuantity !== null">
                                        
                                        <!--1. 庫存 > 需求-->
                                        <li *ngIf="(material.stockQuantity - material.quantity * (requiredQuantity-stockQuantity)) >= 0">
                                            尚餘: {{material.stockQuantity - material.quantity * (requiredQuantity-stockQuantity)}}   {{ material.bomName }}
                                        </li>
                                        <!--2. 庫存 < 需求-->
                                        <li *ngIf="(material.stockQuantity - material.quantity * (requiredQuantity-stockQuantity)) < 0" style="color: red">
                                            不足: {{material.stockQuantity - material.quantity * (requiredQuantity-stockQuantity)}}    {{ material.bomName }}
                                        </li>
                                    </div>                    
                                </div>
                                
                            </ul>
                        </div>                        
                    </li>
                </ul>
                
            </paper-dialog-scrollable>
        </section>


`,
    styles: [`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .top-controller {
          width: 100%;
          display: block;
          padding: 20px;
          background-color: whitesmoke;
          max-height: 100px;
      }
      .top-controller paper-input {
          height: 10px;
          max-width: 400px;
      }
      .top-controller paper-button {
          max-height: 40px;
      }
      .top-controller p {
          position: relative;
          bottom: 7px;
          padding-left: 20px;
          color: dimgray;
          width: 150px;
      }
      .controller-layout {
          display: flex;
      }
      .controller-layout paper-input{
          height: 10px;
          max-width: 400px;
      }
      vaadin-grid {
          flex: 1;
          width: 100%;
          height: 100%;
          font-size: 14px;
          line-height: 20px;
      }
      section {
          width: 100%;
          height: 70vh;
          
      }
      .expand-layout {
          display: flex;
          
      }
      .expand-layout paper-button {
          margin: 20px;
      }
      .input-param {
          margin-left: 20px;
          margin-top: 10px;
      }
      section paper-dialog-scrollable {
          height: 100%;
          width: 100%;
      }
      `],
    providers: [HTTPStockService, HTTPBomService, HTTPSalesService]
})

export class PPMrp implements OnInit{
    salesItems: SalesItem[] = [];
    selectedSalesItem: SalesItem = new SalesItem;
    itemVendorNum:string = "";
    stockQuantity: number = null;
    requiredQuantity: number = null;
    disabled = false;
    expanded = false;
    expandedLabel: string = "展開";
    stocks: Stock[] = [];

    boms: Bom[] = [];
    semiBoms: Bom[] = [];
    selectedElement: Object = {};

    constructor(private _httpStockService: HTTPStockService, private _httpBomService: HTTPBomService, private  _httpSalesService: HTTPSalesService) {}

    //GET 銷售單, GET Stocks
    ngOnInit(): any {
        this._httpSalesService.getSalesItems().subscribe(
            data => {
                this.salesItems = data;
                console.log(this.salesItems);
            },
            error => alert(error),
            () => console.log("getSalesItems Finished")
        );
        this._httpStockService.getViewStocks().subscribe(
            data => {
                this.stocks = data;
                console.log(this.stocks);
            },
            error => alert(error),
            () => console.log("getViewStocks Finished")
        );
    }

    onEnter() {
        console.log(this.selectedSalesItem);
        if (this.selectedSalesItem !== null || this.requiredQuantity !== null) {
            if (this.selectedSalesItem.sItemName !== null && this.requiredQuantity > this.stockQuantity) {
                this.disabled = true;

                // console.log(this.selectedSalesItem);
                // console.log(this.stocks);
                // console.log("BOM opened");

                this._httpBomService.getBomsByBomId(this.selectedSalesItem["bom"]["bomId"]).subscribe(
                    data => {
                        this.boms = data;
                        this.semiBoms = [];
                        // console.log(this.boms);
                        for (let element in this.boms) {

                            let targetStock: Stock[] = this.stocks.filter((stock: Stock) => this.boms[<string>element]["item"]["itemId"] === stock.item.itemId);
                            if (targetStock.length > 0) {
                                this.boms[<string>element].stockQuantity = targetStock[0].quantity;
                            } else {
                                this.boms[<string>element].stockQuantity = null;
                            }
                            // console.log("----------- " + this.boms[<string>element].stockQuantity);


                            if (element === '0') {
                                this.semiBoms.push(this.boms[<string>element]["bom"]);
                                // console.log(this.boms[element]["bom"]["bomName"]);
                            }
                            else if (this.boms[element]["bom"]["bomName"] !== this.semiBoms[this.semiBoms.length-1]["bomName"]) {
                                this.semiBoms.push(this.boms[<string>element]["bom"]);
                                // console.log(this.boms[element]["bom"]["bomName"]);
                            }
                        }
                        console.log(this.semiBoms);
                    },
                    error => alert(error), //error case
                    () => console.log("Finished") //pass a function when everything is completed
                );
            } else if (this.selectedSalesItem.sItemName !== null && this.requiredQuantity <= this.stockQuantity) {
                alert("目前庫存足以支應需求");
            }
        }
    }

    onBack() {
        this.disabled = false;
    }

    onItemSelected(e) {
        // console.log(e.detail.value);
        if (e.detail.value !== null){
            // console.log(e.detail.value);
            this.selectedSalesItem = e.detail.value;
            // console.log(e.detail.value);
            this.itemVendorNum = this.selectedSalesItem.sItemVendorNum;

            // console.log(this.stocks.filter( (stock: Stock) =>
            //     stock.item.itemId === this.selectedSalesItem.bom.item.itemId
            // ));
            this.stockQuantity = this.stocks.filter( (stock: Stock) =>
                stock.item.itemId === this.selectedSalesItem.bom.item.itemId
            )[0].quantity;
        } else {
            this.selectedSalesItem = e.detail.value;
            this.itemVendorNum = "";
        }
    }

    onExpanded() {
        if (this.expanded === true) {
            this.expandedLabel = "展開";
            this.expanded = false;
        } else {
            this.expandedLabel = "閉合";
            this.expanded = true;
        }

    }
}

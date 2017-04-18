import {Component, OnInit, EventEmitter, Output} from "angular2/core";
import {Employee} from "../../domain/employee";
import {HTTPPurchaseService} from "../../services/http-service/http-purchase.service";
import {Item} from "../../domain/item";
import {ItemUnit} from "../../domain/item-unit";
import {Distributor} from "../../domain/distributor";
import {SalesOrder} from "../../domain/sales-order";
import {HTTPSalesService} from "../../services/http-service/http-sales.service";
import {SalesItem} from "../../domain/sales-item";
import {SOItem} from "../../domain/so-item";
import {SOStatus} from "../../domain/so-status";
import {SOBom} from "./so-bom.component";
import {HTTPStockService} from "../../services/http-service/http-stock.service";
@Component({
    selector: 'so-editor',
    template: `
            <div class="main-layout">
                <h2>創建銷貨單</h2>
                <paper-icon-button icon="close" dialog-dismiss></paper-icon-button>
            </div>
            
            <!--1.COMBO-BOX: 選擇經銷商-->
            <vaadin-combo-box label="選擇經銷商" [items]="distributors" item-label-path="dtName" item-value-path="dtName"
                    (value-changed)="onDistributorSelect($event)"></vaadin-combo-box>         
                       
            <section>
                <div class="edit-layout">
                    <!--1.員工名稱-->
                    <vaadin-combo-box label="員工名稱" [items]="employees" item-label-path="firstName" item-value-path="firstName"
                                      (value-changed)="onEmployeeSelected($event)" ></vaadin-combo-box>
                    <!--2.稅-->
                    <paper-input  style="padding-left: 20px" label="稅" type="number"
                                 [(ngModel)]="newSalesOrder.tax" ngDefaultControl >
                    </paper-input>
                    
                    <!--3.序號-->
                    <paper-input  style="padding-left: 20px" label="序號"
                                 [(ngModel)]="serial" ngDefaultControl >
                    </paper-input>                    
                </div>               
                
                
                <div class="edit-layout">
                    <!--1.商品列表-->
                    <vaadin-combo-box label="商品列表" [items]="salesItems" item-label-path="sItemName" item-value-path="sItemPrice"
                                      (selected-item-changed)="onItemSelected($event)" ></vaadin-combo-box>
                    <!--2.數量-->
                    <paper-input label="數量" type="number" auto-validate allowed-pattern="^[0-9][0-9]*$" error-message="number only!"
                                 style="padding-left: 20px" [(ngModel)]="quantity" ngDefaultControl >
                    </paper-input>
                    
                    <!--3.數量-->
                    <paper-input  style="padding-left: 20px" label="售價" type="number"
                                 [(ngModel)]="actualPrice" ngDefaultControl >
                    </paper-input>
                </div>
                
                <div class="edit-layout">
                    
                    <!--1.展開BOM表-->
                    <paper-icon-button id="zoom-out-map" icon="maps:zoom-out-map" [disabled]="selectedItem.sItemName===null" (click)="bomDialog.open(); soBom.onOpen(selectedItem)"></paper-icon-button>
                    <paper-tooltip for="zoom-out-map">展開BOM表</paper-tooltip>
                    
                    <!--2.增加-->
                    <paper-icon-button id="add" icon="add" (mousedown)="cleanUpPreEvent()" (mouseup)="addSoItem()"></paper-icon-button>
                    <paper-tooltip for="add">增加品項</paper-tooltip>
                    
                    <!--3.刪除-->
                    <paper-icon-button id="remove" icon="remove" (mousedown)="cleanUpPreEvent()" (mouseup)="removeSoItem()"></paper-icon-button>
                    <paper-tooltip for="remove">刪除品項</paper-tooltip>
                    <p style="padding-left: 20px" >物料料號： {{sItemVendorNum}} </p>
                    
                    <p>參考價格： {{refPrice}} </p>
                </div>
                
                <div>
                    <vaadin-grid #grid [items]="DisplayNewSoItems" selection-mode="multi" visible-rows="3" (selected-items-changed)="selected(grid)">
                        <table>
                            <colgroup>
                                <col name="salesItem.sItemName">
                                <col name="price">
                                <col name="quantity">     
                                <col name="serial">
                                <col name="salesItem.sItemVendorNum">
                            </colgroup>
                            <thead>
                            
                            <tr>
                                <th>產品名稱</th>
                                <th>總價</th>
                                <th>數量</th>
                                <th>出貨序號</th>
                                <th>廠內版本號</th>
                            </tr>
                            </thead>
                        </table>
                    </vaadin-grid>
                </div>
                
            <!--Button: 送出-->
            <paper-button raised class="submit-button"
                    [disabled]="selectedEmployee.firstName === null || selectedItem.itemName === null || quantity <= 0 || selectedDistributor.dtName === null"  
                    (mousedown)="onSubmitSo()" (click)="onSubmitSoItem()">Submit
            </paper-button>
            
            <!--BOM表-->
            <paper-dialog #bomDialog id="bomDialog" modal>
                    <so-bom #soBom  ></so-bom>
            </paper-dialog>
            
            </section>

            `,
    styleUrls: ['../../../src/css/so-editor.component.css'],
    providers: [HTTPPurchaseService, HTTPSalesService, HTTPStockService],
    directives: [SOBom]

})
export class SOEditor implements OnInit{
    @Output() refresh = new EventEmitter();

    distributors: Distributor[];
    employees: Employee[];
    salesItems: SalesItem[];    //選擇的銷售商品(只有Dasink)
    temp: SOItem[] = [];
    temp2: SOItem[] = [];
    temp3: SOItem[] = [];

    selectedDistributor: Distributor = new Distributor;
    selectedItem: SalesItem = new SalesItem;
    selectedEmployee: Employee = new Employee;

    DisplayNewSoItems: SOItem[] = [];
    newSoItems: SOItem[] = [];
    refPrice: number;
    actualPrice: number;
    serial: string;
    sItemVendorNum: string;
    itemUnit: ItemUnit = new ItemUnit;
    quantity: number;
    selection: number[];

    public newSalesOrder: SalesOrder = new SalesOrder();

    constructor(private _httpSalesService: HTTPSalesService) {}

    //GET 經銷商、員工、銷售商品
    ngOnInit():any {
        this._httpSalesService.getDistributors().subscribe(
            data => {
                this.distributors = data;
                console.log(this.distributors);
            },
            error => alert(error), //error case
            () => console.log("Finished") //pass a function when everything is completed
        );

        this._httpSalesService.getEmployees().subscribe(
            data => {
                this.employees = data;
                console.log(this.employees);
            },
            error => alert(error),
            () => console.log("getEmployees Finished")
        );
        this._httpSalesService.getSalesItems().subscribe(
            data => {
                this.salesItems = data;
                console.log(this.salesItems);
            },
            error => alert(error),
            () => console.log("getSalesItems Finished")
        );

    }

    onDistributorSelect(e) {
        console.log(e.detail.value);
        this.selectedDistributor.dtName = e.detail.value;
    }

    onEmployeeSelected(e) {
        console.log(e.detail.value);
        this.selectedEmployee.firstName = e.detail.value;
    }

    onItemSelected(selection) {
        console.log("onItemSelected");
        //in case of selection.detail is null
        if (selection.detail.value !== null){
            this.selectedItem = selection.detail.value;
            this.refPrice = selection.detail.value.sItemPrice;
            this.sItemVendorNum = selection.detail.value.sItemVendorNum;
            this.itemUnit = selection.detail.value.itemUnit;
        }
    }

    //增加
    addSoItem() {
        console.log("addSoItem");

        console.log(this.actualPrice);

        if (this.selectedItem.sItemName !== null && this.quantity > 0 && this.serial !== undefined) {
            if (this.actualPrice > 0 && this.actualPrice !== undefined) {
                this.temp3.push(new SOItem(this.selectedItem, this.quantity, this.actualPrice*this.quantity, this.serial));
                this.temp.push(new SOItem(this.selectedItem, this.quantity, this.actualPrice*this.quantity, this.serial));
            } else {
                this.temp3.push(new SOItem(this.selectedItem, this.quantity, this.refPrice*this.quantity, this.serial));
                this.temp.push(new SOItem(this.selectedItem, this.quantity, this.refPrice*this.quantity, this.serial));
            }


        }
        this.newSoItems = this.temp3;
        this.DisplayNewSoItems = this.temp;

        console.log(this.newSoItems);
        console.log(this.DisplayNewSoItems);

    }


    removeSoItem() {
        // console.log("removeSoItem");
        this.DisplayNewSoItems = this.temp;
        if(this.selection !== undefined) {
            if(this.selection.length > 0) {

                let tempAll = this.temp.slice();
                for(let i=this.selection.length-1; i>=0; i--) {
                    // console.log(this.temp);
                    // console.log("1------- "+i);
                    this.DisplayNewSoItems = tempAll.filter((stockout) =>
                        tempAll.indexOf(stockout) === this.selection[i]
                    );
                    console.log(this.DisplayNewSoItems[0]);
                    // console.log("*************");
                    this.temp.splice(this.temp.indexOf(this.DisplayNewSoItems[0]), 1);
                }
                this.DisplayNewSoItems = this.temp;

                let tempAll2 = this.newSoItems.slice();
                for(let i=this.selection.length-1; i>=0; i--) {
                    // console.log(this.temp);
                    // console.log("1------- "+i);
                    let selectedArray = tempAll2.filter((stockout) =>
                        tempAll2.indexOf(stockout) === this.selection[i]
                    );
                    // console.log("*************");
                    this.newSoItems.splice(this.newSoItems.indexOf(selectedArray[0]), 1);
                }
                console.log("newSoItems: "+this.newSoItems);

                this.selection = [];

            }
        }

    }

    cleanUpPreEvent() {
        // console.log("cleanUpPreEvent");
        this.DisplayNewSoItems = this.temp2;
    }

    onSubmitSo() {
        console.log("onSubmitSo");
        this.newSalesOrder.employee = this.employees.filter((employee: Employee) => employee.firstName === this.selectedEmployee.firstName)[0];
        this.newSalesOrder.distributor = this.distributors.filter((distributor: Distributor) => distributor.dtName === this.selectedDistributor.dtName)[0];
        this.newSalesOrder.soStatus = new SOStatus();
        this.DisplayNewSoItems.map(element => {
            this.newSalesOrder.amount += element.price;
        });

        if (this.newSalesOrder.tax !== null || this.newSalesOrder.tax !== 0) {
            this.newSalesOrder.amount += this.newSalesOrder.amount*(this.newSalesOrder.tax);
            // console.log(this.newPurchaseOrder.amount);
        }
        console.log(this.DisplayNewSoItems);

        this._httpSalesService.postSalesOrder(this.newSalesOrder, this.newSoItems).subscribe(
            data => {
                console.log(data);
            },
            error => alert(error),
            () => console.log("post Finished")
        );

        console.log("*********************");
        console.log(this.newSalesOrder);

    }

    onSubmitSoItem() {
        console.log("onSubmitSoItem");
        console.log(this.DisplayNewSoItems);



        //initialize every variable
        this.selectedEmployee = new Employee;
        this.selectedItem = new SalesItem;
        this.newSalesOrder = new SalesOrder;
        this.refPrice = null;
        this.sItemVendorNum = null;
        this.itemUnit = new ItemUnit;
        this.quantity = null;
        this.temp = [];
        this.temp3 = [];
        this.DisplayNewSoItems = [];
        this.newSoItems = [];
        this.refresh.emit("");

    }

    selected(grid) {
        // console.log("------------selected");

        if (grid.selection.selected().length > 0) {
            // grid.selection.clear();
            this.selection = grid.selection.selected();
            // console.log("selected: "+grid.selection.selected());
            // console.log("deselected: "+grid.selection.deselected());
        }
    }


}
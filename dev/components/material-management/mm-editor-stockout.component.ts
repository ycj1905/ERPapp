import {Component, OnInit, EventEmitter, Output} from "angular2/core";
import {Employee} from "../../domain/employee";
import {HTTPPurchaseService} from "../../services/http-service/http-purchase.service";
import {POItem} from "../../domain/po-item";
import {HTTPStockService} from "../../services/http-service/http-stock.service";
import {StockOut} from "../../domain/stock-out";
import {Stock} from "../../domain/stock";
declare var moment: any;

@Component({
    selector: 'mm-editor-stockout',
    template: `
            <div class="main-layout">
                <h2>出庫</h2>
                <paper-icon-button icon="close" dialog-dismiss (click)="onClose()"></paper-icon-button>
            </div>
            
            <section class="top-controller">
                <paper-input [disabled]="disabled" label="訂購單編號" type="number" auto-validate allowed-pattern="^[0-9][0-9]*$" error-message="number only!"
                             [(ngModel)]="inputPOId" ngDefaultControl autofocus></paper-input>
                <paper-button id="next" raised [disabled]="disabled" (click)="onNext()" (keyBindings)="onEnter($event)">下一步</paper-button>
                <paper-button raised [disabled]="!disabled" (click)="onClose()" >重選</paper-button>
            </section>
           
            
            <section id="out" *ngIf="disabled !== false && inputPOId > 0">
                <paper-dialog-scrollable>
                    <div class="edit-layout">
                        <vaadin-combo-box label="員工名稱" [items]="employees" item-label-path="firstName" item-value-path="firstName"
                                          (value-changed)="onEmployeeSelected($event)" ></vaadin-combo-box>
                        <vaadin-date-picker style="padding-left: 20px" label="出庫日期" (value-changed)="createTime = $event.detail.value"></vaadin-date-picker>
                    </div>
                    <div>
                        <paper-input label="備註" type="text" [(ngModel)]="remark" ngDefaultControl></paper-input>
                    </div>

                    <div class="edit-layout">
                        <vaadin-combo-box label="相關物料" [items]="poItems" item-label-path="item.itemName" item-value-path="item.itemPrice"
                                          (selected-item-changed)="onPoItemSelected($event)" ></vaadin-combo-box>
                        <paper-input label="異動數量" type="number" auto-validate allowed-pattern="^[0-9][0-9]*$" error-message="number only!"
                                     style="padding-left: 20px" [(ngModel)]="quantity" ngDefaultControl >
                        </paper-input>
                    </div>

                    <div class="edit-layout">
                        <paper-icon-button icon="add" (mousedown)="cleanUpPreEvent()" (mouseup)="onAdd()"></paper-icon-button>
                        <paper-icon-button icon="remove" (mousedown)="cleanUpPreEvent()" (mouseup)="onRemove()" ></paper-icon-button>
                        <p style="padding-left: 20px">物料料號： {{itemVendorNum}} </p>
                    </div>


                    <div>
                        <vaadin-grid #grid [items]="displayStockOuts" selection-mode="multi" visible-rows="5" (selected-items-changed)="onSelected(grid)">
                            <table>
                                <colgroup>
                                    <col name="item.itemName">
                                    <col name="employee.firstName">
                                    <col name="quantity">
                                    <col name="createTime">
                                    <col name="remark">
                                    <col name="item.itemVendorNum">
                                </colgroup>
                            </table>
                        </vaadin-grid>
                    </div>





                    <paper-button raised class="submit-button"[disabled]="selectedEmployee.firstName === null || quantity <= 0 || selectedPoItem.purchaseOrder === null"
                                  (click)="onSubmit()">Submit
                    </paper-button>
                </paper-dialog-scrollable>
            
            </section>
           
            
            

            `,
    styleUrls: ['../../../src/css/mm-editor.component.css'],
    providers: [HTTPPurchaseService, HTTPStockService]

})
export class MMEditor implements OnInit{
    @Output() refresh = new EventEmitter();

    inputPOId: number;
    employees: Employee[];
    poItems: POItem[];
    disabled = false;
    onRemoveDisabled = true;
    stockResult: Stock[] = [];

    selectedPoItem: POItem;
    selectedEmployee: Employee = new Employee;
    itemVendorNum: string;
    quantity: number;
    createTime: string;
    remark: string = '';

    displayStockOuts: StockOut[] = [];
    newStockOuts: StockOut[] = [];
    temp: StockOut[] = [];
    selectionIndexes: number[] = [];








    constructor(private _httpPurchaseService: HTTPPurchaseService, private _httpStockService: HTTPStockService) {}


    ngOnInit():any {
        this._httpPurchaseService.getEmployees().subscribe(
            data => {
                this.employees = data;
                // console.log(this.employees);
            },
            error => console.log(error),
            () => console.log("getEmployees Finished")
        );
        this.quantity = 0;
    }

    onNext() {
        // console.log(this.inputPOId);
        if (this.inputPOId > 0) {
            this.disabled = true;
            this.getPoItems(this.inputPOId);
            // console.log(this.selectedPoItem);
            // console.log(this.stockResult);

        }
    }

    onEnter (e) {
        console.log(e.keyCode);
        if (this.inputPOId > 0) {
            this.disabled = true;
            this.getPoItems(this.inputPOId);
            // console.log(this.selectedPoItem);
            // console.log(this.stockResult);

        }
    }

    onClose() {
        this.disabled = false;
        this.itemVendorNum = null;
        this.quantity = 0;
        this.selectedEmployee = new Employee;
        this.displayStockOuts = [];
        this.newStockOuts = [];
        this.remark = null;
        this.temp = [];
    }

    getPoItems(poId) {
        this._httpPurchaseService.getPoItemsByPo(poId).subscribe(
            data => {
                this.poItems = data;
                console.log(data);
            },
            error =>  console.log(error) //error case
        );
    }

    onEmployeeSelected(e) {
        console.log(e.detail.value);
        this.selectedEmployee.firstName = e.detail.value;
    }

    onPoItemSelected(selection) {
        //in case of selection.detail is null
        if (selection.detail.value !== null){
            this.selectedPoItem = selection.detail.value;
            this.itemVendorNum = selection.detail.value.item.itemVendorNum;
        }
    }

    cleanUpPreEvent() {
        this.displayStockOuts = [];
    }

    onAdd() {
        // console.log(this.selectedEmployee);
        // console.log(this.selectedPoItem);
        // console.log(this.createTime );

        if (
            this.selectedEmployee.firstName !== null &&
            this.selectedPoItem !== undefined &&
            this.createTime !== undefined &&
            this.quantity > 0
        ) {
            this.temp.push(new StockOut(
                this.employees.filter((employee: Employee) => employee.firstName === this.selectedEmployee.firstName)[0],
                this.selectedPoItem.item,
                this.selectedPoItem.purchaseOrder,
                -this.quantity,
                moment(this.createTime).valueOf(),
                this.remark
            ));
            this.newStockOuts.push(new StockOut(
                this.employees.filter((employee: Employee) => employee.firstName === this.selectedEmployee.firstName)[0],
                this.selectedPoItem.item,
                this.selectedPoItem.purchaseOrder,
                -this.quantity,
                moment(this.createTime).valueOf(),
                this.remark
            ));
        }


        this.displayStockOuts = this.temp;
        console.log("newStockOuts: "+this.newStockOuts);
        console.log("displayStockOuts: "+this.displayStockOuts);

    }

    onRemove() {
        console.log("onRemove");
        console.log(this.selectionIndexes);
        console.log("newStockOuts: "+this.newStockOuts);
        console.log("displayStockOuts: "+this.displayStockOuts);
        this.displayStockOuts = this.temp;
        if(this.selectionIndexes !== undefined) {
            if(this.selectionIndexes.length > 0) {

                let tempAll = this.temp.slice();
                for(let i=this.selectionIndexes.length-1; i>=0; i--) {
                    // console.log(this.temp);
                    // console.log("1------- "+i);
                    this.displayStockOuts = tempAll.filter((stockout) =>
                        tempAll.indexOf(stockout) === this.selectionIndexes[i]
                    );
                    // console.log(this.displayStockOuts[0]);
                    // console.log("*************");
                    this.temp.splice(this.temp.indexOf(this.displayStockOuts[0]), 1);
                }
                this.displayStockOuts = this.temp;

                let tempAll2 = this.newStockOuts.slice();
                for(let i=this.selectionIndexes.length-1; i>=0; i--) {
                    // console.log(this.temp);
                    // console.log("1------- "+i);
                    let selectedArray = tempAll2.filter((stockout) =>
                        tempAll2.indexOf(stockout) === this.selectionIndexes[i]
                    );
                    // console.log("*************");
                    this.newStockOuts.splice(this.newStockOuts.indexOf(selectedArray[0]), 1);
                }

                console.log("newStockOuts: "+this.newStockOuts);
                console.log("displayStockOuts: "+this.displayStockOuts);



                this.selectionIndexes = [];
                this.onRemoveDisabled = true;

            }
        }

    }

    onSelected(grid) {
        console.log(grid);
        console.log("out selected: "+grid.selection.selected());


        if (grid.selection.selected().length > 0) {
            // grid.selection.clear();
            this.onRemoveDisabled = false;
            this.selectionIndexes = grid.selection.selected();
            console.log(">0 selected: "+grid.selection.selected());
            console.log(">0 deselected: "+grid.selection.deselected());
            console.log("this.selectionIndexes: "+this.selectionIndexes);
        } else {
            this.onRemoveDisabled = true;
            console.log("=0 selected: "+grid.selection.selected());
            // this.selectionIndexes = grid.selection.selected();
        }
    }

    onSubmit() {
        console.log("onSubmit");
        console.log(this.newStockOuts);
        console.log(this.displayStockOuts);

        if (this.newStockOuts.length > 0) {

            let checkResult = [];
            for (var stockOut in this.newStockOuts) {
                for (var stock in this.stockResult) {
                    if (this.newStockOuts[stockOut].item.itemId === this.stockResult[stock].item.itemId) {
                        if (this.stockResult[stock].quantity < 1 || (this.stockResult[stock].quantity + this.newStockOuts[stockOut].quantity) < 0) {
                            // console.log(-this.newStockOuts[stockOut].quantity);
                            // console.log(this.stockResult[stock].quantity);
                            checkResult.push(this.stockResult[stock].item.itemName + "當前庫存為" + this.stockResult[stock].quantity + "，出庫數量為" + -this.newStockOuts[stockOut].quantity);
                        }
                    }
                }
            }

            if (checkResult.length > 0) {
                console.log(checkResult);
                alert(checkResult.join(" ---> 庫存不足\n") + " ---> 庫存不足");
            } else {
                this._httpStockService.postStockOutAll(this.newStockOuts).subscribe(
                    data => {
                        console.log(data);
                        this.refresh.emit('');
                    },
                    error => alert(error),
                    () => console.log("post Finished")
                );

                //Initialize every variable
                this.onClose();
            }
        } else {
            alert("你沒有選擇任何出庫項目，請加入項目後再送出。");
        }





    }


}

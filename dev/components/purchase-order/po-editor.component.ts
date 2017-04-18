import {Component, OnInit, EventEmitter, Output} from "angular2/core";
import {Employee} from "../../domain/employee";
import {HTTPPurchaseService} from "../../services/http-service/http-purchase.service";
import {Vendor} from "../../domain/vendor";
import {Item} from "../../domain/item";
import {PurchaseOrder} from "../../domain/purchase-order";
import {POItem} from "../../domain/po-item";
import {ItemUnit} from "../../domain/item-unit";
import {POStatus} from "../../domain/po-status";
@Component({
    selector: 'po-editor',
    template: `
            <div class="main-layout">
                <h2>創建訂購單</h2>
                <paper-icon-button icon="close" dialog-dismiss></paper-icon-button>
            </div>
            
            <!--Combo-Box: 供應商-->
            <vaadin-combo-box label="選擇供應商" [items]="vendors" item-label-path="vendorName" item-value-path="vendorName"
                    (value-changed)="onVendorSelect($event)"  [disabled]="disabled"></vaadin-combo-box>
           
            <!--Available at first-->
            <paper-button raised [disabled]="disabled" (click)="onNext()" >下一步</paper-button>
           
            <!--Unavailable at first-->
            <paper-button raised [disabled]="!disabled" (click)="onChangedVendor()">重選供應商</paper-button>
            
            
            <!--  Hidden at first from Here to End --> 
            <!-- 選擇供應商後顯示 -->  
            <section *ngIf="disabled !== false">
            <!--<section>-->
            
                <!--1. 員工、稅-->
                <div class="edit-layout">
                    <!--Combo-Box: 員工-->
                    <vaadin-combo-box label="員工名稱" [items]="employees" item-label-path="firstName" item-value-path="firstName"
                                      (value-changed)="onEmployeeSelected($event)" ></vaadin-combo-box>
                    <!--Input: 稅, 2-way-data-binding -->
                    <paper-input  style="padding-left: 20px" label="稅" type="number"
                                 [(ngModel)]="newPurchaseOrder.tax" ngDefaultControl >
                    </paper-input>
                </div>
                
                <!--2. 相關物料、數量-->
                <div class="edit-layout">
                    <!--Combo-Box: 物料-->
                    <vaadin-combo-box label="相關物料" [items]="items" item-label-path="itemName" item-value-path="itemPrice"
                                      (selected-item-changed)="onItemSelected($event)" ></vaadin-combo-box>
                    <!--Input: 數量, 2-way-data-binding -->
                    <paper-input label="數量" type="number" auto-validate allowed-pattern="^[0-9][0-9]*$" error-message="number only!"
                                 style="padding-left: 20px" [(ngModel)]="quantity" ngDefaultControl >
                    </paper-input>
                </div>
                
                <!--3. 物料編號-->
                <div class="edit-layout">
                    <!--Checkbox: 不要入庫-->
                    <paper-checkbox style="padding-top: 13px; padding-right: 20px" (change)="stockWhether = $event.target.checked" name="stockWhether">不要入庫</paper-checkbox>
                    <p>物料料號： {{itemVendorNum}} </p>
                </div>
                
                <!--4. 單價、單位-->
                <div class="edit-layout">
                        <!--按下"+": display temp2-->
                        <paper-icon-button icon="add" (mousedown)="cleanUpPreEvent()" (mouseup)="addPoItem()"></paper-icon-button>
                        <paper-icon-button icon="remove" (mousedown)="cleanUpPreEvent()" (mouseup)="removePoItem()"></paper-icon-button>
                        <p style="padding-left: 20px" >單價： {{price}} </p>
                        <p style="margin-left: 20px">單位： {{itemUnit.unitName}}</p>                    
                </div>
                
                <!--5. 顯示新增的採購清單-->
                <div>
                    <vaadin-grid #grid [items]="DisplayNewPoItems" selection-mode="multi" visible-rows="3" (selected-items-changed)="selected(grid)">
                        <table>
                            <colgroup>
                                <col name="item.itemName">
                                <col name="quantity">
                                <col name="price">
                                <col name="item.itemVendorNum">
                            </colgroup>
                        </table>
                    </vaadin-grid>
                </div>
                
            <!--6. 送出新增的採購清單-->
            <paper-button raised class="submit-button"
                    [disabled]="selectedEmployee.firstName === null || selectedItem.itemName === null || quantity <= 0"  
                    (mousedown)="onSubmitPo()" (click)="onSubmitPoItem()">Submit
            </paper-button>
            
            </section>
            
            

            `,
    styleUrls: ['../../../src/css/po-editor.component.css'],
    providers: [HTTPPurchaseService]

})
export class POEditor implements OnInit{
    @Output() refresh: EventEmitter<any> = new EventEmitter();

    vendors: Vendor[];
    employees: Employee[];
    items: Item[];              //相關物料
    temp: POItem[] = [];        //Display 所新增的暫存
    temp2: POItem[] = [];       //空物件, 負責清除用
    temp3: POItem[] = [];       //newPoItem 的暫存

    selectedVendor: Vendor = new Vendor;
    selectedItem: Item = new Item;
    selectedEmployee: Employee = new Employee;
    stockWhether: Boolean;

    DisplayNewPoItems: POItem[] = [];   //顯示用
    newPoItems: POItem[] = [];      //POST 用

    price: number;
    itemVendorNum: string;
    itemUnit: ItemUnit = new ItemUnit;
    quantity: number;
    selection: number[];

    disabled = false;

    public newPurchaseOrder: PurchaseOrder = new PurchaseOrder();

    constructor(private _httpPurchaseService: HTTPPurchaseService) {}

    ngOnInit():any {
        //GET 供應商(全)
        this._httpPurchaseService.getVendors().subscribe(
            data => {
                this.vendors = data;
                console.log(this.vendors);
            },
            error => alert(error), //error case
            () => console.log("Finished") //pass a function when everything is completed
        );

        //GET 員工(全)
        this._httpPurchaseService.getEmployees().subscribe(
            data => {
                this.employees = data;
                console.log(this.employees);
            },
            error => alert(error),
            () => console.log("getEmployees Finished")
        );

    }

    onVendorSelect(e) {
        // console.log(e.detail.value);
        this.selectedVendor.vendorName = e.detail.value;
    }

    //GET 供應商的物料(相關物料)
    onNext() {
        // console.log(this.selectedVendor.vendorName);

        if (this.selectedVendor.vendorName !== null) {
            this._httpPurchaseService.getItemsByVendor(this.selectedVendor.vendorName).subscribe(
                data => {
                    this.items = data;
                    // console.log(this.items);
                },
                error => alert(error),
                () => console.log("getItems Finished")
            );
            this.disabled = true;
        }
    }

    //供應商改變, temp, temp3 RESET
    onChangedVendor() {
        this.disabled = false;
        this.selectedEmployee = new Employee;
        this.selectedItem = new Item;
        this.newPurchaseOrder = new PurchaseOrder();
        this.price = null;
        this.itemVendorNum = null;
        this.itemUnit = new ItemUnit;
        this.quantity = null;

        this.temp = [];         //Reset 顯示的暫存
        this.temp3 = [];        //Rest new PoItem 的暫存
        this.DisplayNewPoItems = [];
        this.newPoItems = [];
    }

    onEmployeeSelected(e) {
        // console.log(e.detail.value);
        this.selectedEmployee.firstName = e.detail.value;
    }


    onItemSelected(selection) {
        //in case of selection.detail is null
        if (selection.detail.value !== null){
            this.selectedItem = selection.detail.value;
            this.price = selection.detail.value.itemPrice;
            this.itemVendorNum = selection.detail.value.itemVendorNum;
            this.itemUnit = selection.detail.value.itemUnit;
        }
    }

    //增加採購單, newPoItems = temp3, DisplayNewPoItem =  temp
    addPoItem() {
        // console.log("addPoItem");

        //selectedItem有選, 數量>0
        if (this.selectedItem.itemName !== null && this.quantity > 0) {
            //temp有東西,
            if (this.temp.length > 0 && (this.selectedItem.itemId !== this.temp[this.temp.length-1].item.itemId)) {
                this.temp3.push(new POItem(this.selectedItem, this.quantity, this.price*this.quantity));
                this.temp.push(new POItem(this.selectedItem, this.quantity, this.price*this.quantity));
                // console.log(new POItem(this.selectedItem, this.quantity, this.refPrice*this.quantity));
                // this.DisplayNewSoItems.push(new POItem(this.selectedItem, this.quantity, this.refPrice*this.quantity));


                // console.log(this.temp3[0]);
                // console.log(this.DisplayNewSoItems);
                // console.log(this.temp[0]);
                // console.log("***************");

            } else if(this.temp.length === 0) {     //就算沒有也放進去
                this.temp3.push(new POItem(this.selectedItem, this.quantity, this.price*this.quantity));
                this.temp.push(new POItem(this.selectedItem, this.quantity, this.price*this.quantity));
                // console.log(new POItem(this.selectedItem, this.quantity, this.refPrice*this.quantity));
                // this.DisplayNewSoItems.push(new POItem(this.selectedItem, this.quantity, this.refPrice*this.quantity));

                // console.log(this.temp3[0]);
                // console.log(this.DisplayNewSoItems);
                // console.log(this.temp[0]);
                // console.log("***************");
            }
        }
        this.newPoItems = this.temp3;            //newPoItems = temp3
        this.DisplayNewPoItems = this.temp;      //DisplayNewPoItems = temp

        // console.log(this.newPoItems);
        // console.log(this.DisplayNewPoItems);

    }

    removePoItem() {
        console.log("removeSoItem");
        // this.DisplayNewPoItems = this.temp;
        if(this.selection !== undefined && this.selection.length>0) {

                let tempAll = this.temp.slice();            //clone
                for(let i=this.selection.length-1; i>=0; i--) {     //每刪一個index會變
                    // console.log(this.temp);
                    // console.log("1------- "+i);
                    this.DisplayNewPoItems = tempAll.filter((stockout) =>
                        tempAll.indexOf(stockout) === this.selection[i]
                    );
                    // console.log(this.DisplayNewPoItems[0]);
                    // console.log("*************");
                    this.temp.splice(this.temp.indexOf(this.DisplayNewPoItems[0]), 1);  //刪一個

                    console.log("newPoItems: "+this.newPoItems);
                }
                this.DisplayNewPoItems = this.temp;

                let tempAll2 = this.newPoItems.slice();     //clone tempALL2
                for(let i=this.selection.length-1; i>=0; i--) {
                    // console.log(this.temp);
                    // console.log("1------- "+i);
                    let selectedArray = tempAll2.filter((stockout) =>
                        tempAll2.indexOf(stockout) === this.selection[i]
                    );
                    // console.log("*************");
                    this.newPoItems.splice(this.newPoItems.indexOf(selectedArray[0]), 1);   //刪一個
                }
                console.log("newPoItems: "+this.newPoItems);

                this.selection = [];
        }
    }

    cleanUpPreEvent() {
        // console.log("cleanUpPreEvent");
        this.DisplayNewPoItems = this.temp2;            //DisplayNewPoItems = temp2
    }

    //POST 新增的採購單
    onSubmitPo() {
        console.log("onSubmitPo");
        this.newPurchaseOrder.employee = this.employees.filter((employee: Employee) => employee.firstName === this.selectedEmployee.firstName)[0];
        this.newPurchaseOrder.vendor = this.vendors.filter((vendor: Vendor) => vendor.vendorName === this.selectedVendor.vendorName)[0];
        this.newPurchaseOrder.poStatus = new POStatus();
        this.newPurchaseOrder.stockWhether = !this.stockWhether;
        this.DisplayNewPoItems.map(element => {
            this.newPurchaseOrder.amount += element.price;
        });

        if (this.newPurchaseOrder.tax !== null || this.newPurchaseOrder.tax !== 0) {
            this.newPurchaseOrder.amount += this.newPurchaseOrder.amount*(this.newPurchaseOrder.tax);
            // console.log(this.newPurchaseOrder.amount);
        }
        console.log(this.DisplayNewPoItems);
        console.log(this.newPoItems);

        this._httpPurchaseService.postPurchaseOrder(this.newPurchaseOrder, this.newPoItems).subscribe(
            data => {
                console.log(data);
            },
            error => alert(error),
            () => console.log("post Test Finished")
        );




        console.log("*********************");
        console.log(this.newPurchaseOrder);

    }

    //初始化所有變數
    onSubmitPoItem() {
        console.log("onSubmitPoItem");
        console.log(this.DisplayNewPoItems);

        // if (this.DisplayNewSoItems[0].purchaseOrder === null) {
        //     console.log("2222222222");
        //     console.log(this.newPurchaseOrder);
        //     this.DisnewSalesOrderorEach(poItem => {
        //         console.log("poItem:   "+poItem);
        //         poItem.purchaseOrder = this.newPurchaseOrder;
        //         this.newSalesOrderm)
        //     });
        // }


        //initialize every variable
        this.disabled = false;
        this.selectedEmployee = new Employee;
        this.selectedItem = new Item;
        this.newPurchaseOrder = new PurchaseOrder;
        this.price = null;
        this.itemVendorNum = null;
        this.itemUnit = new ItemUnit;
        this.quantity = null;
        this.temp = [];
        this.temp3 = [];
        this.DisplayNewPoItems = [];
        this.newPoItems = [];
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

import {Component, OnInit} from "angular2/core";
import {Router} from "angular2/router";
import {MealMenu} from "../../domain/meal-menu";
import {Employee} from "../../domain/employee";
import {MealOrder} from "../../domain/meal-order";
import {HTTPMealService} from "../../services/http-service/http-meal.service";

@Component({
    selector: 'new-meal-order',
    template: `
            <!--顯示員工, 事件(selected-item-changed): onEmplyeeChanged($event)-->
            <div>
                <vaadin-combo-box label="Employee Names" [items]="employees" item-label-path="firstName" item-value-path="firstName" 
                (selected-item-changed)="onEmployeeChanged($event)" ></vaadin-combo-box>
            </div>
            <!--顯示菜單, 事件(selected-item-changed): onMenuChanged($event), 2-way data binding: 價錢-->
            <div>
                <vaadin-combo-box label="Meal Menus" [items]="mealMenus" item-label-path="itemName" item-value-path="itemPrice" 
                (selected-item-changed)="onMenuChanged($event)" ></vaadin-combo-box>
                <p>Price: {{price}}</p>
            </div>
            
            <!--輸入數量: 2-way data binding-->
            <div>
                <paper-input label="Quantity" type="number" auto-validate allowed-pattern="^[0-9][0-9]*$" error-message="number only!"
                             [(ngModel)]="newMealOrder.quantity" ngDefaultControl >
                </paper-input>
            </div>
            
            <!--Remark: 2-way data binding-->
            <div>
                <paper-input label="Remark" type="text"
                             [(ngModel)]="newMealOrder.remark" ngDefaultControl >
                </paper-input>
            </div>
            
            <!--送出: 引導至meal-finished頁面-->
            <paper-button raised 
                [disabled]="selectedEmployee.firstName === null || selectedMenu.itemName === null || newMealOrder.quantity <= 0"  
                (click)="onSubmit()">Submit Order
            </paper-button>
            
    `,
    inputs: ["shop"],
    styles: [`
            paper-button {
                margin-top: 10px;
                width: 300px;
            }
    `]

})
export class NewMealOrderComponent implements OnInit{

    public shop: MealShop;
    mealMenus: MealMenu[];
    employees: Employee[];
    selectedMenu: MealMenu = new MealMenu;
    selectedEmployee: Employee = new Employee;
    price: number;

    public newMealOrder: MealOrder = new MealOrder();

    constructor(private _httpMealService: HTTPMealService, private _router: Router) {};

    //OnInit: GET 員工資料, 選擇餐廳的菜單
    ngOnInit():any {
        this._httpMealService.getEmployees().subscribe(
            data => {
                this.employees = data;
                // console.log(this.employees);
            },
            error => console.log(error),
            () => console.log("getEmployees Finished")
        );
        this._httpMealService.getShopMenus(this.shop.shopName).subscribe(
            data => {
                this.mealMenus = data;
                // console.log(this.mealMenus);
            },
            error => console.log(error),
            () => console.log("getShopMenus Finished")
        );

    }

    //換員工
    onEmployeeChanged(selection) {
        if (selection.detail.value !== null){
            this.selectedEmployee = selection.detail.value;
        }
    }

    //換菜單
    onMenuChanged(selection) {
        //in case of selection.detail is null
        if (selection.detail.value !== null){
            this.selectedMenu = selection.detail.value;
            this.price = selection.detail.value.itemPrice;
        }
    }

    //Post 點餐內容至後端, route 到meal-finished 顯示點餐內容
    onSubmit() {
        this.newMealOrder.employee = this.selectedEmployee;
        this.newMealOrder.shopMenu = this.selectedMenu;
        this.newMealOrder.totalPrice = this.newMealOrder.quantity * this.price;
        // console.log(this.newMealOrder);
        this._httpMealService.postMealOrder(this.newMealOrder).subscribe(
            data => {
                this._router.navigate(['MealFinished', data]);
            },
            error => alert(error),
            () => console.log("postMealOrder Finished")
        );
    }
}


import {Component, OnInit} from "angular2/core";
import {Router, RouteParams} from "angular2/router";
import {MealOrder} from "../../domain/meal-order";

@Component({
    selector: 'meal-finished',
    template: `

            
            <!--顯示訂單資料-->
            <div align="center">
                <paper-card heading="Meal Order" >
                    <table>
                        <tr>
                            <td>訂購人：</td>
                            <td>{{mealOrder.employee.firstName}}</td>
                        </tr>
                        <tr>
                            <td>訂購品項：</td>
                            <td>{{mealOrder.shopMenu.itemName}}</td>
                        </tr>
                        <tr>
                            <td>訂購時間：</td>
                            <td>{{date | date: 'medium'}}</td>
                        </tr>
                        <tr>
                            <td>訂購數量：</td>
                            <td>{{mealOrder.quantity}}</td>
                        </tr>
                        <tr>
                            <td>總金額：</td>
                            <td>{{mealOrder.totalPrice}}</td>
                        </tr>
                        <tr *ngIf="mealOrder.remark !== null">
                            <td>備註：</td>
                            <td >{{mealOrder.remark}}</td>
                        </tr>
                    </table>                    
                </paper-card>
                
                <!--返回至meal-list-->
                <div>
                    <paper-button (click)="onSubmit()">back</paper-button>
                </div>
            </div>
            
            <!--paper-toast顯示於左下方-->
            <paper-toast id="toast0" text="Your meal order has been sent to the AN-HE wonderland!!!" opened></paper-toast>



            `,
    styles: [`
            paper-card {
                width: 100%;
                height: 250px;
                /*background-color: #1a237e;*/
            }
            paper-button {
                margin-top: 20px;
                background-color: #1a237e;
                color: lightgrey;
                width: 70%;
            }
        `]

})


export class MealFinishedComponent implements OnInit{

    date: Date;
    mealOrder: MealOrder = new MealOrder;
    on: boolean = false;

    constructor(private _router: Router, private _routeParams: RouteParams) {};

    ngOnInit():any {

        //用roteParams傳點餐的內容
        this.mealOrder = <MealOrder><any>this._routeParams.params;
        this.date = new Date(this.mealOrder.orderTime);
        // console.log(this.mealOrder);
        // console.log(this.date);
    }

    onSubmit() {
        this._router.navigate(['MealList']);
    }



}


import {Component, OnInit} from 'angular2/core';
import {HTTPMealService} from "../../services/http-service/http-meal.service";
import {NewMealOrderComponent} from "./new-meal-order.component";





@Component({
    selector: 'meal-list',
    template: `

            <!--Navigation Bar-->
            <paper-toolbar>
                <paper-icon-button icon="menu" paper-drawer-toggle></paper-icon-button>
                <span class="title">Meal</span>
            </paper-toolbar>
            
            <div class="meal-layout">
                <h3>Select meal shop</h3>             
               
                <!--事件(selected-item-changed): 選擇的商店 = 事件的value -->
                <vaadin-combo-box label="Shop Name" [items]="shops" item-label-path="shopName" item-value-path="shopName"
                                  (selected-item-changed)="selectedShop=$event.detail.value" [disabled]="disabled"></vaadin-combo-box>

                <!--<vaadin-combo-box label="Language" [items]="languages" (selected-item-changed)="selectedLanguage=$event.detail.value"></vaadin-combo-box>-->
                <!--<p>Language: {{selectedLanguage}}</p>-->
                
                <!--Available at first-->
                <paper-button raised [disabled]="disabled" (click)="onNext()" >Next</paper-button>
                <!--Unavailable at first, 當選好餐廳時才會顯示-->
                <paper-button raised [disabled]="!disabled"(click)="onChangedShop()">Change shop</paper-button>
                
                <!--Hidden at first, 當選好餐廳時才會顯示-->
                <new-meal-order *ngIf="disabled !== false" [shop]="selectedShop"></new-meal-order>
            </div>
            
            
            
    `,
    directives: [NewMealOrderComponent],
    styles: [`
        paper-toolbar {
            background-color: purple;
        }
        .meal-layout {
            margin: 20px;
        }
        vaadin-combo-box {
            max-width: 300px;
            margin: 0px;
            padding: 0px;
        }
        paper-button {
            margin-top: 10px;
            width: 300px;
        }
        /*.meal-layout {*/
            /*background: #000000 url("../assets/img/skystar.jpeg") top;*/
        /*}*/   
        
    `],
    providers: [HTTPMealService]

})
export class MealListComponent implements OnInit{
    shops: MealShop[];

    selectedShop:MealShop = <MealShop>{ shopName: null, shopTelephone: null};
    disabled = false;

    constructor(private _httpMealService: HTTPMealService) {}

    ngOnInit():any {        //OnInit : Get 餐廳名稱, 並存到shops
        this._httpMealService.getShops().subscribe(
            data => {
                this.shops = data;
                // console.log(this.shops);
            },
            error => alert(error), //error case
            () => console.log("Finished")
        );
    }

    onNext() {      //確實選擇了餐廳, 按了onNext, 就不能再選餐廳(除非按onChangedShop)
        // console.log(this.selectedShop.shopName);
        if (this.selectedShop.shopName !== null) {
            this.disabled = true;
        }

    }

    onChangedShop() {
        this.disabled = false;
    }


}

import {Component, EventEmitter, Output, OnInit} from "angular2/core";
import {HTTPMealService} from "../../services/http-service/http-meal.service";
import {Employee} from "../../domain/employee";
import {ItemCategory} from "../../domain/item-category";
import {HTTPStockService} from "../../services/http-service/http-stock.service";

@Component({
    selector: 'mm-recordlist-filter',
    template: `   
   
            <div class="toolbar" (click)="toggleFilters = !toggleFilters" [ngClass]="{open: toggleFilters}">
                Filters
                <iron-icon icon="filter-list"></iron-icon>
            </div>
            <div  class="filters" [ngClass]="{open: toggleFilters}">
                <div class="row">
                    <div class="dates col">
                        <vaadin-date-picker label="After" (value-changed)="filters.after = $event.detail.value; filtersChanged()"></vaadin-date-picker>
                        <vaadin-date-picker label="Before" (value-changed)="filters.before = $event.detail.value; filtersChanged()"></vaadin-date-picker>
                    </div>
                    <!--<div class="merchants col">-->
                        <!--<vaadin-combo-box class="merchants"></vaadin-combo-box>-->
                    <!--</div>-->
                </div>
                <div class="row">
                    <div class="amounts col">
                        <paper-input placeholder="搜尋物料名稱" (keyup)="filters.itemName = $event.target.value; filtersChanged();"></paper-input>
                        <vaadin-combo-box label="選擇分類" [items]="itemCategories" item-label-path="categoryName" item-value-path="categoryName"
                                          (value-changed)="filters.categoryName = $event.detail.value; filtersChanged();"  [disabled]="disabled"></vaadin-combo-box>
                        
                        <vaadin-combo-box label="選擇負責人" [items]="employees" item-label-path="firstName" item-value-path="firstName"
                                          (value-changed)="filters.firstName = $event.detail.value; filtersChanged();"  [disabled]="disabled"></vaadin-combo-box>
                    </div>
                    <div class="checkboxes col">
                        <paper-checkbox [disabled]="finishedProductDisabled" (change)="updateStatus($event); filtersChanged();" name="finishedProduct">成品</paper-checkbox>
                        <paper-checkbox [disabled]="rawMaterialDisabled" (change)="updateStatus($event); filtersChanged();" name="rawMaterial">原物料</paper-checkbox>
                    </div>
                </div>
            </div>
    `,
    styleUrls: ['../../../src/css/so-search-filter.component.css'],
    providers: [HTTPMealService, HTTPStockService]
})

export class MMRecordListFilter implements OnInit{
    @Output() filtersChange:EventEmitter<any> = new EventEmitter();

    filters: any = {};
    employees: Employee[];
    itemCategories: ItemCategory[];


    finishedProductDisabled: boolean = false;
    rawMaterialDisabled: boolean = false;

    constructor(private _httpMealService: HTTPMealService, private _httpStockService: HTTPStockService) {}

    ngOnInit():any {
        this._httpMealService.getEmployees().subscribe(
            data => {
                this.employees = data;
                // console.log(this.employees);
            },
            error => alert(error), //error case
            () => console.log("Finished") //pass a function when everything is completed
        );
        this._httpStockService.getItemCategorys().subscribe(
            data => {
                this.itemCategories = data;
                // console.log(this.distributors);
            },
            error => alert(error), //error case
            () => console.log("Finished") //pass a function when everything is completed
        );

    }

    private updateStatus(e) {
        const status = e.target.name;
        const toggle = e.target.checked;


        switch (status) {
            case "finishedProduct":
                this.rawMaterialDisabled = !!toggle;
                this.filters.status = {name: status, toggle: toggle};
                break;
            case "rawMaterial":
                this.finishedProductDisabled = !!toggle;
                this.filters.status = {name: status, toggle: toggle};
                break;
        }
    }


    private filtersChanged() {
        this.filtersChange.emit(this.filters);
    }


}

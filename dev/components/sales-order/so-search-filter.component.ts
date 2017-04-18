import {Component, EventEmitter, Output, OnInit} from "angular2/core";
import {HTTPMealService} from "../../services/http-service/http-meal.service";
import {Employee} from "../../domain/employee";
import {Distributor} from "../../domain/distributor";
import {HTTPSalesService} from "../../services/http-service/http-sales.service";

@Component({
    selector: 'so-search-filter',
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
                        <!--<paper-input placeholder="搜尋供應商" (keyup)="filters.coName = $event.target.value; filtersChanged();"></paper-input>-->
                        <vaadin-combo-box label="選擇經銷商" [items]="distributors" item-label-path="dtName" item-value-path="dtName"
                                          (value-changed)="filters.dtName = $event.detail.value; filtersChanged();"  [disabled]="disabled"></vaadin-combo-box>
                        
                        <vaadin-combo-box label="選擇負責人" [items]="employees" item-label-path="firstName" item-value-path="firstName"
                                          (value-changed)="filters.firstName = $event.detail.value; filtersChanged();"  [disabled]="disabled"></vaadin-combo-box>
                    </div>
                    <div class="checkboxes col">
                        <paper-checkbox [disabled]="executedDisabled" (change)="updateStatus($event); filtersChanged();" name="executed">未執行</paper-checkbox>
                        <paper-checkbox [disabled]="goodReceiptDisabled" (change)="updateStatus($event); filtersChanged();" name="goodReceipt">未出貨</paper-checkbox>
                        <paper-checkbox [disabled]="paymentDisabled" (change)="updateStatus($event); filtersChanged();" name="payment">未收款</paper-checkbox>
                    </div>
                </div>
            </div>
    `,
    styleUrls: ['../../../src/css/so-search-filter.component.css'],
    providers:[HTTPMealService, HTTPMealService]
})

export class SOSearchFilter implements OnInit{
    @Output() filtersChange = new EventEmitter();

    filters: any = {};
    employees: Employee[];
    distributors: Distributor[];


    executedDisabled: boolean = false;
    goodReceiptDisabled: boolean = false;
    paymentDisabled: boolean = false;

    constructor(private _httpMealService: HTTPMealService, private _httpSalesService: HTTPSalesService) {}

    ngOnInit():any {
        this._httpMealService.getEmployees().subscribe(
            data => {
                this.employees = data;
                // console.log(this.employees);
            },
            error => alert(error), //error case
            () => console.log("Finished") //pass a function when everything is completed
        );
        this._httpSalesService.getDistributors().subscribe(
            data => {
                this.distributors = data;
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
            case "executed":
                if (toggle) {
                    this.goodReceiptDisabled = true;
                    this.paymentDisabled = true;
                    this.filters.status = {name: status, toggle: toggle};
                } else {
                    this.goodReceiptDisabled = false;
                    this.paymentDisabled = false;
                    this.filters.status = {name: status, toggle: toggle};
                }
                break;
            case "payment":
                if (toggle) {
                    this.goodReceiptDisabled = true;
                    this.executedDisabled = true;
                    this.filters.status = {name: status, toggle: toggle};

                } else {
                    this.goodReceiptDisabled = false;
                    this.executedDisabled = false;
                    this.filters.status = {name: status, toggle: toggle};

                }
                break;

            case "goodReceipt":
                if (toggle) {
                    this.executedDisabled = true;
                    this.paymentDisabled = true;
                    this.filters.status = {name: status, toggle: toggle};

                } else {
                    this.executedDisabled = false;
                    this.paymentDisabled = false;
                    this.filters.status = {name: status, toggle: toggle};

                }
                break;

        }
    }

    private filtersChanged() {
        this.filtersChange.emit(this.filters);
    }


}

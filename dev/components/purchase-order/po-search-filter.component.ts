import {Component, EventEmitter, Output, OnInit} from "angular2/core";
import {Vendor} from "../../domain/vendor";
import {HTTPPurchaseService} from "../../services/http-service/http-purchase.service";
import {HTTPMealService} from "../../services/http-service/http-meal.service";
import {Employee} from "../../domain/employee";

@Component({
    selector: 'po-search-filter',
    template: `   
            <!---->
            <div class="toolbar" (click)="toggleFilters = !toggleFilters" [ngClass]="{open: toggleFilters}">
                Filters
                <iron-icon icon="filter-list"></iron-icon>
            </div>
            
            
            <div  class="filters" [ngClass]="{open: toggleFilters}">
            
                <!--1. 月曆(After、Before)-->
                <div class="row">
                    <div class="dates col">
                        <!--After, 事件(value-changed): value 存到filters.after-->
                        <vaadin-date-picker label="After" (value-changed)="filters.after = $event.detail.value; filtersChanged()"></vaadin-date-picker>
                        <!--Before, 事件(value-changed): value 存到filters.before-->
                        <vaadin-date-picker label="Before" (value-changed)="filters.before = $event.detail.value; filtersChanged()"></vaadin-date-picker>
                    </div>
                    <!--<div class="merchants col">-->
                        <!--<vaadin-combo-box class="merchants"></vaadin-combo-box>-->
                    <!--</div>-->
                </div>
                
                <!--2 供應商、負責人、checkboxes(未執行, 未到獲, 未付款)-->
                <div class="row">
                    <div class="amounts col">
                        <!--<paper-input placeholder="搜尋供應商" (keyup)="filters.coName = $event.target.value; filtersChanged();"></paper-input>-->
                        
                        <!--1. 供應商, 事件(value-changed): value 存到 filters.vendorName-->
                        <vaadin-combo-box label="選擇供應商" [items]="vendors" item-label-path="vendorName" item-value-path="vendorName"
                                          (value-changed)="filters.vendorName = $event.detail.value; filtersChanged();"  [disabled]="disabled"></vaadin-combo-box>
                        <!--2. 負責人, 事件(value-changed): value 存到 filters.firstname-->
                        <vaadin-combo-box label="選擇負責人" [items]="employees" item-label-path="firstName" item-value-path="firstName"
                                          (value-changed)="filters.firstName = $event.detail.value; filtersChanged();"  [disabled]="disabled"></vaadin-combo-box>
                    </div>
                    
                    
                    <div class="checkboxes col">
                        <!--1. 未執行, 事件(change) = udpateStatus($event)-->
                        <paper-checkbox [disabled]="executedDisabled" (change)="updateStatus($event); filtersChanged();" name="executed">未執行</paper-checkbox>
                        <!--2. 未到貨, 事件(change) = updateStatus($event)-->
                        <paper-checkbox [disabled]="goodReceiptDisabled" (change)="updateStatus($event); filtersChanged();" name="goodReceipt">未到貨</paper-checkbox>
                        <!--3. 未付款, 事件(change) = updateStatus($event)-->
                        <paper-checkbox [disabled]="paymentDisabled" (change)="updateStatus($event); filtersChanged();" name="payment">未付款</paper-checkbox>
                    </div>
                </div>
            </div>
    `,
    styleUrls: ['../../../src/css/po-search-filter.component.css'],
    providers:[HTTPMealService, HTTPPurchaseService]
})

export class POSearchFilter implements OnInit{
    @Output() filtersChange: EventEmitter<any> = new EventEmitter();

    filters: any = {};
    employees: Employee[];
    vendors: Vendor[];


    executedDisabled: boolean = false;
    goodReceiptDisabled: boolean = false;
    paymentDisabled: boolean = false;

    constructor(private _httpMealService: HTTPMealService, private _httpPurchaseService: HTTPPurchaseService) {}

    //OnInit: Get 員工資料、供應商資料
    ngOnInit():any {
        this._httpMealService.getEmployees().subscribe(
            data => {
                this.employees = data;
                // console.log(this.employees);
            },
            error => alert(error), //error case
            () => console.log("Finished") //pass a function when everything is completed
        );
        this._httpPurchaseService.getVendors().subscribe(
            data => {
                this.vendors = data;
                // console.log(this.distributors);
            },
            error => alert(error), //error case
            () => console.log("Finished") //pass a function when everything is completed
        );

    }

    private updateStatus(e) {
        // console.log("event");
        // console.log(e);
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

    //filtersChange: emit 事件
    private filtersChanged() {
        this.filtersChange.emit(this.filters);
    }
}

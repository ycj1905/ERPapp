import {Component, EventEmitter, Output, OnInit} from "angular2/core";
import {ItemCategory} from "../../domain/item-category";
import {HTTPStockService} from "../../services/http-service/http-stock.service";

@Component({
  selector: 'mm-search-filter',
  template: `   
   
            <div class="toolbar" (click)="toggleFilters = !toggleFilters" [ngClass]="{open: toggleFilters}">
                Filters
                <iron-icon icon="filter-list"></iron-icon>
            </div>
            <div  class="filters" [ngClass]="{open: toggleFilters}">
                <div class="row">
                    <div class="amounts col">
                        <paper-input placeholder="搜尋物料名稱" (keyup)="filters.itemName = $event.target.value; filtersChanged();"></paper-input>
                        <vaadin-combo-box label="選擇分類" [items]="itemCategories" item-label-path="categoryName" item-value-path="categoryName"
                                          (value-changed)="filters.categoryName = $event.detail.value; filtersChanged();"  [disabled]="disabled"></vaadin-combo-box>
                    </div>
                    <div class="checkboxes col">
                        <paper-checkbox [disabled]="finishedProductDisabled" (change)="updateStatus($event); filtersChanged();" name="finishedProduct">成品</paper-checkbox>
                        <paper-checkbox [disabled]="rawMaterialDisabled" (change)="updateStatus($event); filtersChanged();" name="rawMaterial">原料</paper-checkbox>
                    </div>
                </div>
            </div>
    `,
  styleUrls: ['../../../src/css/so-search-filter.component.css'],
  providers:[HTTPStockService]
})

export class MMSearchFilter implements OnInit{
  @Output() filtersChange:EventEmitter<any> = new EventEmitter();

  filters: any = {};
  itemCategories: ItemCategory[];

  rawMaterialDisabled: boolean = false;
  finishedProductDisabled: boolean = false;

  constructor(private _httpStockService: HTTPStockService) {}

  ngOnInit():any {
    this._httpStockService.getItemCategorys().subscribe(
      data => {
        this.itemCategories = data;
        // console.log(this.distributors);
      },
      error => alert(error),
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

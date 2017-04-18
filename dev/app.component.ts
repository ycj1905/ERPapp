import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig, Router} from "angular2/router";
import {MainComponent} from "./components/main/main.component";
import {POOverviewPage} from "./components/purchase-order/po-overview-page.component";
import {MealListComponent} from "./components/meal-order/meal-list.component";
import {MMOverviewPage} from "./components/material-management/mm-overview-page.component";
import {SOOverviewPage} from "./components/sales-order/so-overview-page.component";
import {PPOverviewPage} from "./components/production-planning/pp-overview-page.component";

@Component({
    selector: 'my-app',
    template: `
        
        
        
        <paper-drawer-panel id="paperDrawerPanel" force-narrow>
          <div drawer >
          
              <paper-item class="menu-drawer" >Menu</paper-item>
              <a [routerLink]="['Main']" tabindex="1">
                <paper-item paper-drawer-toggle >Main</paper-item>
              </a>
              
              
              <a [routerLink]="['PurchaseOrder']" tabindex="2">
                  <paper-item paper-drawer-toggle>Purchase Order</paper-item>
              </a>
              <a [routerLink]="['SalesOrder']" tabindex="3">
                  <paper-item paper-drawer-toggle>Sales Order</paper-item>
              </a>
              <a [routerLink]="['MaterialManagement']" tabindex="4">
                  <paper-item paper-drawer-toggle>Material Management</paper-item>
              </a>
              <a [routerLink]="['ProductionPlanning']" tabindex="5">
                  <paper-item paper-drawer-toggle>Production Planning</paper-item>
              </a>
              <a [routerLink]="['MealList']" tabindex="6">
                  <paper-item paper-drawer-toggle>Meal Order</paper-item>
              </a>
          </div>
          
          <div main>
              <!--router implementation-->
              <div class="outlet">
                  <router-outlet></router-outlet>
              </div>
          </div>
        </paper-drawer-panel>
        

    `,
    directives: [ROUTER_DIRECTIVES],
    styleUrls: ["../src/css/app.css"]
})

@RouteConfig([
    {path: '/main', name: 'Main', component: MainComponent, useAsDefault:true},
    {path: '/meal-list', name: 'MealList', component: MealListComponent},
    {path: '/purchase-order', name: 'PurchaseOrder', component: POOverviewPage},
    {path: '/sales-order', name: 'SalesOrder', component: SOOverviewPage},
    {path: '/material-management', name: 'MaterialManagement', component: MMOverviewPage},
    {path: '/production-planning', name: 'ProductionPlanning', component: PPOverviewPage}


])
export class AppComponent {

    // constructor(private _router: Router) {}

}
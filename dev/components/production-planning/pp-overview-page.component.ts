import {Component} from "angular2/core";
import {PPSRLList} from "./pp-srllist.component";
import {PPMrp} from "./pp-mrp.component";

@Component({
    selector: 'pp-overview-page',
    template: `

        <!--Navigation Bar-->
        <paper-toolbar>
            <paper-icon-button icon="menu" paper-drawer-toggle></paper-icon-button>
            <span class="title">Production Planning</span>
            <!--close at first, 從子頁回到pp-overview-->
            <paper-icon-button icon="arrow-back" raised (click)="onBack()"  *ngIf="!cardSectionDisabled"></paper-icon-button>
        </paper-toolbar>
        
        <!--open at first-->
        <section class="card-layout" [hidden]="!cardSectionDisabled">
            <!--1.  庫存需求-->
            <paper-card heading="Stock/Requirement List">
                <div class="card-content">
                    Provide the overview of a particular product which you may wanna know it's sales requirement and stock fulfillment.
                </div>
                <div class="card-actions">
                    <paper-button (click)="onEnter('SRL')">Enter</paper-button>
                    <paper-button>Instructions</paper-button>                    
                </div>
            </paper-card>
            
            <!--2. 物料請求計畫-->
            <paper-card heading="Material Requirement Planning">
                <div class="card-content">
                    Execution of MRP
                </div>
                <div class="card-actions">
                    <paper-button (click)="onEnter('MRP')">Enter</paper-button>
                    <paper-button>Instructions</paper-button>
                </div>
            </paper-card>
            
            <!--3. 現場控制-->
            <paper-card heading="Shop Floor Control">
                <div class="card-content">
                    Utilize data from the shop floor to maintain and communicate status information regarding materials, 
                    work centers, routings, and end operations required to complete the production requests.
                </div>
                <div class="card-actions">
                    <paper-button>Enter</paper-button>
                    <paper-button>Instructions</paper-button>
                </div>
            </paper-card>
            
            <!--<paper-card heading="Material Requirement Planning">-->
                <!--<div class="card-content">-->
                    <!--Execution of MRP-->
                <!--</div>-->
                <!--<div class="card-actions">-->
                    <!--<paper-button>Enter</paper-button>-->
                    <!--<paper-button>Instructions</paper-button>-->
                <!--</div>-->
            <!--</paper-card>-->
        </section>
        
        <!--close at first-->
        <pp-srllist *ngIf="SRLDisabled" ></pp-srllist>
        
        <!--close at first-->
        <pp-mrp *ngIf="MRPDisabled"></pp-mrp>
`,
    styles: [`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      paper-toolbar {
         background-color: lightseagreen;
      }
      paper-toolbar .title {
        line-height: 30px;
      }
      .content {
        display: flex;
        flex: 1;
        
      }
      paper-dialog {
        display: block;
        padding: 16px 16px;
        border: 1px solid #ccc;
        position: absolute;
        top: 0;
        margin: 0;
        width: 70%;
        height: 100vh;
      }

      @media (max-width: 600px) {
        paper-dialog {
          width: 100vw;
        }
      }
      @media (max-width: 600px) {
        h1 {
          font-size: 18px;
        }
      }
      paper-card {
          color: grey;
          max-width: 400px;
          min-width: 400px;
          margin: 20px;
          
      }
      paper-card paper-input {
        max-width: 100px;
      }
      .card-layout {
          margin: auto;
          /*overflow-y: scroll; */
          /*overflow-x: hidden;*/
          height: 90vh;
      }
      `],
    directives: [PPSRLList, PPMrp]
})

export class PPOverviewPage{
    cardSectionDisabled = true;
    SRLDisabled = false;
    MRPDisabled = false;

    onEnter(disabled) {             //利用switch方式選擇要呈現的頁面
        this.cardSectionDisabled = false;
        switch (disabled) {
            case 'SRL':
                this.SRLDisabled = true;    //關掉pp-overview
                break;
            case 'MRP':
                this.MRPDisabled = true;    //關掉pp-overview
                break;
        }
    }

    onBack() {
        this.cardSectionDisabled = true;
        this.SRLDisabled = false;
        this.MRPDisabled = false;
    }

}

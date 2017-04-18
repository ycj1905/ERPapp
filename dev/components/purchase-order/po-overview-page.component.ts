import {Component} from "angular2/core";
import {POList} from "./po-list.component";
import {POEditor} from "./po-editor.component";
import {PODetail} from "./po-detail.component";

@Component({
    selector: 'po-overview-page',
    template: `

        <!--Navigation Bar(目錄, 更新, 新增)-->
        <paper-toolbar >
            <paper-icon-button icon="menu" paper-drawer-toggle></paper-icon-button>
            <span class="title">Purchase Order</span>
            <!--更新-->
            <paper-icon-button icon="refresh" raised (click)="poList.refreshItems()"></paper-icon-button>
            <!--目錄-->
            <paper-icon-button icon="add" raised (click)="creatDialog.open()"></paper-icon-button>
        </paper-toolbar>
        
        
        <!--1. 採購清單-->
        <!--事件(viewDetail): 1. Event Object丟至poDetail的selectedOrder 2. detailDialog打開, 3.設定Detail-->
        <!--po-list包含po-search-filter-->
        <div class="content">
            <po-list #poList (viewDetail)="poDetail.selectedOrder = $event; detailDialog.open(); poDetail.setDetail()"></po-list>
        </div>
        
        
        <!--2. 新增採購單(Dialog): 點選 Button-"新增" 後顯示(modal)-->
        <paper-dialog #creatDialog id="creatDialog" modal>
            <po-editor (refresh)="creatDialog.close(); poList.refreshItems()"></po-editor>
        </paper-dialog>
        
        <!--3. 採購單(Detail): 點選 "採購清單" 後顯示(modal)-->
        <paper-dialog #detailDialog id="detailDialog" modal>
            <po-detail #poDetail></po-detail>
        </paper-dialog>
        
       
`,
    styles: [`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      paper-toolbar {
         background-color: dodgerblue;  
      }
      paper-toolbar .title {
        line-height: 30px;
      }
      .content {
        display: flex;
        flex: 1;
        
      }
      po-list {
        flex: 1;
        /*width: 100%;*/
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
      
      @media (max-width: 800px) {
        paper-dialog {
          width: 100vw;
        }
      }
    `],
    directives: [POList, POEditor, PODetail]
})
export class POOverviewPage {


}

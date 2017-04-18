import {Component} from "angular2/core";
import {SOList} from "./so-list.component";
import {SODetail} from "./so-detail.component";
import {SOEditor} from "./so-editor.component";

@Component({
    selector: 'so-overview-page',
    template: `
        
        <!--Navigation Bar(目錄、更新、新增)-->
        <paper-toolbar>
            <paper-icon-button icon="menu" paper-drawer-toggle></paper-icon-button>
            <span class="title">Sales Order</span>
            <!--更新-->
            <paper-icon-button icon="refresh" raised (click)="soList.refreshItems()"></paper-icon-button>
            <!--目錄-->
            <paper-icon-button icon="add" raised (click)="creatDialog.toggle()"></paper-icon-button>
        </paper-toolbar>
        
        <!--1. 銷售清單-->
        <!--事件(viewDetail): 1. Event Object丟至soDetail的selectedOrder 2. detailDialog打開, 3.設定Detail-->
        <!--po-list包含po-search-filter-->
        <div class="content">
            <so-list #soList (viewDetail)="soDetail.selectedOrder = $event; detailDialog.open(); soDetail.setDetail()"></so-list>
        </div>
        
        
        <!--2. 新增銷售單(Dialog): 點選 Button-"新增" 後顯示(modal)-->
        <paper-dialog #creatDialog id="creatDialog" modal>
            <so-editor (refresh)="creatDialog.close(); soList.refreshItems()"></so-editor>
        </paper-dialog>
        
         <!--3. 銷售單(Detail): 點選 "銷售清單" 後顯示(modal)-->
        <paper-dialog #detailDialog id="detailDialog" modal>
            <so-detail #soDetail (closeDialog)="detailDialog.close();" ></so-detail>
        </paper-dialog>
        
       
`,
    styles: [`
      paper-toolbar {
          background-color: orange;
      }
      paper-toolbar .title {
        line-height: 30px;
      }
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .content {
        display: flex;
        flex: 1;
        
      }
      so-list {
        flex: 1;
        width: 100%;
      }
      
      paper-dialog {
        display: block;
        padding: 16px 16px;
        border: 1px solid #ccc;
        position: absolute;
        top: 0;
        margin: 0;
        width: 100%;
        height: 100vh;
      }
      
      /*po-editor {*/
        /*display: flex;*/
        /*flex-direction: column;*/
        /*height: 100%;*/
        /*margin: 0 !important;*/
        /*padding: 0 !important;*/
      /*}*/
      @media (max-width: 600px) {
        paper-dialog {
          width: 100vw;
        }
      }
    `],
    directives: [SOList, SODetail, SOEditor]
})
export class SOOverviewPage {


}

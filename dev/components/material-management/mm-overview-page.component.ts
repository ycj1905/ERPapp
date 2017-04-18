import {Component} from "angular2/core";
import {MMList} from "./mm-list.component";
import {MMRecordList} from "./mm-recordlist.component";
import {MMEditor} from "./mm-editor-stockout.component";
import {MMEditorStockIn} from "./mm-editor-stockin.component";

@Component({
    selector: 'mm-overview-page',
    template: `

        <!--Navigation Bar(更新、出入庫紀錄、出庫、成品入庫)-->
        <paper-toolbar>
            <paper-icon-button icon="menu" paper-drawer-toggle></paper-icon-button>
            <span class="title">Material Management</span>
            
            <!--1. 刷新頁面, mmList.refreshItems()-->
            <paper-icon-button id="refresh" icon="refresh" raised (click)="mmList.refreshItems()"></paper-icon-button>
            <paper-tooltip for="refresh">刷新頁面</paper-tooltip>
            
            <!--2. 出入庫紀錄, mmRecordListDialog.toggle()-->
            <paper-icon-button id="assignment" icon="assignment" raised (click)="mmRecordListDialog.toggle(); mmRecordList.refreshItems()"></paper-icon-button>
            <paper-tooltip for="assignment">出入庫紀錄</paper-tooltip>
            
            <!--3. 出庫, createDialog.toggle()-->
            <paper-icon-button id="stockOut" icon="file-upload" raised (click)="createDialog.toggle();"></paper-icon-button>
            <paper-tooltip for="stockOut">出庫</paper-tooltip>
            
            <!--4. 成品入庫, mmEditorStockIn.onOpen()-->
            <paper-icon-button id="stockIn" icon="file-download" raised (click)="mmEditorStockIn.onOpen(); stockInDialog.toggle();"></paper-icon-button>
            <paper-tooltip for="stockIn">成品入庫</paper-tooltip>
        </paper-toolbar>
        
        
        
        <!--過濾後的採購單資訊: displayedPurchaseOrders-->
        <!--事件(stockResult) = "mmEditor.stockResult = $event"-->
        
        <div class="content">
            <mm-list #mmList (stockResult)="mmEditor.stockResult = $event"></mm-list>
        </div>
        
        
        <!--Dialog, 編輯物料 -->
        <paper-dialog class="createDialog" #createDialog id="createDialog" modal>
            <mm-editor-stockout #mmEditor id="mmEditor" (refresh)="mmList.refreshItems()"></mm-editor-stockout>
        </paper-dialog>
        
        <!--Dialog, 出庫 -->
        <paper-dialog class="createDialog" #stockInDialog id="stockInDialog" modal>
            <mm-editor-stockin #mmEditorStockIn id="mmEditorStockIn" (refresh)="mmList.refreshItems(); stockInDialog.toggle();"></mm-editor-stockin>
        </paper-dialog>
        
        <!--Dialog, -出入庫紀錄 -->
        <paper-dialog class="mmRecordListDialog" #mmRecordListDialog id="mmRecordListDialog" modal>
            <mm-recordlist #mmRecordList ></mm-recordlist>
        </paper-dialog>
        
       
`,
    styles: [`      

      paper-toolbar {
          background-color: #0b8043;
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
      mm-list {
        flex: 1;
        width: 100%;
      }
      h1 {
        font-weight: 300;
      }
      
      .createDialog {
        display: block;
        padding: 5px 5px;
        border: 1px solid #ccc;
        position: absolute;
        top: 0;
        margin: 0;
        width: 100vh;
        height: 100vh;
      }
      .mmRecordListDialog {
        display: block;
        padding: 8px 8px;
        border: 1px solid #ccc;
        position: absolute;
        top: 0;
        margin: 0;
        width: 100vh;
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
      @media (max-width: 600px) {
        h1 {
          font-size: 14px;
        }
      }
    `],
    directives: [MMList, MMRecordList, MMEditor, MMEditorStockIn]
})
export class MMOverviewPage {

}

import {Component} from "angular2/core";
import {HTTPStockService} from "../../services/http-service/http-stock.service";
import {Stock} from "../../domain/stock";
declare var moment: any;

@Component({
    selector: 'pp-srllist',
    template: `

        <section class="top-controller">
            <!--open at first, materialNumber: two way data binding-->
            <paper-input label="Material Number" type="number" [disabled]="gridOpened" [(ngModel)]="materialNumber" ngDefaultControl ></paper-input> 
            
            <!--open at first-->
            <paper-button (click)="onEnter()" [disabled]="gridOpened">Enter</paper-button> 
            
            <!--close at first-->
            <paper-button (click)="onBack()" [disabled]="!gridOpened">Back</paper-button>   
            
        </section>
        
        <!--清單顯示為(materialNumber與get到的id相同的Stock)-->
        <vaadin-grid *ngIf="gridOpened" [items]="SRLList">  
            <table>
                <colgroup>
                    <col name="date">
                    <col name="mrpElement">
                    <col name="recReqQty">
                    <col name="quantity">
                </colgroup>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>MRP Element</th>
                    <th>Rec./reqd qty</th>
                    <th>Available qty</th>
                </tr>
                </thead>
            </table>
        </vaadin-grid>
`,
    styles: [`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .top-controller {
          display: flex;
          padding: 20px;
          background-color: whitesmoke;
          max-height: 40px;
      }
      .top-controller paper-input {
          height: 10px;
          width: 60%;
      }
      .top-controller paper-button {
          max-height: 40px;
      }
      vaadin-grid {
          flex: 1;
          width: 100%;
          height: 100%;
          font-size: 14px;
          line-height: 20px;
      }
      `],
    providers: [HTTPStockService]
})

export class PPSRLList{
    gridOpened = false;
    materialNumber: number = null;
    basicStock: Object;
    SRLList: Object[] = [];

    constructor(private _httpStockService: HTTPStockService) {}

    onEnter() {
        // console.log(this.materialNumber);
        if (this.materialNumber !== null) {                 //materialNumber 有值
            this._httpStockService.getViewStocks().subscribe(       //get 所有 Stocks
                data => {
                    let stocks: Stock[] = data;             //把get到的所有Stocks 存到陣列 stocks
                    // console.log(typeof this.materialNumber);
                    // console.log(Number(this.materialNumber)=== 1);
                    stocks = stocks.filter((stock: Stock) =>        //用filter去過濾, 留下(materialNumber = stock ID)
                        stock.item.itemId === Number(this.materialNumber)
                    );
                    console.log("STOCK AFTER FILETER");
                    console.log(stocks);
                    if (stocks.length !== 0) {              //stocks 有東西, 代表有match到
                        this.gridOpened = true;             //開啟match到的清單
                        this.basicStock = {date: moment().format('YYYY-MM-DD'), mrpElement: "Stock", recReqQty: 0, quantity: stocks[0].quantity};  //存到basicStock{date, mrpElement, recReqQty, quantity}
                        this.SRLList = [this.basicStock];       //把basicStock存到 SRLList
                    } else {
                        alert("庫存並無此物料！！！");
                    }
                },
                error => alert(error)
            );
        }
    }

    onBack() {          //回到前頁(pp-overview-page)
        this.SRLList = [];      //清空SRLList陣列
        this.gridOpened = false;
    }

}

import {Component} from "angular2/core";
import {HTTPBomService} from "../../services/http-service/http-bom.service";
import {Bom} from "../../domain/bom";

@Component({
    selector: 'so-bom',
    template: `
        <header>
            <h2>BOM</h2>
            <paper-icon-button icon="close" (click)="onClose()" dialog-dismiss></paper-icon-button>
        </header>
        
        <section >
            <div class="head">
                <h3>{{selectedSalesItem["sItemName"]}} 物料清單：</h3>
                <paper-button raised (click)="onExpanded()">{{expandedLabel}}物料清單</paper-button>
            </div>
            <paper-dialog-scrollable>
                <ul>
                    <li *ngFor="#element of semiBoms" >
                        {{ element.bomName }} x{{element.quantity}}
                        <div *ngIf="expanded">
                            <ul *ngFor="#material of boms" >
                                <li *ngIf="element.bomName === material.bom.bomName">
                                    {{ material.bomName }} x{{material.quantity}} ({{material.item.itemVendorNum}})
                                </li>
                            </ul>
                        </div>
                        
                    </li>
                </ul>
                
            </paper-dialog-scrollable>
        </section>
        
   
            
    `,
    styles: [`
        header {
            display: flex;
            justify-content: space-between;
        }
        .head {
            display: flex;
            justify-content: space-between;
        }
        .head paper-button{
            height: 50%;
        }
        section {
          width: 100%;
          height: 70vh;
        }
        section paper-dialog-scrollable {
          height: 100%;
        }
        li {
          cursor: pointer;
          transition: padding 0.5s;
        }
        li:hover {
          padding-left: 10px;
          font-weight: bold;
          color: darkorange;
        }
        table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
        }
        th, td {
            padding: 5px;
            text-align: left;
        }
        
        `],
    providers: [HTTPBomService]
})

export class SOBom{
    boms: Bom[] = [];
    semiBoms: Bom[] = [];
    selectedSalesItem: Object = {};
    selectedElement: Object = {};

    expanded: boolean = false;
    expandedLabel: string = "展開";


    constructor(private _httpBomService: HTTPBomService) {}

    onOpen(object) {
        console.log(object);
        this.selectedSalesItem = object;
        console.log("BOM opened");
        console.log(this.selectedSalesItem);

        this._httpBomService.getBomsByBomId(object["bom"]["bomId"]).subscribe(
            data => {
                this.boms = data;
                this.semiBoms = [];
                console.log(this.boms);
                for (let element in this.boms) {
                    if (element === '0') {
                        this.semiBoms.push(this.boms[<string>element]["bom"]);
                        console.log(this.boms[element]["bom"]["bomName"]);
                    }
                    else if (this.boms[element]["bom"]["bomName"] !== this.semiBoms[this.semiBoms.length-1]["bomName"]) {
                        this.semiBoms.push(this.boms[<string>element]["bom"]);
                        console.log(this.boms[element]["bom"]["bomName"]);
                    }
                }
                console.log(this.semiBoms);
            },
            error => alert(error), //error case
            () => console.log("Finished") //pass a function when everything is completed
        );
    }

    onExpanded() {
        if (this.expanded === true) {
            this.expandedLabel = "展開";
            this.expanded = false;
        } else {
            this.expandedLabel = "閉合";
            this.expanded = true;
        }

    }

    onClose() {
        this.expanded = false;
        this.expandedLabel = "展開";
    }






}
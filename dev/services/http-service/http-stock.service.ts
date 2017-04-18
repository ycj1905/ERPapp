import {Injectable} from "angular2/core";
import {Http, Headers} from "angular2/http";
import 'rxjs/add/operator/map';//deal with _http.get().map()

@Injectable()
export class HTTPStockService{
    public name: string = 'HTTPStockService';
    url:string = 'http://192.168.1.116:8080/anhe-data2-2.0-SNAPSHOT/api/stock';
    // url:string = 'http://192.168.2.114/api/stock';

    constructor(private _http: Http) {}

    //GET 庫存(全)
    getStocks() {
        return this._http.get(this.url + '/stocks')
            .map(response => response.json());
    }

    //GET
    getUpdateStocks() {
        return this._http.get(this.url + '/stocks/update')
            .map(response => response.json());
    }


    getViewStocks() {
        return this._http.get(this.url + '/stocks/view2')
            .map(response => response.json());
    }

    getItemTypeOfThree() {
        return this._http.get(this.url + '/stocks/item-type3')
            .map(response => response.json());
    }

    //GET 分類
    getItemCategorys() {
        return this._http.get(this.url + '/itemCategories')
            .map(response => response.json()); //extract the resource
    }

    //GET 出庫(全)
    getStockOuts() {
        return this._http.get(this.url + '/stockOuts')
            .map(response => response.json());
    }

    //POST出庫(全)
    postStockOutAll(object) {
        let mix: Object = { 'stockOuts': object };
        let json = JSON.stringify(mix);
        let header = new Headers();
        console.log(json);
        header.append('Content-Type', 'application/json');

        return this._http.post(this.url + '/stockOutAll', json, {headers: header})
            .map(response => response.json());
    }

    //POST 庫存(Purchase Order
    postStockInByPo(po) {
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        console.log(po["poId"]);

        return this._http.post(this.url + '/stockOuts/' + po["poId"], null, {headers: header})
            .map(response => response.json());
    }
}

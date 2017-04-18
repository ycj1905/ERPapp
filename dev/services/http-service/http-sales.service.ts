import {Injectable} from "angular2/core";
import {Http, Headers} from "angular2/http";
import 'rxjs/add/operator/map'; //deal with _http.get().map()

@Injectable()
export class HTTPSalesService{
    public name: string = 'HTTPSalesService';
    url:string = 'http://192.168.1.116:8080/anhe-data2-2.0-SNAPSHOT/api';
    // url:string = 'http://192.168.2.114/api';

    constructor(private _http: Http) {}

    //GET 經銷商(全)
    getDistributors() {
        return this._http.get(this.url + '/sales-order/distributors')
            .map(response => response.json()); //extract the resource
    }

    // getItemsByVendor(coName: string) {
    //     return this._http.get(this.url + '/sales-order/item/' + coName)
    //         .map(response => response.json());
    // }

    //GET 員工(全)
    getEmployees() {
        return this._http.get(this.url + '/employees')
            .map(response => response.json());
    }

    //GET 銷售訂單
    getSalesOrders() {
        return this._http.get(this.url + '/sales-order')
            .map(response => response.json());
    }

    //GET 銷售項目
    getSalesItems() {
        return this._http.get(this.url + '/sales-order/sales-item')
            .map(response => response.json());
    }

    //GET 銷售項目(Sales Order ID)
    getSoItemsBySo(soId: string) {
        return this._http.get(this.url + '/sales-order/so-item/' + soId)
            .map(response => response.json());
    }

    //POST 銷售訂單()
    postSalesOrder(object, soItems) {
        let mix: Object = { 'salesOrder': object, 'soItems': soItems };
        let json = JSON.stringify(mix);
        let header = new Headers();
        header.append('Content-Type', 'application/json');

        return this._http.post(this.url + '/sales-order', json, {headers: header})
            .map(response => response.json());
    }

    //UPDATE 銷售狀態(....)
    updateSoStatus(object) {
        var json = JSON.stringify(object);
        var header = new Headers();
        // header.append('Content-Type', 'application/x-www-form-urlencoded');
        header.append('Content-Type', 'application/json');

        return this._http.put(this.url + "/sales-order/so-status", json, {headers: header})
            .map(response => response.json());
    }


}

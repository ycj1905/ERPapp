import {Injectable} from "angular2/core";
import {Http, Headers} from "angular2/http";
import 'rxjs/add/operator/map'; //deal with _http.get().map()

@Injectable()
export class HTTPPurchaseService{
    public name: string = 'HTTPPurchaseService';
    url:string = 'http://192.168.1.116:8080/anhe-data2-2.0-SNAPSHOT/api';
    // url:string = 'http://192.168.2.114/api';

    constructor(private _http: Http) {}

    //GET 供應商(全)
    getVendors() {
        return this._http.get(this.url + '/purchase-order/vendors')
            .map(response => response.json()); //extract the resource
    }

    //GET 採購清單(Company Name)
    getItemsByVendor(coName: string) {
        return this._http.get(this.url + '/purchase-order/item/' + coName)
            .map(response => response.json());
    }

    //GET 員工(全)
    getEmployees() {
        return this._http.get(this.url + '/employees')
            .map(response => response.json());
    }

    //GET 採購清單(全)
    getPurchaseOrders() {
        return this._http.get(this.url + '/purchase-order')
            .map(response => response.json());
    }

    //GET 採購清單(Purchase Order ID)
    getPoItemsByPo(poId: string) {
        return this._http.get(this.url + '/purchase-order/po-item/' + poId)
            .map(response => response.json());
    }


    postPurchaseOrder(object, poItems) {
        let mix: Object = { 'purchaseOrder': object, 'poItems': poItems };
        let json = JSON.stringify(mix);
        let header = new Headers();
        header.append('Content-Type', 'application/json');

        return this._http.post(this.url + '/purchase-order', json, {headers: header})
            .map(response => response.json());
    }

    //Update 採購清單的狀態(.....)
    updatePoStatus(object) {
        var json = JSON.stringify(object);
        var header = new Headers();
        // header.append('Content-Type', 'application/x-www-form-urlencoded');
        header.append('Content-Type', 'application/json');

        return this._http.put(this.url + "/purchase-order/po-status", json, {headers: header})
            .map(response => response.json());
    }
}

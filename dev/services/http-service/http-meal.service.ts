import {Injectable} from "angular2/core";
import {Http, Headers} from "angular2/http";
import 'rxjs/add/operator/map'; //deal with _http.get().map()

@Injectable()
export class HTTPMealService{
    public name: string = 'HTTPMealService';
    url:string = 'http://192.168.1.116:8080/anhe-data2-2.0-SNAPSHOT/api';
    // url:string = 'http://192.168.2.114/api';

    constructor(private _http: Http) {}

    //GET 餐廳(全)
    getShops() {
        return this._http.get(this.url + '/meal-order/shops')
            .map(response => response.json()); //extract the resource
    }

    //GET 菜單(Shop Name)
    getShopMenus(shopName: string) {
        return this._http.get(this.url + '/meal-order/menus/' + shopName)
            .map(response => response.json());
    }

    //GET 員工(全)
    getEmployees() {
        return this._http.get(this.url + '/employees')
            .map(response => response.json());
    }

    //GET 點餐內容(全)
    getMealOrder() {
        return this._http.get(this.url + '/meal-order')
            .map(response => response.json());
    }

    //POST 點餐內容
    postMealOrder(object) {
        var json = JSON.stringify(object);
        let header = new Headers();
        header.append('Content-Type', 'application/json');

        return this._http.post(this.url + '/meal-order', json, {headers: header})
            .map(response => response.json());
    }

    // updateEmployee(object) {
    //     var json = JSON.stringify(object);
    //     var header = new Headers();
    //     // header.append('Content-Type', 'application/x-www-form-urlencoded');
    //     header.append('Content-Type', 'application/json');
    //
    //     return this._http.put("http://localhost:8080/api/employees/" + object.employeeId, json, {headers: header})
    //         .map(response => response.json());
    // }
    //
    // deleteEmployee(employeeId) {
    //
    //     var header = new Headers();
    //     header.append('Content-Type', 'application/json');
    //     return this._http.delete('http://localhost:8080/api/employees/' + employeeId, {headers: header});
    //
    // }
}

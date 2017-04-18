import {Injectable} from "angular2/core";
import {Http, Headers} from "angular2/http";
import 'rxjs/add/operator/map'; //deal with _http.get().map()

@Injectable()
export class HTTPBomService{
    public name: string = 'HTTPStockService';
    url:string = 'http://192.168.1.116:8080/anhe-data2-2.0-SNAPSHOT/api/bom';
    // url:string = 'http://192.168.2.114/api/bom';
    constructor(private _http: Http) {}

    //GET 物料清單(BOM ID)
    getBomsByBomId(bomId) {
        return this._http.get(this.url + '/all/' + bomId)
            .map(response => response.json());
    }
}

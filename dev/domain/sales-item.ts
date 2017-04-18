import {Bom} from "./bom";

export class SalesItem {
    constructor(
        public sItemId: number = null,
        public sItemName: string = null,
        public sItemPrice: number = null,
        public sItemVendorNum: string = null,
        public itemType: string = null,
        public createTime: string = null,
        public updateTime: string = null,
        public enabled: boolean = null,
        public bom: Bom = null
    ) {}
}
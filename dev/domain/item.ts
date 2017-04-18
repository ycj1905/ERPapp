import {Vendor} from "./vendor";
import {ItemCategory} from "./item-category";
import {ItemUnit} from "./item-unit";
import {ItemType} from "./item-type";
export class Item {
    constructor(
        public itemId: number = null,
        public vendor: Vendor = null,
        public itemCategory: ItemCategory = null,
        public itemType: ItemType = null,
        public itemUnit: ItemUnit = null,
        public itemName: string = null,
        public itemPrice: number = null,
        public itemVendorNum: string = null,
        public createTime: string = null,
        public updateTime: string = null,
        public enabled: boolean = null
    ) {}
}
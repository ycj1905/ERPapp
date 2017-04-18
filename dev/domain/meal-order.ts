import {Employee} from "./employee";
import {MealMenu} from "./meal-menu";
export class MealOrder {
    constructor(
        public employee: Employee = null,
        public shopMenu: MealMenu = null,
        public orderTime:string = null,
        public quantity:number = 1,
        public totalPrice:number = null,
        public remark:string = null
    ) {}
}
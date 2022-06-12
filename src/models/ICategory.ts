import {ISubcategory} from "./ISubcategory";

export interface ICategory {
    id: number
    name: string
    sectionId: number
    subcategories: ISubcategory[] | []
}
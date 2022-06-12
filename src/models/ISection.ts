import {ICategory} from "./ICategory";


export interface ISection {
    id: number
    name: string
    categories: ICategory[] | []
}
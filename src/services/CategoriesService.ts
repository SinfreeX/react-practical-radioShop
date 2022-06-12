import {createApi} from "@reduxjs/toolkit/query/react";
import {fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ISection} from "../models/ISection";
import {ICategory} from "../models/ICategory";
import {IAddCategory} from "../models/IAddCategory"
import {ISubcategory} from "../models/ISubcategory";


export const categoryAPI = createApi({
    reducerPath: 'categoryAPI',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:5000'}),
    tagTypes: ['Category'],
    endpoints: (build) => ({
        getCategories: build.query<ISection[], null>({
            query: () => ({
                url: `/category`
            }),
            providesTags: result => ['Category']
        }),
        addCategory: build.mutation<ISection | ICategory | ISubcategory, IAddCategory>({
            query: arg => ({
                url: `/category`,
                method: 'POST',
                body: arg
            }),
            invalidatesTags: ['Category']
        })
    })
})
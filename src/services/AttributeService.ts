import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

interface IAttribute{
    id: number
    name: string
}

export type AutocompleteTypes = 'attrs' | 'vendors' | 'measures' | 'products'

export interface AcProps {
    word: string
    type: AutocompleteTypes
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000'}),
    tagTypes: ['Attribute'],
    endpoints: builder => ({
        getAttribute: builder.query<IAttribute, string>({
            query: name => ({
                url: '/attributes',
                params: {name}
            }),
            providesTags: result => ['Attribute']
        }),
        addAttribute: builder.mutation<IAttribute, string>({
            query: (name) => ({
                url: '/attributes',
                method: 'POST',
                body: {name}
            }),
            invalidatesTags: ['Attribute']
        }),
        autoComplete: builder.query<string[], AcProps>({
            query: (arg) => ({
                url: `/autocomplete`,
                params: arg
            })
        })
    })
})
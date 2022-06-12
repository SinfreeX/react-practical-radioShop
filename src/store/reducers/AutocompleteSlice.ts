import {createSlice} from "@reduxjs/toolkit";


interface IAnswer {
    body: string[]
    before?: string[]
    after?: string[]
}

interface AutocompleteState {
    answer: IAnswer
    isLoading: false
}

const initialState: AutocompleteState = {
    answer: {body:[]},
    isLoading: false
}

export const autocompleteSlice = createSlice({
    name: 'autocomplete',
    initialState,
    reducers: {

    }
})
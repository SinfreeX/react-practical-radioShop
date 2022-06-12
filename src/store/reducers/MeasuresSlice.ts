import {AsyncThunkPayloadCreatorReturnValue, createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios, {AxiosError, AxiosResponse} from "axios";
import {useAppDispatch} from "../../hooks/redux";
import {message} from "antd";
import {isArray} from "util";
import {parseAxiosError} from "../../utils/utils";
import {RootState} from "@reduxjs/toolkit/dist/query/core/apiState";

export interface MeasureItem {
    id: number
    name: string
}



interface MeasureState {
    searchedMeasures: MeasureItem[],
    allMeasures: MeasureItem[],
    isLoading: boolean,
    lastWord: string
}

const initialState: MeasureState = {
    searchedMeasures: [],
    allMeasures: [],
    isLoading: false,
    lastWord: ''
}


export const fetchAll = createAsyncThunk<
    {response: AxiosResponse<MeasureItem>},
    boolean | undefined
    >(
    'measures/fetchAll',
    async (_, thunkAPI) => {
        console.log('async fetch all');
        try {
            const response = await axios.get<MeasureItem[]>('http://localhost:5000/attributes/measures') as AxiosResponse
            return response.data
        }catch (e) {
            return  thunkAPI.rejectWithValue({type: 'all', message: parseAxiosError(e) || 'Ошибка получения данных'})
        }
    },{
        condition: (force= false, {getState}) => {
            const {measuresReducer: {allMeasures}} = getState() as {measuresReducer: MeasureState}
            if (allMeasures.length && !force) return false
        }
    }
)

export const fetchMeasuresInAttr = createAsyncThunk<
    {response: AxiosResponse<MeasureItem[]>},
    {attr: string, force?: boolean}
    >(
    'measures/fetchInAttr',
    async ({attr}, thunkAPI) => {
        try {
            const response = await axios.get<MeasureItem[]>('http://localhost:5000/attributes/measures', {
                params: {
                    in: 'attr',
                    word: attr
                }
            }) as AxiosResponse
            return response.data
        }catch (e) {
            return thunkAPI.rejectWithValue({type: 'searched', message: parseAxiosError(e) || 'Ошибка получения данных'})
        }
    },{
        condition: ({attr, force= false}, {getState}) => {
            const {measuresReducer: {searchedMeasures, lastWord}} = getState() as {measuresReducer: MeasureState}
            if (searchedMeasures.length && lastWord === attr && !force)
            return false
        }
    }
)

export const addMeasure = createAsyncThunk<
    {response: AxiosResponse<MeasureItem>},
    {name: string, attrName: string}
    >(
    'measures/add',
    async ( {name, attrName}, thunkAPI) => {
        try {
            const response = await axios.post<MeasureItem>('http://localhost:5000/attributes/measures', { name, attrName }) as AxiosResponse
            return response.data
        }catch (e) {
            return  thunkAPI.rejectWithValue({type: 'add', message: parseAxiosError(e) || 'Ошибка отправки на сервер'})
        }
    }
)


export const editMeasure = createAsyncThunk<
    {response: any},
    {name: string, attrName?: string}
    >(
        'measures/edit',
    async ({name, attrName}, thunkAPI) => {
            try {
                const response = await axios.put<MeasureItem>('http://localhost:5000/attributes/measures', { name, attrName }) as AxiosResponse
                return response.data
            }catch (e) {
                return  thunkAPI.rejectWithValue({type: 'edit', message: parseAxiosError(e) || 'Ошибка сервера'})
            }
    }
)





export const measuresSlice = createSlice({
    name: 'measures',
    initialState,
    reducers: {
        setLastWord(state, action: PayloadAction<string>) {
            state.lastWord = action.payload
        }
    },
    extraReducers: {
        [fetchAll.fulfilled.type]: (state, action: PayloadAction<MeasureItem[]>) => {
            state.isLoading = false
            state.allMeasures = action.payload
        },
        [fetchAll.pending.type]: state => {state.isLoading = true},
        [fetchAll.rejected.type]: state => {state.isLoading = false},

        [fetchMeasuresInAttr.fulfilled.type]: (state, action: PayloadAction<MeasureItem[], any, any>) => {
            state.isLoading = false
            state.searchedMeasures = action.payload
            state.lastWord = action.meta.arg.attr
        },
        [fetchMeasuresInAttr.pending.type]: state => {state.isLoading = true},
        [fetchMeasuresInAttr.rejected.type]: state => {state.isLoading = false},

        [addMeasure.fulfilled.type]: state => {state.isLoading = false},
        [addMeasure.pending.type]: state => {state.isLoading = true},
        [addMeasure.rejected.type]: state => {state.isLoading = false},

        [editMeasure.fulfilled.type]: state => {state.isLoading = false},
        [editMeasure.pending.type]: state => {state.isLoading = true},
        [editMeasure.rejected.type]: state => {state.isLoading = false},

    }
})

export default measuresSlice.reducer;
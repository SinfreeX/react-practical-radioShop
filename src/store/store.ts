import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import {postAPI} from "../services/PostService";
import {categoryAPI} from "../services/CategoriesService";
import measuresReducer from './reducers/MeasuresSlice'
import {apiSlice} from "../services/AttributeService";



const rootReducer = combineReducers({
    measuresReducer,
    // [postAPI.reducerPath]: postAPI.reducer,
    [categoryAPI.reducerPath]: categoryAPI.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer, /// должен быть только 1
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(
                // postAPI.middleware,
                categoryAPI.middleware,
                apiSlice.middleware
            )
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore["dispatch"]

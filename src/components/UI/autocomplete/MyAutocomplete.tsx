import React, {FC, useCallback, useEffect, useState} from 'react';
import {AutoComplete, AutoCompleteProps, Spin} from "antd";
import { DefaultOptionType } from 'antd/lib/select'
import {apiSlice, AutocompleteTypes} from "../../../services/AttributeService";

interface MyAutocompleteProps extends AutoCompleteProps{
    type: AutocompleteTypes
}

const MyAutocomplete: FC<MyAutocompleteProps> = ({type, ...props }) => {
    const [options, setOptions] = useState< DefaultOptionType[]>([])
    const [word, setWord] = useState<string>('')
    const {data: results, status} = apiSlice.useAutoCompleteQuery({type, word}, {skip: !word})

    useEffect(() => {
        if (status === 'fulfilled')
            setOptions( (results && results.length > 0) ? results.map((e: string, i:number) => ({value: e, label: e}))  : [])
    }, [results, status])



    const onSearch = (searchText: string) => {
        searchText.trim() ?
            setWord(searchText)
            :
            setWord(''); setOptions([])
    }

    return (
        <AutoComplete
            options={options}
            onSearch={onSearch}
            notFoundContent={ !options.length && status !== 'fulfilled' && status !== 'uninitialized' ? <Spin size={'small'} /> : word ? 'Результатов нет' : null }
            {...props}>


        </AutoComplete>
    );
};

export default MyAutocomplete;
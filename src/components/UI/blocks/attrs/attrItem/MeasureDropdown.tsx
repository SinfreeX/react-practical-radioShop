import React, {FC, useMemo, useRef, useState} from 'react';
import {Divider, Form, notification, Popconfirm, Select, Space, Typography} from "antd";
import {SelectProps} from "antd/lib/select";
import {LinkProps} from "antd/lib/typography/Link";
import {
    editMeasure,
    fetchAll,
    fetchMeasuresInAttr, MeasureItem
} from "../../../../../store/reducers/MeasuresSlice";
import {useAppDispatch, useAppSelector} from "../../../../../hooks/redux";
import {FormListFieldData} from "antd/lib/form/FormList";
import MeasureCreateForm from "./MeasureCreateForm";




interface DropdownMeasureProps {
    restField: FormListFieldData,
    attrName: string
}


const MeasureDropdown: FC<DropdownMeasureProps> = ({restField:{key, name}, attrName}) => {
    const errors = {
            attrNotFound: 'Характеристика не указана',
            measuresNotFound: `Единиц измерения для '${attrName}' не задано`,
        }, [allVisible, setAllVisible] = useState<boolean>(false), [searchErr, setSearchErr] = useState<string>(errors.attrNotFound), [selectedMeasure, setSelectedMeasure] = useState<MeasureItem>(),
        popconfirm = useRef<HTMLAnchorElement>(null), {
            allMeasures,
            searchedMeasures,
            isLoading
        } = useAppSelector(state => state.measuresReducer), dispatch = useAppDispatch(),
        selectHand: SelectProps['onSelect'] = (id: any) => {
            const measure = allMeasuresUniq.filter(el => el.id === id)?.[0]
            if (measure) {
                popconfirm?.current?.click()
                setSelectedMeasure(measure)
            }
        }, saveMeasureForAttr = () => {
            if (selectedMeasure && 'name' in selectedMeasure)
                dispatch(editMeasure({name: selectedMeasure.name, attrName}))
                    .then((data: any) => {
                        if ('error' in data)
                            notification.error({
                                message: data.payload?.message || 'Неизвестная ошибка', placement: 'bottomRight'
                            })
                        else {
                            notification.success({
                                message: 'Выполнено', placement: 'bottomRight'
                            })
                            dispatch(fetchMeasuresInAttr({attr: attrName, force: true}))
                        }
                    })
        }, searchMeasures = () => {
            setAllVisible(false)
            if (attrName.trim()) {
                setSearchErr('')
                dispatch(fetchMeasuresInAttr({attr: attrName}))
                    .then((data: any) => {
                        if ('error' in data)
                            setSearchErr(data.payload?.message)
                    })
                return
            }
            setSearchErr(errors.attrNotFound)
        }, getAllMeasures: LinkProps['onClick'] = e => {
            e.preventDefault()
            dispatch(fetchAll())
            setAllVisible(true)
        }, allMeasuresUniq = useMemo(() => {
            if (allMeasures.length) {
                return allMeasures.filter((measure) => {
                    for (const searchedMeasure of searchedMeasures) {
                        if (measure.id === searchedMeasure.id) return false
                    }
                    return true
                })
            }
            return []
        }, [allMeasures, searchedMeasures]), dropdownInteractive: SelectProps['dropdownRender'] = (menu) => (
            <>
                {menu}
                {(allVisible || searchErr) ? null : (
                    <>
                        <Divider style={{margin: '8px 0'}}/>
                        <Space align="center" style={{padding: '0 8px 4px'}}>
                            <Typography.Link onClick={getAllMeasures}>
                                Показать все...
                            </Typography.Link>
                        </Space>
                    </>
                )}
                {(searchErr !== errors.measuresNotFound && searchErr) ? null : <MeasureCreateForm attrName={attrName}/>}
            </>
        );


    return (
        <>
            <Popconfirm title={`Запомнить '${selectedMeasure?.name}' по умолчанию для '${attrName}'`} okText={'да'} cancelText={'нет'} onConfirm={saveMeasureForAttr}>
                <a href={'#'} ref={popconfirm}/>
            </Popconfirm>
            <Form.Item
                name={[name, 'attrMeasure']} style={{height: '0px', margin: '-15px -9px 0 -9px'}}
                rules={[{required: true, message: ''}]}
            >
                <Select
                    dropdownMatchSelectWidth={false}
                    style={{width: 'auto'}}
                    onFocus={searchMeasures}
                    dropdownRender={dropdownInteractive}
                    onSelect={selectHand}
                >
                    {!isLoading && searchedMeasures.length && !searchErr?
                        <Select.OptGroup label={`Найденные для '${attrName}'`}>
                            {searchedMeasures.map((measure) => (
                                <Select.Option key={measure.id} value={measure.id}>{measure.name}</Select.Option>
                            ))}
                        </Select.OptGroup>
                        : <Select.Option disabled value={'err'}>{ searchErr || errors.measuresNotFound }</Select.Option>
                    }

                    {!isLoading && allMeasuresUniq.length && allVisible?
                        <>
                            <Select.OptGroup label={`Остальные`} >
                                {allMeasuresUniq.map((measure) => (
                                    <Select.Option key={measure.id} value={measure.id}>{measure.name}</Select.Option>
                                ))}
                            </Select.OptGroup>
                        </>
                        : null
                    }
                </Select>
            </Form.Item>
        </>

    );
};

export default MeasureDropdown;
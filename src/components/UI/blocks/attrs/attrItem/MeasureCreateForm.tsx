import React, {FC, useEffect, useState} from 'react';
import {Divider, Form, FormItemProps, Input, Space, Typography} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {LinkProps} from "antd/lib/typography/Link";
import {addMeasure, fetchAll, fetchMeasuresInAttr} from "../../../../../store/reducers/MeasuresSlice";
import {useAppDispatch, useAppSelector} from "../../../../../hooks/redux";

interface MeasureCreateFormProps {
    attrName: string
}

const MeasureCreateForm: FC<MeasureCreateFormProps> = ({attrName}) => {
    const [measureName, setMeasureName] = useState<string>('')
    const [createErr, setCreateErr] = useState<string>('')

    const {isLoading} = useAppSelector(state => state.measuresReducer)
    const dispatch = useAppDispatch()

    const addMeasureHand: LinkProps['onClick'] = e => {
        e.preventDefault()
        setCreateErr('')
        if (measureName.trim())
            dispatch(addMeasure({name: measureName, attrName: attrName}))
                .then((data: any) => {
                    if ('error' in data)
                        setCreateErr(data.payload.message)
                    else {
                        dispatch(fetchMeasuresInAttr({attr: attrName, force: true}))
                        dispatch(fetchAll(true))
                        setMeasureName('')
                    }
                })
        else
            setCreateErr('Это поле не должно быть пустым')
    }



    return (
        <>
            <Divider style={{margin: '8px 0'}} />
            <Space align="center" style={{ padding: '0 8px 4px' }}>
                <Form>
                    <Form.Item style={{margin: '0', maxWidth: '120px'}} validateStatus={createErr ? 'error' : ''} help={createErr || ''}>
                        <Input placeholder={"Создать..."} value={measureName} style={{maxWidth:'100px'}} onChange={(e)=> setMeasureName(e.target.value)}/>
                        <Typography.Link onClick={addMeasureHand} style={{ whiteSpace: 'nowrap', marginLeft: '5px' }}>
                            <PlusOutlined />
                        </Typography.Link>
                    </Form.Item>
                </Form>
            </Space>
        </>
    );
};

export default MeasureCreateForm;
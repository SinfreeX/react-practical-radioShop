import React, {FC, useCallback, useEffect, useMemo, useRef, useState, Validator} from 'react';
import {
    Button,
    Col,
    Divider,
    Form,
    FormItemProps,
    Input,
    notification,
    Popconfirm,
    Row,
    Select,
    Space,
    Typography
} from "antd";
import MyAutocomplete from "../../../autocomplete/MyAutocomplete";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {FormListFieldData} from "antd/lib/form/FormList";
import MeasureDropdown from "./MeasureDropdown";
import {apiSlice} from "../../../../../services/AttributeService";
import {SelectProps} from "antd/lib/select";

interface AttrItemProps {
    restField: FormListFieldData
    remove:  (index: (number | number[])) => void
}



const AttrItem: FC<AttrItemProps> = ( {restField: {key, name, ...restField}, remove}) => {
    const [attrVal, setAttrVal] = useState<string>('')
    const {data: attr, status, error, isError } = apiSlice.useGetAttributeQuery(attrVal,{skip: !attrVal})
    const [createAttrAPI] = apiSlice.useAddAttributeMutation()
    const popconfirm = useRef<HTMLAnchorElement>(null)
    const err = error as any

    useEffect(() => {
        if(status === 'rejected') popconfirm?.current?.click()
    }, [status])

    const createAttr = () => {
        createAttrAPI(attrVal).then((resp: any) => {
            'error' in resp ?
                notification.error({ message: resp.error?.data?.message || 'Неизвестная ошибка', placement: 'bottomRight' })
            : notification.success({ message: 'Выполнено', placement: 'bottomRight'})
        })
    }

  return(
      <>
          <Row>
              <Col span={12}>
                  <Popconfirm title={`Характеристика ${attrVal} не существует, создать?`} okText={'да'} cancelText={'нет'} onConfirm={createAttr}>
                      <a href={'#'} ref={popconfirm}/>
                  </Popconfirm>
                  <Form.Item
                      wrapperCol={{span: 22}}
                      {...restField}
                      name={[name, 'attrName']} style={{width: '100%'}}
                      validateTrigger={['onBlur']}
                      hasFeedback={status === 'pending' || status === 'rejected'}
                      validateStatus={status === 'rejected' ? 'error' : status === 'pending' ? 'validating' : undefined }
                      help={isError ? err.data.message : undefined}
                      rules={[{required: true, message: 'Не указано название характеристики'}]}
                  >
                      <MyAutocomplete
                          type={'attrs'}
                          placeholder={"Название характеристики"}
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {setAttrVal(e.target.value)}}
                      />
                  </Form.Item>
              </Col>
              <Col span={10}>
                  <Form.Item
                      {...restField}
                      name={[name, 'attrValue']}
                      rules={[{required: true, message: 'Не указано значение характеристики'}]}
                  >
                      <Input placeholder={"Значение характеристики"} addonAfter={<MeasureDropdown restField={{key, name, ...restField}} attrName={attrVal}/>}/>
                  </Form.Item>
              </Col>
              <Col span={2}>
                  <MinusCircleOutlined onClick={() => remove(name)}/>
              </Col>
          </Row>
      </>

    );
};

export default AttrItem;
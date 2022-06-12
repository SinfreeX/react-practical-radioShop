import React, {useRef, useState} from 'react';
import {Radio, Col, Divider, Form, Input, Row, Button, InputNumber} from "antd";
import Title from "antd/es/typography/Title";
import {InfoCircleOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import MyAutocomplete from "../components/UI/autocomplete/MyAutocomplete";
import AttrsBlock from "../components/UI/blocks/attrs/AttrsBlock";

import CategoryTree from "../components/UI/blocks/category/CategoryTree";
import ImageBlock from "../components/UI/blocks/imageBlock/ImageBlock";




const AdminPage = () => {
    const [available, setAvailable] = useState(true)




    const onFinish = (values:any) => {
        console.log('sucsess: ', values)
    }

    const onFinishFiled = (values:any) => {
        console.log('failed: ', values)
    }

    const availableChange = (e:any) => {
        setAvailable(e.target.value)
    }

    const treeValidator = (_: any, value: any) => {
        if (value.checked.length > 0){
            return Promise.resolve()
        }
        return Promise.reject(new Error('Ни одна категория не выбрана'))
    }


    return (
        <>
            <Form name="basic" labelCol={{span: 16}} wrapperCol={{span: 20}} initialValues={{remember: true}} onFinish={onFinish} onFinishFailed={onFinishFiled} autoComplete="off" layout="vertical">
                <Row>
                    <Col span={24}>
                        <Title level={3}>Добавление нового товара</Title>
                    </Col>
                </Row>
                <Divider style={{marginTop:10}}/>
                <Row justify={"start"}>
                    <Col span={14}>
                        <Form.Item label="Название"  labelCol={{span: 4}} name="name" rules={[{required: true, message: 'Введите название товара'}]}>
                            <MyAutocomplete type={'products'} placeholder={'Название товара'}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Divider style={{marginTop:10}}/>
                <Row>
                    <Col span={14}>
                        <Row>
                            <Col span={12}>
                                <Form.Item label={"Цена"} name="price" rules={[{required: true, message: 'Укажите цену товара'}]}>
                                    <InputNumber addonAfter={'₽'} placeholder={'118'}/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={" "} >
                                    <Radio.Group onChange={availableChange} defaultValue={true} buttonStyle={"solid"}>
                                        <Radio.Button value={true}>В наличии</Radio.Button>
                                        <Radio.Button value={false}>Под заказ</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item name={'nomenclature'} label={"Номенклатурный номер"}>
                                    <Input placeholder={'327418145'}/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                {available?
                                    <Form.Item name={'availability'} label={"Остаток"} >
                                        <InputNumber addonAfter={'шт'} placeholder={'18'} />
                                    </Form.Item>
                                    :
                                    <Form.Item name={'deliveryTime'} label={"Срок доставки"} >
                                        <InputNumber addonAfter={'дней'} placeholder={'7'}/>
                                    </Form.Item>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item name={'vendorCode'} label={"Код производителя"}>
                                    <Input placeholder={'GRM2165C1H1R8CD01D'}/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name={'manufacturer'} label={"Производитель"}>
                                    <MyAutocomplete type={'vendors'} placeholder={'samsung'} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider style={{marginTop:10}}/>
                        <Row justify={"center"}>
                            <Col span={24}>
                                <AttrsBlock/>
                            </Col>
                        </Row>
                    </Col>
                    <Divider type={'vertical'} style={{height: 'auto', marginRight: '25px'}}/>
                    <Col span={8} >
                        <Form.Item name={'category'} label={'Категория'} rules={[{ validator: treeValidator}]}>
                            <CategoryTree/>
                        </Form.Item>
                    </Col>
                </Row>
                <Divider style={{marginTop:10}}/>
                <Row>
                    <Col span={24}>
                        <ImageBlock/>
                    </Col>
                </Row>
                <Divider style={{marginTop:10}}/>
                <Row justify={"end"}>
                    <Col span={10} >
                        <Form.Item>
                            <Button style={{width: '300px'}} size={'large'} type={'primary'} htmlType={'submit'}>
                                Добавить
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default AdminPage;
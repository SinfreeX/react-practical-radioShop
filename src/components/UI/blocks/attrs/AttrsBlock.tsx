import React from 'react';
import {Button, Form, Space} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import AttrItem from "./attrItem/AttrItem";
import {Simulate} from "react-dom/test-utils";

const AttrsBlock = (formRef:any) => {



    return (
        <Form.List name={'attrs'}>
            {(fields, {add, remove}) => (
                <>
                    {fields.map((field) => (
                        // <Space  style={{display: 'flex', marginBottom: 8}} align={'baseline'} >
                            <AttrItem key={field.key} restField={field} remove={remove}/>
                        // </Space>
                    ))}
                    <Form.Item>
                        <Button type={"dashed"} onClick={() => add()} block icon={<PlusOutlined />}>
                            Добавить характеристику к товару
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
    );
};

export default AttrsBlock;
import React, {useEffect, useState} from 'react';
import {Form, Input, notification, Popconfirm, Typography} from "antd";
import {PlusCircleOutlined} from "@ant-design/icons";

const InputTooltip = ({operator, children}: any) => {
    const [visible, setVisible] = useState(false)
    const [value, setValue] = useState('')
    const [validation, setValidation] = useState({})


    const [createObj,{isLoading, isSuccess, isError, error, reset}] = operator.api()

    // console.log('InputTooltip - render')
    // console.log(operator.api)
    // console.log(isSuccess)
    
    const successHand = () => {
        notification.success({
            message: operator.data.message.replace('$target', value), placement: 'bottomRight'
        })
        reset()
        clear()
    }
    
    const errorHand = () => {
        setValidation({
            help: error.data.message,
            validateStatus: "error",
        })
    }
    
    useEffect(() => {
        if (isSuccess) successHand()
        if (isError) errorHand()
    },[isError, isSuccess])

    const saveData = () => {
        try {
            console.log(operator.data)
            createObj({name: value, ...operator.data})
        }catch (e){
            console.log(e)
        }
    }

    const clear = () => {
        setVisible(false)
        setValidation({})
        setValue('')
    }

    return (
        <Popconfirm
            visible={visible}
            onConfirm={saveData}
            onCancel={clear}
            okButtonProps={{ loading: isLoading}}
            overlayStyle={{maxWidth:'350px'}}
            icon={<PlusCircleOutlined  />}
            title={
                <>
                    <Typography.Title level={5}>Введите название нового раздела</Typography.Title>
                    <Form>
                        <Form.Item style={{margin:0}} {...validation}>
                            <Input value={value} onChange={e => setValue(e.target.value)}/>
                        </Form.Item>
                    </Form>
                </>

            } >
            <a onClick={() => setVisible(true)} href={'#'}>{children}</a>
        </Popconfirm>
    );
};

export default InputTooltip;
import React, {useEffect, useState} from 'react';
import {Modal, Upload, UploadProps} from "antd";
import { UploadFile} from "antd/lib/upload/interface";
import {PlusOutlined} from "@ant-design/icons";
import axios from "axios";



const ImageBlock = () => {
    const [previewVisible, setPreviewVisible] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([])

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) { file.preview = 'http://localhost:5000/img/'+file.response.name }
        setPreviewVisible(true)
        setPreviewImage(file.url || (file.preview as string))
        setPreviewTitle(file.response.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))
    }

    const handleChange: UploadProps['onChange'] = ({fileList: newFileList}) => {
        setFileList(newFileList)
    }

    useEffect(() => {
        axios.get('http://localhost:5000/files')
            .then(({data}) => {
                setFileList(data.map((e: any) => ({
                    name: e.name,
                    size: e.fullSize,
                    status: 'done',
                    thumbUrl: `http://localhost:5000/img/compressed/${e.name}`,
                    preview: `http://localhost:5000/img/${e.name}`
                })))
            })
    },[])


    const handRemove: UploadProps["onRemove"] = (file) => {
        console.log(file)
        const name = file?.response?.name ? file.response.name : file.name
        axios.delete('http://localhost:5000/files', {
            data:{name}
        })
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    )

    return (
        <>
            <Upload
                accept={'image/*'}
                action={'http://localhost:5000/files'}
                listType={'picture-card'}
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                onRemove={handRemove}
            >
                {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={() => setPreviewVisible(false)}>
                <img alt={'preview'} style={{width: '100%'}} src={previewImage}/>
            </Modal>
        </>
    );
};

export default ImageBlock;
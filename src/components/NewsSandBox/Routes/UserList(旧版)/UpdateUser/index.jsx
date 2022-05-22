import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
import '../../../../../../axios'
import axios from 'axios'
import { nanoid } from 'nanoid'

const { Option } = Select;


const CollectionCreateForm = ({ visible, onCreate, onCancel, regions, roleList, itemDate ,flag1}) => {
    const [form] = Form.useForm();
    // 选择超级管理员时禁用区域选择
    const [isRegionDisabled, setIsRegionDisabled] = useState(false)
    const updateForm = useRef(null)
    const [date, setDate] = useState([])
    // console.log(itemDate.username + 'ccf')
    // console.log(itemDate.username + 'lllll')
    // console.log(date + '...................')
    useEffect(() => {
        console.log(itemDate.username+"qqqqqqqqqqqqq")
        // console.log(date+'刚开始')
        setDate(itemDate)
        console.log(date.username+'eeeeeeeeeeeeeeeeeee')
        // console.log(updateForm.current)
        // console.log('1111111111111111111111')
        // updateForm.current.setFieldsValue({region:'111'})   
    },[flag1])
    return (
        <>
            <Modal
                visible={visible}
                title="增加用户"
                okText="确认"
                cancelText="取消"
                onCancel={() => {
                    onCancel();
                    // 每次取消后把输入的数据删除
                    // updateForm.current.resetFields()
                }}
                onOk={() => {
                    // 表单校验
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            onCreate(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >

                <Form
                    ref={updateForm}
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    // initialValues={
                    //     {
                    //         username:itemDate.username
                    //     }

                    // }
                >
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                        initialValue={itemDate.username}
                    >
                        <Input type="textarea" />
                        {/* <button>{itemDate.username}</button> */}
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码!',
                            },
                        ]}
                        // initialValue={itemDate.password}
                    >
                        <Input type="textarea" />
                    </Form.Item>
                    <Form.Item
                        name="region"
                        label="区域"
                        rules={[
                            {
                                required: true,
                                message: '请选择区域!',
                            }
                        ]}
                        // initialValue={itemDate.region}
                    >
                        <Select
                            showSearch
                            placeholder="选择区域"
                            optionFilterProp="children"
                            // onChange={onChange}
                            // onSearch={onSearch}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            // defaultValue={itemDate.region}
                            disabled={isRegionDisabled}
                        >
                            {
                                regions.map((region) => {
                                    return <Option value={region.value} key={region.id}>{region.title}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="roleId"
                        label="角色"
                        rules={[
                            {
                                required: true,
                                message: '请选择角色!',
                            },
                        ]}
                        // initialValue={itemDate.roleId}
                    >
                        <Select
                            showSearch
                            placeholder="选择角色"
                            optionFilterProp="children"
                            onChange={(value) => {
                                // 默认value是name:roleId
                                if (value === 1) {
                                    setIsRegionDisabled(true)
                                } else {
                                    setIsRegionDisabled(false)
                                    // addForm.current.setFieldsValue(
                                    //     { region: '' }
                                    // )
                                }
                            }}
                        // defaultValue={itemDate.id}
                        // defaultValue={itemDate.role.roleName}
                        // defaultValue={itemDate.roleId}
                        // onSearch={onSearch}
                        // filterOption={(input, option) =>
                        //     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        // }
                        >
                            {
                                roleList.map((role) => {
                                    return <Option value={role.id} key={role.id}>{role.roleName}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </Modal >
        </>
    );
};

export default function CollectionsPage({
    isUpdateUservisible,
    setIsUpdateUservisible,
    itemDate,
    setFlag ,
flag1}) {
    // const [isAddUservisible, setIsAddUservisible] = useState(false);
    const [roleList, setRoleList] = useState([])
    const [regions, setRegions] = useState([])
    useEffect(() => {
        axios.get('/regions').then(
            res => {
                setRegions(res.data)
            }
        )
        axios.get('/roles').then(
            res => {
                setRoleList(res.data)
            }
        )
    }, [])

    // console.log(itemDate)

    const onCreate = (values) => {
        console.log('Received values of form: ', values);
        setIsUpdateUservisible(false);
        // 把表单数据保存在参数中
        // setFormData(values)
        console.log(values)
        axios.post('/users', {
            ...values,
            "roleState": true,
            "default": false,
        }).then(res => { console.log(res.data) })
        setFlag(nanoid())
    };
    return (
        <div>
            <CollectionCreateForm
                visible={isUpdateUservisible}
                onCreate={onCreate}
                onCancel={() => {
                    setIsUpdateUservisible(false);
                    // addForm.current.resetFields()
                    
                }}
                regions={regions}
                roleList={roleList}
                itemDate={itemDate}
                flag1={flag1}
            />
        </div>
    );
}

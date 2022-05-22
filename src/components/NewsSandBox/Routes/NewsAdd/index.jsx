import React, { useState, useEffect, useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd'
import NewsEditor from '../../NewsEditor'
import '../../../../../axios'
import axios from 'axios'
import './index.css'
import { useNavigate } from 'react-router-dom'

const { Step } = Steps
const { Option } = Select

export default function NewsAdd() {
    const [currentStep, setCurrentStep] = useState(0)
    const [categoriesList, setCategoriesList] = useState([])
    // draft编辑器的内容
    const [formInfo, setFormInfo] = useState([])
    const [draftContent, setDraftContent] = useState('')

    useEffect(() => {
        axios.get('/categories').then(res => {
            setCategoriesList(res.data)
        })

    }, [])

    const ref = useRef()

    const navigate = useNavigate()

    const handleNext = () => {
        if (currentStep === 0) {
            ref.current.validateFields().then(res => {
                console.log(res)
                setFormInfo(res)
                setCurrentStep(currentStep + 1)
            }).catch(error => {
                console.log(error)
            })
        } else {
            if (draftContent === '' || draftContent.trim() === '<p></p>') {
                message.error('请输入新闻内容！')
            } else {
                setCurrentStep(currentStep + 1)
            }
        }
    }

    const userData = JSON.parse(localStorage.getItem('token'))
    // auditState传0代表存至草稿箱，传1提交审核
    const handleSave = (auditState) => {
        axios.post('/news', {
            "title": formInfo.newsTitle,
            "categoryId": formInfo.newsCatagory,
            "content": draftContent,
            "region": userData.region,
            "author": userData.username,
            "roleId": userData.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            // "id": 1,  后端自增长
            // "publishTime": 1615778496314
        }).then(res => {
            navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/audit')
            notification.info({
                message: auditState === 0 ? '保存成功！' : '提交成功！',
                description:
                    auditState === 0 ? '您已经成功保存文稿至草稿箱，可以在草稿箱中浏览您保存的草稿！' :
                        '您已成功提交审核，可以在审核列表中查看您提交的文稿！',
                placement: 'bottomRight',
            }, err => {
                notification.info({
                    message: auditState === 0 ? '保存失败！' : '提交失败！',
                    description:
                        auditState === 0 ? '保存失败，请检查网络后重试！' :
                            '提交审核失败，请检查网络后重试！',
                    placement: 'bottomRight',
                })
            });
        })

    }

    return (
        <div>
            <PageHeader
                className="site-page-header"
                // onBack={() => null}
                title={<div style={{ fontSize: '30px', textShadow: '1px 1px 1px gray' }} >撰写新闻</div>}
            // subTitle="This is a subtitle"
            />
            <Steps current={currentStep}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主题内容" />
                <Step title="新闻提交" description="保存草稿或提交审核" />
            </Steps>
            <div style={{ marginTop: '20px' }}>
                {<div style={{ display: currentStep === 0 ? '' : 'none' }}>
                    <Form
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 21 }}
                        ref={ref}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="newsTitle"
                            rules={[{ required: true, message: '请输入新闻标题!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="新闻分类"
                            name="newsCatagory"
                            rules={[{ required: true, message: '请选择新闻类别!' }]}
                        >
                            <Select style={{ width: '100%' }} >
                                {
                                    categoriesList.map(item =>
                                        <Option value={item.id} key={item.id}>{item.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>}
                {<div style={{ display: currentStep === 1 ? 'inline-block' : 'none', width: '100%' }}>
                    <NewsEditor sendContent={(value) => {
                        console.log(value)
                        setDraftContent(value)
                    }} />
                </div>}
                {<div style={{ display: currentStep === 2 ? '' : 'none' }}>
                    <span style={{ fontSize: '30px', margin: '20px 0 20px 20px' }}>请将您撰写的新闻提交审核或存至草稿箱！</span>
                </div>}
            </div>
            <div style={{ marginTop: '20px' }}>
                {/* {currentStep < 2 && <Button type='primary' onClick={() => { setCurrentStep(currentStep + 1) }}>下一步</Button>} */}
                {/* {currentStep >0 && <Button type='primary' onClick={() => { setCurrentStep(currentStep - 1) }}>上一步</Button>} */}
                <Button type='primary' disabled={currentStep === 2 ? true : false} onClick={handleNext}>下一步</Button>
                &nbsp;
                &nbsp;
                <Button type='primary' disabled={currentStep === 0 ? true : false} onClick={() => { setCurrentStep(currentStep - 1) }}>上一步</Button>
                &nbsp;
                &nbsp;
                <Button type='primary' disabled={currentStep !== 2 ? true : false} onClick={() => { handleSave(0) }}>保存至草稿箱</Button>
                &nbsp;
                &nbsp;
                <Button type='primary' disabled={currentStep !== 2 ? true : false} onClick={() => { handleSave(1) }}>提交审核</Button>
            </div>
        </div>
    )
}

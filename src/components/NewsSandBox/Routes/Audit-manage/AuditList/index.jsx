import React, { useEffect, useState } from 'react'
import { Table, Button, Tag,notification } from 'antd'
import '../../../../../../axios'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function AuditList() {
    const [auditList, setAuditList] = useState([])

    const { username } = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(
            res => {
                setAuditList(res.data)
            }
        )
    }, [username])

    const navigate = useNavigate()

    const columns = [
        {
            title: () => { return <div style={{ fontSize: '16px' }}>ID</div> },
            dataIndex: 'id',
            // width: '20%',
            align: 'center',
            render: (id) => {
                return <div>{id}</div>
            }
        },
        {
            title: () => { return <div style={{ fontSize: '16px' }}>新闻标题</div> },
            dataIndex: 'title',
            // width: '20%',
            align: 'center',
            render: (title, item) => {
                return <a href={`http://localhost:3000/#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: () => { return <div style={{ fontSize: '16px' }}>作者</div> },
            dataIndex: 'author',
            align: 'center',
            render: (author) => {
                return <div>{author}</div>
            }
        },
        {
            title: () => { return <div style={{ fontSize: '16px' }}>新闻分类</div> },
            dataIndex: 'category',
            align: 'center',
            render: (category) => {
                return <div>{category.value}</div>
            }
        },
        {
            title: () => { return <div style={{ fontSize: '16px' }}>审核状态</div> },
            dataIndex: 'auditState',
            align: 'center',
            render: (auditState) => {
                const auditKinds = ['未审核', '审核中', '已通过', '未通过']
                const colorKinds = ['black', 'orange', 'green', 'red']
                return <Tag color={colorKinds[auditState]}>{auditKinds[auditState]}</Tag>
            }
        },

        {
            title: () => { return <div style={{ fontSize: '16px' }}>操作</div> },
            align: 'center',
            render: (item) => {
                return (
                    <div>
                        {item.auditState === 1 && <Button danger onClick={()=>{handleRervert(item)}}>撤销</Button>}
                        {item.auditState === 2 && <Button type='primary' onClick={()=>{handlePublish(item)}}>发布</Button>}
                        {item.auditState === 3 && <Button onClick={()=>{handleDelete(item)}}>删除</Button>}
                    </div>
                )
            }
        }
    ];

    const handleRervert=(item)=>{
        axios.patch(`/news/${item.id}`,{
            auditState : 0 
        }).then(res=>{
            setAuditList(auditList.filter((data)=>{return data.id!== item.id}))
            notification.info({
                message: '撤销成功！',
                description:
                '撤销成功，您可以在草稿箱中查看您撤销的新闻！',
                placement: 'bottomRight',
            })
        },err=>{
            notification.info({
                message: '撤销失败！',
                description:
                '提交审核失败，请检查网络后重试！',
                placement: 'bottomRight',
            })
        })
    }

    const handlePublish=(item)=>{
        axios.patch(`/news/${item.id}`,{
            publishState : 2 
        }).then(res=>{
            setAuditList(auditList.filter((data)=>{return data.id!== item.id}))
            notification.info({
                message: '发布成功！',
                description:
                '发布成功，您可以在发布管理-已发布中查看您发布的新闻！',
                placement: 'bottomRight',
            })
            navigate('/publish-manage/published')
        },err=>{
            notification.info({
                message: '发布失败！',
                description:
                '发布失败，请检查网络后重试！',
                placement: 'bottomRight',
            })
        }) 
    }


    const handleDelete=(item)=>{
        axios.delete(`/news/${item.id}`)
        .then(res=>{
            setAuditList(auditList.filter((data)=>{return data.id!== item.id}))
            notification.info({
                message: '删除成功！',
                description:
                '删除成功，因为懒得做回收站功能，所以删了就啥都看不到喽！',
                placement: 'bottomRight',
            })
        },err=>{
            notification.info({
                message: '删除失败！',
                description:
                '删除失败，请检查网络后重试！',
                placement: 'bottomRight',
            })
        }) 
    }


    return (
        <div>
            <Table dataSource={auditList} columns={columns} bordered pagination={{ pageSize: 5 }} rowKey={item => item.id} />
        </div>
    )
}

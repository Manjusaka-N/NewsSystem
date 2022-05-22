import React, { useEffect, useState } from 'react'
import { Table ,notification} from 'antd'
import '../../../../../../axios'
import axios from 'axios'

export default function Audit() {
    const [data, setData] = useState([])

    const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        axios.get('news?auditState=1&_expand=category').then(res => {
            const list = res.data
            console.log(roleId)
            setData(roleId === 1 ? list :
                [...list.filter((item) => { return item.author === username }),
                ...list.filter((item) => { return item.region === region && item.roleId === 3 })]
            )
            setTimeout(() => {
                console.log(data)
            }, 2000);
        })
    }, [])

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
            title: () => { return <div style={{ fontSize: '16px' }}>操作</div> },
            align: 'center',
            render: (item) => {
                return <div>
                    <span title='通过审核' style={{ cursor: 'pointer' }}>
                        <svg onClick={() => { handleAudit(item,2,1) }} title='通过' t="1649494382426" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7575" width="22" height="22"><path d="M313.134255 475.396337l121.552403 241.612827c0 0 197.417255-490.988454 508.857427-654.643768-7.575536 116.885104-37.969776 218.207767 15.152095 342.936513-136.700405 31.166837-417.765779 381.946992-508.929058 553.383526C320.714907 795.008632 168.720168 670.279886 62.396607 631.270431L313.134255 475.396337 313.134255 475.396337 313.134255 475.396337zM313.134255 475.396337" p-id="7576"></path></svg>
                        &nbsp;
                    </span>
                    <span title='驳回审核' style={{ cursor: 'pointer' }}>
                        <svg onClick={() => { handleAudit(item,3,0) }} title='驳回' t="1649494288967" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5170" width="22" height="22"><path d="M512 0C229.376 0 0 229.376 0 512s229.376 512 512 512 512-229.376 512-512S794.624 0 512 0z m218.624 672.256c15.872 15.872 15.872 41.984 0 57.856-8.192 8.192-18.432 11.776-29.184 11.776s-20.992-4.096-29.184-11.776L512 569.856l-160.256 160.256c-8.192 8.192-18.432 11.776-29.184 11.776s-20.992-4.096-29.184-11.776c-15.872-15.872-15.872-41.984 0-57.856L454.144 512 293.376 351.744c-15.872-15.872-15.872-41.984 0-57.856 15.872-15.872 41.984-15.872 57.856 0L512 454.144l160.256-160.256c15.872-15.872 41.984-15.872 57.856 0 15.872 15.872 15.872 41.984 0 57.856L569.856 512l160.768 160.256z" fill="#CF3736" p-id="5171"></path></svg>
                    </span>
                </div>
            }
        }
    ]

    const handleAudit = (item,auditState,publishState) => {
        axios.patch(`/news/${item.id}`,{
            auditState,
            publishState
        }).then(res=>{
            setData(data.filter((obj)=>{return obj.id!== item.id}))
            notification.info({
                message: auditState===2?'审核成功！':'驳回成功',
                description:
                auditState===2?
                '审核成功，您可以在审核列表中查看您审核的新闻！':
                '驳回成功，啦啦啦啦啦！',
                placement: 'bottomRight',
            })
        },err=>{
            notification.info({
                message: auditState===2?'审核失败！':'驳回失败',
                description:
                auditState===2?
                '审核失败，请检查网络后重试！':
                '驳回失败，请检查网络后重试！',
                placement: 'bottomRight',
            })
        })
    }

    return (
        <div>
            <Table dataSource={data} columns={columns} bordered pagination={{ pageSize: 5 }} rowKey={item => item.id} />
        </div>
    )
}

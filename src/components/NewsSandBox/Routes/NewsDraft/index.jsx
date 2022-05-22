import React, { useEffect, useState } from 'react'
import { Table, Modal,notification } from 'antd'
import { DeleteTwoTone, EditTwoTone, ExclamationCircleOutlined } from '@ant-design/icons'
import '../../../../../axios'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const { confirm } = Modal


export default function NewsDraft() {
  const [draftData, setDraftData] = useState([])
  const [flag, setFlag] = useState(0)
  const userData = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get(`/news?author=${userData.username}&auditState=0&_expand=category`).then(
      res => {
        // console.log(res.data)
        setDraftData(res.data)
      }
    )
  }, [flag])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      width: '15%'
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      align: 'center',
      render: (title, item) => {
        return <a href={`http://localhost:3000/#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
      align: 'center',
    },
    {
      title: '分类',
      align: 'center',
      render: (item) => {
        return <div>{item.category.value}</div>
      }
    },
    {
      title: '操作',
      align: 'center',
      render: (item) => {
        return <div>
          <DeleteTwoTone style={{ fontSize: '22px' }} twoToneColor="#f38282" onClick={() => { showDeleteConfirm(item) }} />
          &nbsp;
          &nbsp;
          <EditTwoTone style={{ fontSize: '22px' }} />
          &nbsp;
          &nbsp;
          <svg onClick={() => { handelSubmit(item.id) }} style={{ position: 'relative', top: '2px' }} t="1649318224333" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3938" width="22" height="22"><path d="M450.048 919.552H200.192c-15.36 0-28.16-12.8-28.16-28.16v-757.76c0-15.36 12.8-28.16 28.16-28.16H824.32c15.36 0 28.16 12.8 28.16 28.16v412.672c0 15.36-15.36 28.16-30.72 28.16s-30.72-12.8-30.72-28.16V166.912H233.472v690.688h216.576c15.36 0 28.16 15.36 28.16 30.72 0 15.872-12.288 31.232-28.16 31.232z" fill="#1296db" p-id="3939"></path><path d="M667.136 366.592H343.04c-15.36 0-28.16-12.8-28.16-28.16s12.8-28.16 28.16-28.16h324.608c15.36 0 28.16 12.8 28.16 28.16s-12.8 28.16-28.672 28.16z m-120.32 137.728H343.04c-15.36 0-28.16-12.8-28.16-28.16s12.8-28.16 28.16-28.16h204.288c15.36 0 28.16 12.8 28.16 28.16s-12.8 28.16-28.672 28.16zM452.608 645.12H343.04c-15.36 0-28.16-12.8-28.16-28.16S327.68 588.8 343.04 588.8h110.08c15.36 0 28.16 12.8 28.16 28.16s-13.312 28.16-28.672 28.16z m212.992 289.792c-8.192 0-16.384-3.072-23.04-9.728l-119.296-122.368c-12.288-12.8-12.288-32.768 0.512-45.056 12.8-12.288 32.768-12.288 45.056 0.512l96.768 99.328 193.536-188.416c12.8-12.288 32.768-12.288 45.056 0.512 12.288 12.8 12.288 32.768-0.512 45.056l-216.064 210.944c-6.144 6.144-14.336 9.216-22.016 9.216z" fill="#1296db" p-id="3940"></path></svg>
        </div>
      }
    }
  ]

  function showDeleteConfirm(item) {
    // console.log(item)
    confirm({
      title: '是否确认删除该项?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteRoleList(item)
      },
      onCancel() {
        return
      },
    });
  }

  const deleteRoleList = (item) => {
    // const newRoleList = roleList.filter((obj) => { return obj.id !== item.id })
    // setRoleList(newRoleList)
    console.log(item)
    axios.delete(`/news/${item.id}`)
    setFlag(flag + 1)
  }
  const navigate = useNavigate()

  const handelSubmit = (id) => {
    axios.patch(`/news/${id}`, {
      auditState: 1
    }).then(res => {
      navigate('/audit-manage/list')
      notification.info({
        message: '提交成功！',
        description:
            '您已成功提交审核，可以在审核列表中查看您提交的文稿！',
        placement: 'bottomRight',
      }), err => {
        notification.info({
          message:  '提交失败！',
          description:
              '提交审核失败，请检查网络后重试！',
          placement: 'bottomRight',
        })
      }
    })
  }
  return (
    <div>
      <Table columns={columns} dataSource={draftData} rowKey={(item) => item.id} bordered />
    </div>
  )
}

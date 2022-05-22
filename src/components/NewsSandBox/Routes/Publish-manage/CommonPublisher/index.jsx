import React, { useEffect, useState } from 'react'
import { Table, Button, notification, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import '../../../../../../axios'
import axios from 'axios'


const { confirm } = Modal


export default function index(props) {

    const userData = JSON.parse(localStorage.getItem('token'))
    const [list, setList] = useState([])
    useEffect(() => {
        axios.get(`/news?author=${userData.username}&publishState=${props.publishState}&_expand=category`).then(
            res => {
                setList(res.data)
            }
        )
    }, [])



    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            align: 'center',
            render: (id) => {
                return <div>{id}</div>
            }
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            align: 'center',
            render: (title, item) => {
                return <a href={`/#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
            align: 'center',
            width: '15%',
            render: (author) => {
                return <div>{author}</div>
            }
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            align: 'center',
            render: (category) => {
                return <div>{category.value}</div>
            }
        },
        {
            title: '操作',
            align: 'center',
            render: (item) => {
                return <div>
                    {props.publishState === 1 && < Button type='primary' onClick={() => { changePublishState(item, 2) }}>发布</Button>}
                    {props.publishState === 2 && < Button danger onClick={() => { changePublishState(item, 3) }}>下线</Button>}
                    {props.publishState === 3 && < Button danger onClick={() => { showDeleteConfirm(item) }}>删除</Button>}
                    {/* <DeleteTwoTone style={{ fontSize: '22px' }} twoToneColor="#f38282" onClick={() => { showDeleteConfirm(item) }} /> */}
                </div >
            }
        }
    ]


    //   const navigate = useNavigate()

    // 待发布
    function changePublishState(item, newPublishState) {

        const a = newPublishState === 2 ?
            {
                publishState: newPublishState,
                publishTime: Date.now()
            } : {
                publishState: newPublishState
            }

        axios.patch(`/news/${item.id}`, a).then(res => {
            // const newList = list.map((obj) => {
            //     if (obj.id === item.id) {
            //         return {
            //             ...obj,
            //             publishState: newPublishState
            //         }
            //     } else {
            //         return obj
            //     }
            // })
            const newList = list.filter((obj) => { return obj.id !== item.id })

            setList(newList)


            notification.info({
                message: newPublishState === 2 ? '发布成功！' : '下线成功！',
                description:
                    newPublishState === 2 ? '您已成功发布新闻，您可以在已发布中查看您发布的文稿！' :
                        '您已成功下线新闻，您可以在已下线中查看您发布的文稿！',
                placement: 'bottomRight',
            }), err => {
                notification.info({
                    message: newPublishState === 2 ? '发布失败！' : '下线失败！',
                    description:
                        newPublishState === 2 ? '发布失败，请检查网络后重试！' :
                            '下线失败，请检查网络后重试！',
                    placement: 'bottomRight',
                })
            }
        })
    }
    //   function handlePublish(item){
    //       setList(list.map((obj)=>{
    //         if(obj.id===item.id){
    //             return{
    //                 ...item,
    //                 publishState:2
    //             }
    //         }else{
    //             return obj
    //         }
    //       }))
    //       axios.patch( `/news/${item.id}`,{
    //           publishState:2
    //       })
    //   }

    // // 已发布
    // function handleSunset(item){
    //     setList(list.map((obj)=>{
    //       if(obj.id===item.id){
    //           return{
    //               ...item,
    //               publishState:3
    //           }
    //       }else{
    //           return obj
    //       }
    //     }))
    //     axios.patch( `/news/${item.id}`,{
    //         publishState:3
    //     })
    // }

    // 已下线

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
        const newList = list.filter((obj) => { return obj.id !== item.id })
        setList(newList)
        axios.delete(`/news/${item.id}`).then(res => {
            notification.info({
                message: '删除成功！',
                description:
                    '您已成功删除新闻，但因为没做已删除，所以。。。',
                placement: 'bottomRight',
            }), err => {
                notification.info({
                    message: '删除失败！',
                    description:
                        '删除新闻失败，请检查网络后重试！',
                    placement: 'bottomRight',
                })
            }
        })

    }




    return (
        <div>
            <Table columns={columns} dataSource={list} rowKey={(item) => item.id} bordered />
        </div>
    )
}

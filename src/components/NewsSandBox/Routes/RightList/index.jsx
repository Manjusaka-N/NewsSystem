import React, { useState, useEffect } from 'react'
import { Table, Tag, Modal, Popover, Switch } from 'antd'
import { DeleteTwoTone, EditTwoTone, ExclamationCircleOutlined } from '@ant-design/icons'
import './index.css'
import PubSub from 'pubsub-js'
import '../../../../../axios'
import axios from 'axios'

const { confirm } = Modal



export default function RightList() {
  const [rightList, setRightList] = useState([])
  // 设一个flag参数，删除二级菜单时改变，且发布flag给sidemenu
  const [flag, setFlag] = useState(1)
  PubSub.publish('flag', flag)
  useEffect(() => {
    // PubSub.publish('flag', flag)
    axios.get('/rights?_embed=children').then(
      res => {
        res.data.map((item) => {
          if (!item.children[0]) {
            item.children = ''
          }
        })

        setRightList(res.data)
      }
    )
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '20%',
      align:'center',
      render:(item)=>{
        return <div className='idColumn'>{item}</div>
      }
      // className:'column1'
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
      align: 'center'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      align: 'center',
      render: (item) => {
        return <Tag color="blue">{item}</Tag>
      }
    },
    {
      title: '操作',
      key: 'delete&edit',
      align: 'center',
      render: (item) => {
        return (<div>
          <DeleteTwoTone style={{ fontSize: '18px' }} twoToneColor="#f38282" onClick={() => { showDeleteConfirm(item) }} />&nbsp;
          &nbsp;<Popover content={
            <div style={{ textAlign: 'center' }}>
              <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={item.pagepermisson}
                onChange={() => {
                  item.pagepermisson = item.pagepermisson===1?0:1
                   setRightList([...rightList])
                   console.log(rightList)
                   if (item.grade===1) {
                     axios.patch(`/rights/${item.id}`,{
                       pagepermisson:item.pagepermisson
                     })
                     setFlag(flag + 1)
                   }else{
                    axios.patch(`/children/${item.id}`,{
                      pagepermisson:item.pagepermisson
                    })
                    setFlag(flag + 1)
                   }
                }} />
            </div>
          } title="页面配置项" trigger={item.pagepermisson === undefined ? '' : 'click'} >
            <EditTwoTone style={{ fontSize: '18px' }} disabled={!item.pagepermisson} />
          </Popover>
        </div>)
      }
    }
  ];
  function showDeleteConfirm(item) {
    confirm({
      title: '是否确认删除该项?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        // 点击时删除该项，从column里去获取要删除的当前项，筛选出id不为当前项的数据，重新set，重新渲染，同时删除数据库里数据，useeffect重新发送请求更新
        deleteRightList(item)
      },
      onCancel() {
        return
      },
    });
  }

  const deleteRightList = (item) => {
    console.log(item)
    if (!item.rightId) {
      const newRightList = rightList.filter((obj) => { return obj.id !== item.id })
      setRightList(newRightList)
      axios.delete(`/rights/${item.id}`)
      setFlag(flag + 1)
    } else {
      axios.delete(`/children/${item.id}`)
      setFlag(flag + 1)
    }
  }

  return (
    <div>
      <Table dataSource={rightList} columns={columns} bordered onHeaderRow={(columns,index)=>{console.log(columns,index)}}/>
    </div>
  )
}





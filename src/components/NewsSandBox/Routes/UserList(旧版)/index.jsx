import React, { useState, useEffect ,useRef} from 'react'
import { Table, Modal, Popover, Switch, Button } from 'antd'
import { DeleteTwoTone, EditTwoTone, ExclamationCircleOutlined } from '@ant-design/icons'
import { nanoid } from 'nanoid'
import AddUser from './AddUser'
import UpdateUser from './UpdateUser'
import '../../../../../axios'
import axios from 'axios'


const { confirm } = Modal

let flag1 =0

export default function UserList() {
  const [userList, setUserList] = useState([])
  const [isUpdateUservisible, setIsUpdateUservisible] = useState(false)
  // 新增表单提交时会向后台增加数据，而后改变flag值，从而使userlist重新渲染
  const [flag, setFlag] = useState(0)
  // 设一个flag参数，删除二级菜单时改变，且发布flag给sidemenu
  //把点击编辑按钮时的item值传上来，再传给UpdateUser
  const [itemDate,setItemDate] = useState([])


  useEffect(() => {
    // PubSub.publish('flag', flag)
    axios.get('/users?_expand=role').then(
      res => {
        setUserList(res.data)
      }
    )
    console.log('userlist重新渲染了')
  }, [flag])

  const columns = [
    {
      title: () => { return <div style={{ fontSize: '16px' }}>区域</div> },
      dataIndex: 'region',
      // width: '20%',
      align: 'center',
      render: (region) => {
        return <div>{region === '' ? '全球' : region}</div>
      }
    },
    {
      title: () => { return <div style={{ fontSize: '16px' }}>角色名称</div> },
      dataIndex: 'role',
      align: 'center',
      render: (role) => {
        return <div>{role.roleName}</div>
      }
    },
    {
      title: () => { return <div style={{ fontSize: '16px' }}>用户名</div> },
      dataIndex: 'username',
      align: 'center',
    },
    {
      title: () => { return <div style={{ fontSize: '16px' }}>用户状态</div> },
      dataIndex: 'roleState',
      align: 'center',
      render: (roleState, item) => {
        return <Switch
          checked={roleState}
          disabled={item.default}
          onChange={() => {
            console.log(item)
            axios.patch(`/users/${item.id}`, {
              roleState: !item.roleState
            })
            setFlag(nanoid())
          }}
        />
      }
    },
    {
      title: () => { return <div style={{ fontSize: '16px' }}>操作</div> },
      align: 'center',
      render: (item) => {
        return (<div>
          <Button shape="circle" disabled={item.default}>
            <DeleteTwoTone style={{ fontSize: '18px' }} twoToneColor="#f38282" onClick={() => { showDeleteConfirm(item) }} />
          </Button>
          &nbsp;
          &nbsp;
          {/* <Popover content={
            <div style={{ textAlign: 'center' }}>
              <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={item.pagepermisson} />
            </div>
          } title="页面配置项" trigger='click' > */}
          <Button
            shape="circle"
            disabled={item.default}
            onClick={() => {
              setIsUpdateUservisible(true)
              setItemDate(item)
              console.log(item)
              flag1++
            }}>
            <EditTwoTone style={{ fontSize: '18px' }} />
          </Button>
          {/* </Popover> */}
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
    axios.delete(`/users/${item.id}`)
    setFlag(nanoid())
  }


  return (
    <div>
      {/* <Button type="primary">增加用户</Button> */}
      <AddUser setFlag={setFlag} />
      <UpdateUser 
      isUpdateUservisible={isUpdateUservisible} 
      setIsUpdateUservisible={setIsUpdateUservisible}
      itemDate={itemDate}
      flag1={flag1}
      // ref={updateForm}
      />
      <Table dataSource={userList} columns={columns} bordered pagination={{ pageSize: 5 }} rowKey={item => item.id} />
    </div>
  )
}





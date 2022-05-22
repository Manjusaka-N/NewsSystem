import React, { useState, useEffect, useRef } from 'react'
import { Table, Modal, Switch, Button } from 'antd'
import { DeleteTwoTone, EditTwoTone, ExclamationCircleOutlined } from '@ant-design/icons'
import '../../../../../axios'
import axios from 'axios'
import AddUser from './AddUser'

const { confirm } = Modal


export default function UserList() {
  const [userList, setUserList] = useState([])
  // 新增表单提交时会向后台增加数据，而后改变flag值，从而使userlist重新渲染
  // const [flag, setFlag] = useState(0)
  // 设一个flag参数，删除二级菜单时改变，且发布flag给sidemenu

  const [isAddVisible, setIsAddVisible] = useState(false)
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)
  const [itemDate, setItemDate] = useState([])
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)

  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])

  const addUserForm = useRef()
  const updateUserForm = useRef()

  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    axios.get('/users?_expand=role').then(
      res => {
        // 如果权限不够，只能获取到自己，本地区，权限比他小的用户内容
        setUserList(roleId === 1 ? res.data : [
          ...res.data.filter(item => item.username === username),
          ...res.data.filter(item => item.region === region && item.roleId === 3)
        ])
      }
    )
    axios.get('/roles').then(
      res => {
        setRoleList(res.data)
      }
    )
    axios.get('/regions').then(
      res => {
        setRegionList(res.data)
      }
    )
  }, [])

  const columns = [
    {
      title: () => { return <div style={{ fontSize: '16px' }}>区域</div> },
      dataIndex: 'region',
      // width: '20%',
      align: 'center',
      filters: [
        // 为什么要解构？？？
        ...regionList.map((item) => {
          return {
            text: item.title,
            value: item.value
          }
        }),
        {
          text: '全球',
          value: '全球'
        }
      ],
      onFilter: (value, item) => {
        if (value === '全球') {
          return item.region === ''
        } else {
          return value === item.region
        }
      },
      render: (region) => {
        return <div>{region === '' ? '全球' : region}</div>
      }
    },
    {
      title: () => { return <div style={{ fontSize: '16px' }}>角色名称</div> },
      dataIndex: 'role',
      align: 'center',
      filters: [
        // 为什么要解构？？？
        ...roleList.map((item) => {
          return {
            text: item.roleName,
            value: item.roleName
          }
        })
      ],
      onFilter: (value, item) => {
        return value === item.role.roleName
      },
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
      filters: [
        {
          text: '开',
          value: true
        }, {
          text: '关',
          value: false
        }
      ],
      onFilter: (value, item) => {
        return value === item.roleState
      },
      render: (roleState, item) => {
        return <Switch
          checked={roleState}
          disabled={item.default}
          onChange={() => {
            item.roleState = !item.roleState
            // console.log(userList)
            setRoleList([...userList])
            // setUserList([...userList,roleState:!item.roleState])
            axios.patch(`/users/${item.id}`, {
              roleState: item.roleState
            })
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
            onClick={() => { handleUpdate(item) }}>
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
    // axios.delete(`/users/${item.id}`)
    // setFlag(nanoid())
    setUserList(userList.filter(data => data.id !== item.id))
    axios.delete(`/users/${item.id}`)
  }


  const addUserOk = () => {
    addUserForm.current.validateFields()
      .then(res => {
        axios.post('/users', {
          ...res,
          "roleState": true,
          "default": false
        }).then(res => {
          // console.log(res.data.roleId)
          const newUserDate = { ...res.data, role: roleList[res.data.roleId-1] }
          console.log(newUserDate)
            setUserList([...userList, newUserDate])
            setIsAddVisible(false)
            addUserForm.current.resetFields()
          // 把填写的值删掉

        })
      }
      )
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  }

  const handleUpdate = (item) => {

    setTimeout(() => {
      setIsUpdateVisible(true)
      if (item.roleId === 1) {
        setIsUpdateDisabled(true)
      } else {
        setIsUpdateDisabled(false)
      }
      // 不知道为什么，updateUserForm上面找不到方法，改用初始值得方法传参,用异步！！！
      updateUserForm.current.setFieldsValue(item)
      setItemDate(item)
    }, 0);
  }

  const updateUserOk = () => {
    updateUserForm.current.validateFields()
      .then(res => {
        setIsUpdateVisible(false)
        // 把填写的值删掉
        setUserList(userList.map((item) => {
          if (item.id === itemDate.id) {
            return {
              ...item,
              ...res,
              role: roleList.filter((data) => { return data.id === res.roleId })[0]
            }
          } else {
            return item
          }
        }))
        setIsUpdateDisabled(!isUpdateDisabled)

        axios.patch(`/users/${itemDate.id}`, res)
      }
      )
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  }

  return (
    <div>
      <Button type='primary' onClick={() => { setIsAddVisible(true) }}>增加用户</Button>
      <Table dataSource={userList} columns={columns} bordered pagination={{ pageSize: 5 }} rowKey={item => item.id} />
      <Modal
        visible={isAddVisible}
        title="增加用户"
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          setIsAddVisible(false)
          addUserForm.current.resetFields()
        }}
        onOk={addUserOk}
      >
        <AddUser
          roleList={roleList}
          regionList={regionList}
          ref={addUserForm} />
      </Modal>

      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateVisible(false)
          setIsUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={updateUserOk}
      >
        <AddUser
          roleList={roleList}
          regionList={regionList}
          itemDate={itemDate}
          isUpdateDisabled={isUpdateDisabled}
          ref={updateUserForm} />
      </Modal>
    </div>
  )
}




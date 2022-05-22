import React, { useState, useEffect } from 'react'
import { Table, Modal, Tree } from 'antd'
import { DeleteTwoTone, ProfileTwoTone, ExclamationCircleOutlined } from '@ant-design/icons'
import '../../../../../axios'
import axios from 'axios'

const { confirm } = Modal



export default function RoleList() {

  const [roleList, setRoleList] = useState([])
  const [rightList, setRightList] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [flag,setFlag] = useState(0)
  // 权限更改按钮

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [checkedKeys, setCheckedKeys] = useState([]);


  useEffect(() => {
    axios.get('/roles').then(
      res => {
        // console.log(res.data)
        setRoleList(res.data)
      }
    ),
      axios.get('/rights?_embed=children').then(
        res => {
          // console.log(res.data)
          setRightList(res.data)
        }
      )
  }, [flag])



  //tree的相关参数和函数
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [CheckedKeysValue, setCheckedKeysValue] = useState([]);
  // const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [itemData, setItemData] = useState([]);

  const onExpand = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onCheck = (value) => {
    console.log('onCheck', value);
    setCheckedKeys(value);
    console.log('eeee'+ value)
  };

  // 点击按钮后显示tree控件，更新选择项
  const showTree = (item) => {
    setIsModalVisible(true)
    setCheckedKeys(item)
    // setCheckedKeysValue(item.rights)
  }

  const clickOk = ()=>{
    setIsModalVisible(false)
    console.log(checkedKeys)
    axios.patch(`/roles/${itemData.id}`,{
      rights:checkedKeys
    })
    setFlag(flag+1)
  }
  // 以上为tree的相关参数和函数

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      width: '20%'
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      align: 'center',
    },
    {
      title: '权限',
      align: 'center',
      render: (item) => {
        return (<div>
          <DeleteTwoTone style={{ fontSize: '18px' }} twoToneColor="#f38282" onClick={() => { showDeleteConfirm(item) }} />
          &nbsp;
          &nbsp;
          <ProfileTwoTone style={{ fontSize: '18px' }} onClick={() => { showTree(item.rights);setItemData(item) }} />
          <Modal title="Basic Modal" visible={isModalVisible} onOk={clickOk} onCancel={handleCancel} okText='确认' cancelText='取消' >
            <div style={{ height: '40vh', width: '100%', overflow: 'auto' }}>
              <Tree
                checkable
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                // onSelect={onSelect}
                // selectedKeys={selectedKeys}
                treeData={rightList}
              // style={{width:'70%',position:'absolute',margin:'auto'}}
              /></div>
          </Modal>

        </div>)
      }
    }
  ]

  function showDeleteConfirm(item) {
    console.log(item)
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
    const newRoleList = roleList.filter((obj) => { return obj.id !== item.id })
    setRoleList(newRoleList)
    axios.delete(`/roles/${item.id}`)
  }

  return (
    <Table columns={columns} dataSource={roleList} rowKey={(item) => item.id} bordered />
  )
}

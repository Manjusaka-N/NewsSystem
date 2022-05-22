import React, { useEffect, useState,useContext,useRef } from 'react'
import { Table, Modal,Input, Form } from 'antd'
import { DeleteTwoTone} from '@ant-design/icons'
import '../../../../../axios'
import axios from 'axios'

const EditableContext = React.createContext(null);

const { confirm } = Modal

export default function NewsCategory() {

  const [categoryList, setCategoryList] = useState([])

  useEffect(() => {
    axios.get('/categories').then(res => {
      setCategoryList(res.data)
    })
  }, [])

  // const handleSave = (record)=>{
  //   console.log(record)
  // }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      width: '15%',
      render: (id) => {
        return <div>{id}</div>
      }
    },
    {
      title: '新闻类别',
      dataIndex: 'value',
      align: 'center',
      render:(value)=>{
        return <div>{value}</div>
      }
    },
    {
      title: '操作',
      align: 'center',
      render: (item) => {
        return <div>
          <DeleteTwoTone style={{ fontSize: '22px' }} twoToneColor="#f38282" onClick={() => { showDeleteConfirm(item) }} />
        </div>
      }
    }
  ]

  

  // function showDeleteConfirm(item) {
  //   // console.log(item)
  //   confirm({
  //     title: '是否确认删除该项?',
  //     icon: <ExclamationCircleOutlined />,
  //     // content: 'Some descriptions',
  //     okText: '确认',
  //     okType: 'danger',
  //     cancelText: '取消',
  //     onOk() {
  //       deleteRoleList(item)
  //     },
  //     onCancel() {
  //       return
  //     },
  //   });
  // }

  // const deleteRoleList = (item) => {
  //   const newCategoryList = categoryList.filter((obj) => { return obj.id !== item.id })
  //   setCategoryList(newCategoryList)
  //   axios.delete(`/categories/${item.id}`)
  // }


  // const EditableRow = ({ index, ...props }) => {
  //   const [form] = Form.useForm();
  //   return (
  //     <Form form={form} component={false}>
  //       <EditableContext.Provider value={form}>
  //         <tr {...props} />
  //       </EditableContext.Provider>
  //     </Form>
  //   );
  // };

  // const EditableCell = ({
  //   title,
  //   editable,
  //   children,
  //   dataIndex,
  //   record,
  //   handleSave,
  //   ...restProps
  // }) => {
  //   const [editing, setEditing] = useState(false);
  //   const inputRef = useRef(null);
  //   const form = useContext(EditableContext);
  //   useEffect(() => {
  //     if (editing) {
  //       inputRef.current.focus();
  //     }
  //   }, [editing]);

  //   const toggleEdit = () => {
  //     setEditing(!editing);
  //     form.setFieldsValue({
  //       [dataIndex]: record[dataIndex],
  //     });
  //   };

  //   const save = async () => {
  //     try {
  //       const values = await form.validateFields();
  //       toggleEdit();
  //       handleSave({ ...record, ...values });
  //     } catch (errInfo) {
  //       console.log('Save failed:', errInfo);
  //     }
  //   };

  //   let childNode = children;

  //   if (editable) {
  //     childNode = editing ? (
  //       <Form.Item
  //         style={{
  //           margin: 0,
  //         }}
  //         name={dataIndex}
  //         rules={[
  //           {
  //             required: true,
  //             message: `${title} is required.`,
  //           },
  //         ]}
  //       >
  //         <Input ref={inputRef} onPressEnter={save} onBlur={save} />
  //       </Form.Item>
  //     ) : (
  //       <div
  //         className="editable-cell-value-wrap"
  //         style={{
  //           paddingRight: 24,
  //         }}
  //         onClick={toggleEdit}
  //       >
  //         {children}
  //       </div>
  //     );
  //   }

  //   return <td {...restProps}>{childNode}</td>;
  // };

  return (
    <div>
      <Table columns={columns} dataSource={categoryList} rowKey={(item) => item.id} bordered />
      {/* <Table
            components={{
                body: {
                    row: EditableRow,
                    cell: EditableCell,
                },
            }}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={categoryList}
            columns={columns}
            rowKey={(item) => item.id}
        /> */}
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux'
//antd 
import { Layout, Menu } from 'antd';
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined
} from '@ant-design/icons';
//index文件也是antd layout的样式
import './index.css'
import { useLocation, useNavigate } from 'react-router-dom';
import PubSub from 'pubsub-js'
import '../../../../axios'
import axios from 'axios'

const { SubMenu } = Menu;
const { Sider } = Layout;

function SideMenu(props) {
  const [state, setState] = useState({
    userDatas: []
  })
  // rightlist传过来的参数，rightlist删除时调动重新渲染flag给sidemenu
  const [rightsFlag, setRightsFlag] = useState()
  let oldState = ''
  useEffect(() => {
    // console.log('发送axios请求中。。。')
    PubSub.subscribe('flag', (mes, data) => { setRightsFlag(data) })
    axios.get('/rights?_embed=children').then(
      res => {
        // console.log(response.data)
        if (res.data !== oldState) {
          setState({ userDatas: res.data })
          oldState = res.data
        }
      }
    )
  }, [rightsFlag])

  // 设一个参数，rightlist点击删除时给sidemenu传一个参数，useeffect监测这个参数，变化时会重新渲染
  const navigate = useNavigate()
  const jumpPage = (path) => {
    return () => {
      navigate(path)
    }
  }

  const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
  // 判断是否有pagepermisson
  const ifPagePermisson = (item, menu) => {
    if (item.pagepermisson && rights.includes(item.key)) {
      return menu
    }
  }
  // 利用钩子获取location，实现菜单的高亮项
  const location = useLocation()
  const currentPath = [location.pathname]
  const dropdownPath = `/${location.pathname.split('/')[1]}`

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed} className="aside">
      {/* 套一层div来设置flex，从而设置菜单的超出触发滚动条 */}
      <div className='wholeMenuContainer'>
        <div className="logo" onClick={() => { console.log(state) }}>全球新闻发布管理系统</div>
        {/* 以下是下拉Menu的内容 */}
        <div className='menuContainer'>
          <Menu theme="dark" mode="inline" selectedKeys={currentPath} defaultOpenKeys={[dropdownPath]}>
            {/* 如果子项的pagePermisson都为0的话，渲染一个item出来，而不是submenu */}
            {state.userDatas.map((item) => {
              let count = 0
              item.children.map((child) => {
                count = count + parseInt(child.pagepermisson === 1 ? 1 : 0)
              })
              {/* //动态加载多级菜单，这一块可以改成高阶函数递归调用 */ }
              if (!item.children[0] || count === 0) {
                return ifPagePermisson(item, <Menu.Item key={item.key} icon={iconList[item.key]} onClick={jumpPage(item.key)}>{item.title}</Menu.Item>)
              } else {
                return ifPagePermisson(item, <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
                  {item.children.map((child) => {
                    return ifPagePermisson(child, <Menu.Item key={child.key} onClick={jumpPage(child.key)}>{child.title}</Menu.Item>)
                  })}
                </SubMenu>)
              }
            })}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}
// 图标用这样的方式进行动态加载
const iconList = {
  '/home': <MailOutlined />,
  '/user-manage': <AppstoreOutlined />,
  '/right-manage': <SettingOutlined />,
  "/news-manage": <SettingOutlined />,
  "/audit-manage": <SettingOutlined />,
  "/publish-manage": <SettingOutlined />,
}
//用数组+对象的方式实现动态加载多级菜单
// const menuList = [
//   {
//     id: '/home',
//     title: '首页',
//     icon: <MailOutlined />
//   },
//   {
//     id: '/user-manage',
//     title: '用户管理',
//     icon: <AppstoreOutlined />,
//     children: [
//       {
//         id: '/user-manage/list',
//         title: '用户列表'
//       }
//     ]
//   },
//   {
//     id: '/right-manage',
//     title: '权限管理',
//     icon: <SettingOutlined />,
//     children: [
//       {
//         id: '/right-manage/role/list',
//         title: '角色列表'
//       },
//       {
//         id: '/right-manage/right/list',
//         title: '权限列表'
//       }
//     ]
//   }
// ] 

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed
  }
}
export default connect(mapStateToProps)(SideMenu)
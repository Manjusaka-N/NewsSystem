import React from 'react'
import { connect } from 'react-redux'
//antd
import { Layout, Avatar, Menu, Dropdown } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  DownOutlined
} from '@ant-design/icons';
//index文件也是antd layout的样式
import './index.css'
import { useNavigate } from 'react-router-dom';
const { Header } = Layout;




function TopHeader(props) {
  console.log(props, 'ssssss')
  const navigate = useNavigate()

  const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))
  const menu = (
    <Menu>
      <Menu.Item key='1'>
        <a>
          {roleName}
        </a>
      </Menu.Item>
      <Menu.Item danger
        key='2'
        onClick={() => {
          localStorage.removeItem('token')
          navigate('/login')
        }}>退出</Menu.Item>
    </Menu>
  );
  return (
    <Header className="site-layout-background" >
      {/* {React.createElement(props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: props.toggle,
      })} */}
      {
        props.isCollapsed ?
          <MenuUnfoldOutlined className='trigger' onClick={props.changeIscollapsedAction} />
          : <MenuFoldOutlined className='trigger' onClick={props.changeIscollapsedAction} />
      }

      <span className='avatar'>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            <Avatar size="large" icon={<UserOutlined />} />
          </a>
        </Dropdown>
      </span>
      <span className='welcomeBack'>
        欢迎{<strong>{username}</strong>}回来
      </span>
    </Header>
  )
}

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeIscollapsedAction() {
    return {
      type: 'change collapsed',
      // payload:
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)
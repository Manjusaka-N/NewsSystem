import React from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '../../../axios'
import axios from 'axios'
import ParticlesBg from './ParticlesBg'
import './index.css'
import { useNavigate } from 'react-router-dom';


export default function Login() {

  const navigate = useNavigate()

  const onFinish = (value) => {
    console.log(value)
    // console.log(`/users?username=${value.username}&password=${value.password}&rolestate=true&_expand=role`)
    axios.get(`/users?username=${value.username}&password=${value.password}&rolestate=true&_expand=role`).then(
      res=>{
        if(res.data.length===0){
          message.error('用户名或密码输入错误！')
        }else{
          localStorage.setItem('token',JSON.stringify(res.data[0]))
          navigate('/home')
        }
      }
    )
  }


  return (
    <div style={{ backgroundColor: 'rgb(35,39,65)', width: '100%', height: '100%' }}>
      <ParticlesBg />
      <div className='loginFormContainer'>
        <div className='loginTitle'>全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
        // initialValues={{ remember: true }}
        onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            Or <a href="">register now!</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

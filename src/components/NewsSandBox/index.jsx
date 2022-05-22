import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import {connect} from 'react-redux'
import SideMenu from './SideMenu'
import TopHeader from './TopHeader'
//antd引入的文件
import { Layout,Spin } from 'antd';
import 'antd/dist/antd.css'
//index文件也是antd layout的样式
import './index.css'


const { Content } = Layout;

function NewsSandBox(props) {

    // console.log(props)
    

    // useEffect(()=>{
    //     axios({
    //         method:'head',
    //         url:'/api/mmdb/movie/v3/list/hot.json?ct=%E5%8C%97%E4%BA%AC&ci=1&channelId=4'
    //     }).then(response=>{console.log(response.data)},error=>{console.log(error.message)})
    // },[])

    return (
        <Layout style={{ height: '100%' }}>
            <SideMenu  />
            <Layout className="site-layout">
                <TopHeader  />
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow:'auto'
                    }}
                >
                    <Spin size="large" spinning={props.isLoading}>
                    <Outlet />
                    </Spin>
                </Content>
            </Layout>
        </Layout>
    )
}


const mapStateToProps = ({ LoadingReducer: { isLoading } }) => {
    return {
      isLoading
    }
  }

export default connect(mapStateToProps)(NewsSandBox)
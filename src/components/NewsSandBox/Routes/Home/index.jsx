import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row, Avatar, List, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import * as echarts from 'echarts'
import _ from 'lodash'
import axios from 'axios'
import '../../../../../axios'

const { Meta } = Card;

export default function Home() {

  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))

  const [mostViewList, setMostViewList] = useState([])
  const [mostStarList, setMostStarList] = useState([])
  const [allList, setAllList] = useState([])
  const [isvisible, setIsvisible] = useState(false)

  const mypieref = useRef()
  const mybarref = useRef()

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res => {
      setMostViewList(res.data)
    }
    )
  }, [])

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res => {
      setMostStarList(res.data)
    }
    )
  }, [])

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category').then(res => {
      renderBar(_.groupBy(res.data, (item) => { return item.category.title }))

      setAllList(res.data)
    })
    // 组件销毁时清除resize效果
    return () => {
      window.onresize = null
    }
  }, [])

  // 柱状图
  const renderBar = (data) => {
    var myChart = echarts.init(mybarref.current);

    myChart.setOption({
      title: {
        text: '新闻分类数据图'
      },
      tooltip: {},
      xAxis: {
        data: Object.keys(data),
        // 旋转x轴显示，在不能展示全部时自动旋转
        axisLabel: {
          rotate: '45'
        }
      },
      yAxis: {
        // 最小间隔
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(data).map(item => item.length)
        }
      ]
    });

    // 柱状图自适应
    window.onresize = () => {
      myChart.resize()
    }
  }


  const renderPie = () => {

    const currentlist = allList.filter((item) => { return item.author === username })
    const groupList = _.groupBy(currentlist,(item)=>{return item.category.title})
    const list =[]
    for(var i in groupList){
      list.push({
        name:i,
        value:groupList[i].length
      })
    }


    var myChart = echarts.init(mypieref.current);

    myChart.setOption({
      title: {
        text: `${username}的新闻分类`,
        // subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    });

  }



  return (
    <div>
      <div className="site-card-wrapper">
        <Row gutter={18}>
          <Col span={8}>
            <Card title="用户最常浏览" bordered={true}>
              <List
                size="small"
                // header={<div>Header</div>}
                // footer={<div>Footer</div>}
                // bordered
                dataSource={mostViewList}
                renderItem={item => <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="用户点赞最多" bordered={true}>
              <List
                size="small"
                // header={<div>Header</div>}
                // footer={<div>Footer</div>}
                // bordered
                dataSource={mostStarList}
                renderItem={item => <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              // style={{ width: 300 }}
              cover={
                <img
                  alt="example"
                  src="https://cdn.pixabay.com/photo/2020/11/26/11/48/cat-5778777_1280.jpg"
                />
              }
              actions={[
                <SettingOutlined key="setting"
                  onClick={() => {
                    setTimeout(() => {
                      setIsvisible(true)
                      renderPie()
                    }, 0)

                  }} />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={username}
                description={<span>{region ? region : '全球'}&nbsp;&nbsp;&nbsp;{roleName}</span>}
              />
            </Card>
          </Col>
        </Row>
      </div>
      <Drawer
        width='500px'
        title="个人新闻分类"
        placement="right"
        onClose={() => {
          setIsvisible(false)
        }}
        visible={isvisible}>
        <div
          style={{ width: '100%', height: '100%' }}
          ref={mypieref}>
        </div>

      </Drawer>
      <div style={{ width: '90%', height: '500px', marginTop: '50px' }} ref={mybarref}></div>
    </div>
  )
}

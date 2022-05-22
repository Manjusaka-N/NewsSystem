import React, { useState,useEffect } from 'react'
import { PageHeader, Card, Col, Row, List } from 'antd';
import axios from 'axios'
import _ from 'lodash'

export default function News() {

    const [list, setList] = useState([])

    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category').then(res => {
            // console.log(res.data)
            console.log(Object.entries(_.groupBy(res.data, item => item.category.title )))
            setList(Object.entries(_.groupBy(res.data, item => item.category.title )))
        })
    }, [])

    return (
        <div style={{ width: '95%' }}>
            <PageHeader
                className="site-page-header"
                onBack={() => null}
                title="全球大新闻"
                subTitle="看新闻，知天下"
            />
            <div className="site-card-wrapper">
                <Row gutter={[16, 16]}>
                    {
                        list.map(item => 
                            <Col span={8} key={item[0]}>
                                <Card title={item[0]} bordered={true} hoverable={true}>
                                    <List
                                        size="small"
                                        // bordered
                                        dataSource={item[1]}
                                        pagination={3}
                                        renderItem={item => <List.Item><a href={`/#/detail/${item.id}`}>{item.title}</a></List.Item>}
                                    />
                                </Card>
                            </Col>
                        )
                    }

                </Row>
            </div>
        </div>
    )
}

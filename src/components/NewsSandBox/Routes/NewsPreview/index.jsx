import React, { useEffect, useState } from 'react'
import { PageHeader, Button, Descriptions } from 'antd';
import { useParams } from 'react-router-dom';
import '../../../../../axios'
import axios from 'axios'


export default function NewsPreview() {
    const [newsData, setNewsData] = useState({ category: { value: '' } })
    const { id } = useParams()
    useEffect(() => {
        axios.get(`news/${id}?_expand=role&_expand=category`).then(
            (res) => {
                setNewsData(res.data)
                // console.log(res.data.category.id)
            }
        )
    }, [id])

    function transformTime(createTime) {
        const date = new Date(createTime);
        const Y = date.getFullYear() + '/';
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
        const D = ((date.getDate() + ' '));
        const h = (date.getHours() < 10 ? '0' + (date.getHours() + ':') : (date.getHours() + ':'));
        const m = (date.getMinutes() < 10 ? '0' + (date.getMinutes() + ':') : (date.getMinutes() + ':'));
        const s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : (date.getSeconds()));
        return Y + M + D + h + m + s;
    }

    const auditKinds = ['未发布','审核中','已通过','未通过']
    const publishKinds=['未发布','待发布','已上线','已下线']
    const colorKinds = ['black','orange', 'green', 'red']

    return (
        <div>
            <PageHeader
                onBack={() => window.history.back()}
                title={newsData.title}
                subTitle={newsData.category.value}
            // subTitle={JSON.stringify(newsData.category.value)}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsData.author}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{transformTime(newsData.createTime)}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">{newsData.publishTime ? transformTime(newsData.publishTime) : '-'}</Descriptions.Item>
                    <Descriptions.Item label="区域">{newsData.region ? newsData.region : '全球'}</Descriptions.Item>
                    <Descriptions.Item label="审核状态"><div style={{ color: colorKinds[newsData.auditState] }}>{auditKinds[newsData.auditState]}</div></Descriptions.Item>
                    <Descriptions.Item label="发布状态"><div style={{ color: colorKinds[newsData.publishState] }}>{publishKinds[newsData.publishState]}</div></Descriptions.Item>
                    <Descriptions.Item label="访问数量">{newsData.view}</Descriptions.Item>
                    <Descriptions.Item label="点赞数量">{newsData.star}</Descriptions.Item>
                    <Descriptions.Item label="评论数量">0</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <div
                dangerouslySetInnerHTML={{ __html: newsData.content }}
                style={{
                    border: '0.3px solid gray',
                    margin: '0 12px',
                    padding: '10px 12px'
                }}>
            </div>
        </div>
    )
}

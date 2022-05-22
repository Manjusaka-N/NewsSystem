import { useRoutes, Navigate } from 'react-router-dom'
import Login from '../Login'
import NewsSandBox from '../NewsSandBox'
import Home from '../NewsSandBox/Routes/Home'
import UserList from '../NewsSandBox/Routes/UserList(新版)'
import RoleList from '../NewsSandBox/Routes/RoleList'
import RightList from '../NewsSandBox/Routes/RightList'
import NewsAdd from '../NewsSandBox/Routes/NewsAdd'
import NewsDraft from '../NewsSandBox/Routes/NewsDraft'
import NewsCategory from '../NewsSandBox/Routes/NewsCategory'
import NotFound from './NotFound'
import NewsPreview from '../NewsSandBox/Routes/NewsPreview'
import AuditList from '../NewsSandBox/Routes/Audit-manage/AuditList'
import Unpublished from '../NewsSandBox/Routes/Publish-manage/Unpublished'
import Published from '../NewsSandBox/Routes/Publish-manage/Published'
import Sunset from '../NewsSandBox/Routes/Publish-manage/Sunset'
import Audit from '../NewsSandBox/Routes/Audit-manage/Audit'
import News from '../News'
import Detail from '../News/Detail'

export default function indexRouter() {
    //这个是router6的常规写法
    // return (
    //     <Routes>
    //         <Route path='/login' element={<Login />} />
    //         <Route path='/' element={<AuthComponent> <NewsSandBox /> </AuthComponent>} />
    //     </Routes>
    // )
    //这个是router6的路由表写法
    const IndexRouter = useRoutes([
        {
            path:'/news',
            element:<News/>
        },
        {
            path:'/detail/:id',
            element:<Detail/>
        },
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/',
            element: <AuthComponent> <NewsSandBox /> </AuthComponent>,
            children: [
                {
                    path: 'home',
                    element: <Home />
                },
                {
                    path: 'user-manage/list',
                    element: <UserList />
                },
                {
                    path: 'right-manage/role/list',
                    element: <RoleList />
                },
                {
                    path: 'right-manage/right/list',
                    element: <RightList />
                },
                {
                    path: 'news-manage/add',
                    element: <NewsAdd />
                },
                {
                    path: 'news-manage/draft',
                    element: <NewsDraft />
                },
                {
                    path: 'news-manage/category',
                    element: <NewsCategory />
                },
                {
                    path:'news-manage/preview/:id',
                    element:<NewsPreview/>
                },
                {
                    path:"audit-manage/audit",
                    element:<Audit/>
                },
                {
                    path:"audit-manage/list",
                    element:<AuditList/>
                },
                {
                    path:'publish-manage/unpublished',
                    element: <Unpublished/>
                },
                {
                    path:'publish-manage/published',
                    element: <Published/>
                },
                {
                    path:'publish-manage/sunset',
                    element: <Sunset/>
                },
                {
                    path: '/',
                    element: <Navigate to='/home' />
                },
                {
                    path: '*',
                    element: <NotFound />
                },
            ]
        }
    ])
    return IndexRouter
}

// localStorage.setItem("token", "nan")
function AuthComponent(props) {
    return localStorage.getItem('token') ? props.children : <Navigate to='/login' />
}
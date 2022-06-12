import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "./hooks/redux";
import {Breadcrumb, Layout, Menu, MenuProps} from "antd";
import {LaptopOutlined, NotificationOutlined, UserOutlined} from "@ant-design/icons";
import {userSlice} from "./store/reducers/UserSlice";
import {fetchUsers} from "./store/reducers/ActionCreator";
import 'antd/dist/antd.min.css'
import './styles/App.css'
import AdminPage from "./pages/AdminPage";


const { Header, Content, Footer, Sider } = Layout;

const items1: MenuProps['items'] = ['1', '2', '3'].map(key => ({
    key,
    label: `nav ${key}`,
}));

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
    (icon, index) => {
        const key = String(index + 1);

        return {
            key: `sub${key}`,
            icon: React.createElement(icon),
            label: `subnav ${key}`,

            children: new Array(4).fill(null).map((_, j) => {
                const subKey = index * 4 + j + 1;
                return {
                    key: subKey,
                    label: `option${subKey}`,
                };
            }),
        };
    },
);










const App = () => {

    // const {count} = useAppSelector(state => state.userReducer)
    // const {increment} = userSlice.actions
    // const dispatch = useAppDispatch()
    //
    // const {users, isLoading, error} = useAppSelector(state => state.userReducer)
    //
    // useEffect(() => {
    //     dispatch(fetchUsers())
    // }, [])













    return (
        <div>
            {/*<h1>{count}</h1>*/}
            {/*<button onClick={() => dispatch(increment(10))} >INCREMENT</button>*/}
            {/*<br/>*/}
            {/*/!*{isLoading && <h1>Загрузка...</h1>}*!/*/}
            {/*/!*{error && <h1>{error}</h1>}*!/*/}
            {/*/!*{JSON.stringify(users, null, 2)}*!/*/}
            {/*<PostContainer/>*/}


            <Layout>
                <Header className="header">
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} />
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout className="site-layout-background" style={{padding: '24px 0', maxWidth: '1180px', margin: 'auto'}}>
                        <Sider className="site-layout-background" width={200}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                defaultOpenKeys={['sub1']}
                                style={{ height: '100%' }}
                                items={items2}
                            />
                        </Sider>
                        <Content style={{ padding: '0 24px', minHeight: 280 }}>
                            <AdminPage />
                        </Content>
                    </Layout>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        </div>
    );
};

export default App;
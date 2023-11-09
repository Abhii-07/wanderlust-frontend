import React, { useState } from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Dropdown, Avatar, Typography, theme } from 'antd';
// import { UserButton } from "@clerk/nextjs";
import Destinations from "./destinations"
import Itinerary from './Itinerary';
import Expenses from './expenses';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const subnavItems = [
    {
        key: 'sub1',
        label: 'Destinations',
        icon: <LaptopOutlined />,
        component: <Destinations />,
    },
    {
        key: 'sub2',
        label: 'Itinerary ',
        icon: <NotificationOutlined />,
        component: <Itinerary />,
    },
    {
        key: 'sub3',
        label: 'Expenses',
        icon: <UserOutlined />,
        component: <Expenses />,
    }
];

const Dashboard = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [selectedSubnav, setSelectedSubnav] = useState('sub1');

    return (
        <Layout>
            <Header
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#e05257',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* <img
                        src="/assets/logo.png"
                        alt="Logo"
                        style={{
                            width: '230px',
                            height: 'auto',
                        }}
                    /> */}
                    Travel Palnner
                </div>
                {/* <UserButton afterSignOutUrl="/" /> */}
            </Header>

            <Layout>
                <Sider
                    width={200}
                    breakpoint="md"
                    collapsedWidth={0}
                    trigger={null}
                    collapsible
                    style={{
                        background: colorBgContainer
                    }}
                >
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedSubnav]}
                        defaultOpenKeys={['sub1']}
                        style={{
                            height: '100%',
                            borderRight: 0,
                        }}
                        onSelect={({ key }) => {
                            setSelectedSubnav(key);
                        }}
                    >
                        {subnavItems.map((item) => (
                            <Menu.Item key={item.key}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {item.icon}
                                    {item.label}
                                </div>
                            </Menu.Item>
                        ))}
                    </Menu>
                </Sider>
                <Layout
                    style={{
                        padding: '10px 10px 10px'
                    }}
                >
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 469,
                            background: colorBgContainer,
                        }}
                    >
                        {subnavItems.find((item) => item.key === selectedSubnav)?.component}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default Dashboard;

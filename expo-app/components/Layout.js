import { Button, Layout, Menu, ConfigProvider, FloatButton } from 'antd';
import { HomeOutlined, MessageOutlined, SettingOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

import CustomLink from './CustomLink';
import { customTheme } from '../Theme';
import PlantLogo from './LogoIcon';
import { Typography } from 'antd';
import { Space } from 'antd';

const { Header, Content, Footer } = Layout;


const AppLayout = (props) => {
  const navigate = useNavigate();

  return (
    <ConfigProvider theme={customTheme}>
      <Layout>
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            backgroundColor: customTheme.token.colorPrimary
          }}
        >
          <div
            style={{
              float: 'right',
              textAlign: 'center',
              margin: 2,
              // background: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            <Space align="center">
              <Typography.Title level={2} style={{ margin: 10, color: "#f2f0e4", fontWeight: 900 }}>GreenT</Typography.Title>
              <PlantLogo />
            </Space>

          </div>
          <Menu
            theme={customTheme}
            mode="horizontal"
            disabled={props.disabled}
          >
            <Menu.Item key='home-nav'>

              <Button ghost disabled={props.disabled}>
                <HomeOutlined />
                <CustomLink
                  content=" Home"
                  link="/home"
                  disabled={props.disabled}
                />
              </Button>
            </Menu.Item>
            <Menu.Item key='msg-nav'>
              <Button ghost disabled={props.disabled}>
                <MessageOutlined />
                <CustomLink
                  content=" Messages"
                  link="/messages"
                  disabled={props.disabled}
                />
              </Button>
            </Menu.Item>
            <Menu.Item key='set-nav'>
              <Button ghost disabled={props.disabled}>
                <SettingOutlined />
                <CustomLink
                  content=" Settings"
                  link="/settings"
                  disabled={props.disabled}
                />
              </Button>
            </Menu.Item>
          </Menu>
        </Header>
        <Content className="content-container" >
          <div className='content-innerbox' style={{ padding: 25, display: "flex", justifyContent: "center" }}>
            {props.children}
            <FloatButton
              tooltip="Switch user"
              icon={<UserSwitchOutlined />}
              type="primary"
              style={{ right: 25 }}
              onClick={() => { navigate('/') }}
            />
          </div>
        </Content>
      </Layout >

    </ConfigProvider>


  )

};

export default AppLayout;

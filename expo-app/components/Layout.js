import { Button, Card, Layout, Menu } from 'antd';
import CustomLink from './CustomLink';
const { Header, Content, Footer } = Layout;
import { Link } from 'react-router-dom';
import { Divider } from 'antd';
import { Descriptions } from 'antd';

const AppLayout = (props) => {
  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          // alignContent: 'center'
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          disabled={props.disabled}
        // defaultSelectedKeys={['home-nav']}
        >
          <Menu.Item key='home-nav'>
            <Button ghost disabled={props.disabled}>
              <CustomLink
                content="Home"
                link="/"
                disabled={props.disabled}
              />
            </Button>
          </Menu.Item>
          <Menu.Item key='msg-nav'>
            <Button ghost disabled={props.disabled}>
              <CustomLink
                content="Messages"
                link="/messages"
                disabled={props.disabled}
              />
            </Button>
          </Menu.Item>
          <Menu.Item key='set-nav'>
            <Button ghost disabled={props.disabled}>
              <CustomLink
                content="Settings"
                link="/settings"
                disabled={props.disabled}
              />
            </Button>
          </Menu.Item>
        </Menu>

      </Header>
      <Content className="content-container" >
        <div className='content-innerbox' style={{ padding: 25 }}>
          {/* <Descriptions
            title={props.title}
            style={{
              textAlign: 'right',
              alignContent: 'center',
            }}
          >
            <Card style={{ alignContent: 'center', }}>
              {props.children}
            </Card>

          </Descriptions> */}

          <Card
            title={props.title}
            style={{
              textAlign: 'center',
              alignContent: 'center',
              // backgroundColor: '#dbcada',
            }}
          >
            {props.children}
          </Card>

        </div>
      </Content>
    </Layout >

  )

};

export default AppLayout;

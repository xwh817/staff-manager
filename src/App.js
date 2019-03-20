import React, { Component } from 'react';

import 'antd/dist/antd.css';
import './App.css';
import logo from './logo.svg';

import {
  Layout, Menu, Icon,
} from 'antd';

import StaffList from './staffList';
import JobList from './jobList';


const {
  Content, Footer, Sider,
} = Layout;

class App extends Component {
  state = {
    collapsed: false,
    currentPage: '1',
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }

  render() {

    let pageView;
    if (this.state.currentPage === '2') {
      pageView = <JobList/>;
    } else {
      pageView = <StaffList/>;
    }

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" style={{height:80,backgroundColor:"#333333", textAlign: 'center'}}>
            <img src={logo} alt='' style={{width:50, height:50, marginTop:15}}/>
          </div>

          <Menu theme="dark" defaultSelectedKeys={[this.state.currentPage]} mode="inline" onSelect={({key}) => {this.setState({currentPage:key});console.log(key);}}>
            <Menu.Item key="1">
              <Icon type="team" />
              <span>人员管理</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="cluster" />
              <span>职位管理</span>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout>
          {/* <Header style={{ margin: '0 16px', background: '#fff', padding: 0 }} /> */}
          <Content style={{ margin: '12px 12px' }}>
           
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              {pageView}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;

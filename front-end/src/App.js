import React, { Component } from 'react';

import 'antd/dist/antd.css';
import './App.css';
import myIcon from './images/icon.jpg';

import {
  Layout, Menu, Icon, Avatar,
} from 'antd';

import StaffList from './staffList';
import JobList from './jobList';
import DataManager from './DataManager';


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
    } else if (this.state.currentPage === '3') {
      pageView = <DataManager/>;
    } else {
      pageView = <StaffList/>;
    }

    return (
      <Layout style={{ minHeight: '100vh'}}>
        <Sider
        width={152}
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" style={{height:80,backgroundColor:"#002140", textAlign: 'center'}}>
            <Avatar src={myIcon} alt='' style={{width:60, height:60, marginTop:10}}/>
          </div>

          <Menu theme="dark"  mode="inline"
            defaultSelectedKeys={[this.state.currentPage]} 
            onSelect={({key}) => this.setState({currentPage:key})}>
            <Menu.Item key="1">
              <Icon type="team" />
              <span>人员管理</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="cluster" />
              <span>职位管理</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="database" />
              <span>数据管理</span>
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
          <Footer style={{ textAlign: 'center'}}>
            Loving you forever ©2019 Created by XWH
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;

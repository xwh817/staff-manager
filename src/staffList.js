import React from 'react';
import Const from './Const'
import HttpUtil from './Utils/HttpUtil'


import {
    Table, Icon, Input, Select, Button, Form
} from 'antd';

import StaffInfoDialog from './StaffInfoDialog';

class StaffList extends React.Component {
    columns = [{
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '职位',
        dataIndex: 'job',
        key: 'job',
        render: (index) => (<span>{Const.jobs[index]}</span>)
    }, {
        title: '公司',
        dataIndex: 'company',
        key: 'company',
    }, {
        title: '学历',
        dataIndex: 'education',
        key: 'education',
        render: (index) => (<span>{Const.edus[index]}</span>)
    }, {
        title: '生年',
        dataIndex: 'birth_year',
        key: 'birth_year',
        align: 'center'
    }, {
        title: '籍贯',
        dataIndex: 'hometown',
        key: 'hometown',
    }, {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
    }, {
        title: 'email',
        dataIndex: 'email',
        key: 'email',
    }, {
        title: 'QQ',
        dataIndex: 'qq',
        key: 'qq',
    }, {
        title: '微信',
        dataIndex: 'wechat',
        key: 'wechat',
    }/* , {
        title: '工作经历',
        dataIndex: 'experience',
        key: 'experience',
    }, {
        title: '联系记录',
        dataIndex: 'logs',
        key: 'logs',
    } */, {
        title: '编辑',
        dataIndex: 'id',
        key: 'action',
        fixed: 'right',
        render: (id) => (
            <span>
                <Icon type="edit" onClick={id => this.showInfoDialog(id)} />
            </span>
        ),
    }];

    mAllData = [];

    state = {
        mJobs: [],
        mData: [],
        showInfoDialog: false,
        smallSize: false,
    };

    getData() {
        for (let i = 1; i <= 100; i++) {
            let jobIndex = Math.floor((Math.random() * (Const.jobs.length - 1)) + 1);
            let edu = Math.floor((Math.random() * (Const.edus.length - 1)));
            let staff = {
                key: '' + i,
                id: i,
                name: '姓名-' + i,
                job: jobIndex,
                company: '公司-' + i,
                birth_year: 85 + edu * 2,
                education: edu,
                hometown: '深圳',
                phone: '13567893456',
                email: 'test@163.com',
                qq: '67893456',
                wechat: '1356789',
                experience: '1 2 3',
                logs: '12341234',
            }

            this.mAllData.push(staff);
        } 
        this.setState({
            mJobs: Const.jobs,
            mData: this.mAllData,
        });
        

        /* HttpUtil.get('http://localhost:5000/api/v1/getStaffList/0')
        .then(res => res.text())
        .then(
            data => {
                this.mAllData = data;
                this.setState({
                    mJobs: Const.jobs,
                    mData: data,
                });
            }
        ) */

    }

    componentDidMount() {
        this.getData();
        window.addEventListener('resize', this.handleWindowWidth);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowWidth);
    }

    handleWindowWidth = () => {
        // 窗口太小时，菜单列换行
        let width = document.documentElement.clientWidth;
        console.log("window width: " + width);

        let tableWidth = this.refs.table.clientWidth;
        console.log("table width: " + tableWidth);

        this.setState({
            smallSize: width < 1200,
        });
    }

    showInfoDialog(id) {
        this.setState({
            showInfoDialog: true,
        });
    }

    handleFilterChange(value) {
        let items = this.mAllData.filter(item => item.job === value);
        this.setState({
            mData: items,
        });
    }

    render() {
        return (
            <div>
                <div>

                    {/* <Input.Search
                        placeholder="搜索"
                        onSearch={value => console.log(value)}
                        style={{ width: 200, marginLeft: 10 }}
                    /> */}

                    <Form layout="inline" onSubmit={this.handleSubmit}>

                        <Form.Item style={{ marginRight: 20 }}>
                            <Select defaultValue={0} style={{ width: 160 }} onChange={value => this.handleFilterChange(value)}>
                                {this.state.mJobs.map((job, index) => <Select.Option value={index} key={index + ''}>{job}</Select.Option>)}
                            </Select>
                        </Form.Item>

                        {/* <Form.Item style={{ width: 160, marginRight: 4}}>
                            <Input placeholder="搜索内容" />
                        </Form.Item>
                        <Form.Item style={{ width: 80}} >
                            <Select defaultValue={1} style={{ width: 80 }} >
                                <Select.Option value={1}>电话</Select.Option>
                                <Select.Option value={2}>邮箱</Select.Option>
                                <Select.Option value={3}>QQ</Select.Option>
                                <Select.Option value={4}>微信</Select.Option>
                            </Select>
                        </Form.Item> */}


                        <Form.Item style={styles.searchItem}>
                            <Input prefix={<Icon type="mobile" style={styles.prefixIcon} />} placeholder="电话" />
                        </Form.Item>
                        <Form.Item style={styles.searchItem}>
                            <Input prefix={<Icon type="mail" style={styles.prefixIcon} />} placeholder="邮箱" />
                        </Form.Item>

                        {this.state.smallSize && <br />}

                        <Form.Item style={styles.searchItem}>
                            <Input prefix={<Icon type="qq" style={styles.prefixIcon} />} placeholder="QQ" />
                        </Form.Item>
                        <Form.Item style={styles.searchItem}>
                            <Input prefix={<Icon type="wechat" style={styles.prefixIcon} />} placeholder="微信" />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                icon="search"
                                htmlType="submit">搜索</Button>
                        </Form.Item>


                        <Form.Item style={{ float: 'right' }}>
                            <Button type="primary" icon="plus" onClick={() => this.showInfoDialog()}>添加</Button>
                        </Form.Item>
                    </Form>

                </div>
                <Table
                    ref="table"
                    style={{ marginTop: 10 }}
                    dataSource={this.state.mData}
                    columns={this.columns}
                    scroll={{ x: 800 }} />

                <StaffInfoDialog
                    visible={this.state.showInfoDialog}
                    afterClose={() => this.setState({ showInfoDialog: false })} />

            </div>
        )
    }
}

const styles = {
    searchItem: {
        width: 132,
        marginRight: 6,
    },
    prefixIcon: {
        color: 'rgba(0,0,0,.25)',
    },
}



export default StaffList;
import React from 'react';
import Const from './Const'
import HttpUtil from './Utils/HttpUtil'
import ApiUtil from './Utils/ApiUtil'
import CommonValues from './Utils/CommonValues'


import {
    Table, Icon, Input, Select, Button, Form, message,
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
        render: (index) => (<span>{Const.jobs[index].name}</span>)
    }, {
        title: '公司',
        dataIndex: 'company',
        key: 'company',
    }, {
        title: '学历',
        dataIndex: 'education',
        key: 'education',
        render: (index) => (<span>{Const.edus[index].name}</span>)
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
        dataIndex: 'contact_logs',
        key: 'contact_logs',
    } */, {
        title: '编辑',
        key: 'action',
        fixed: 'right',
        render: (item) => (
            <span>
                <Icon type="edit" onClick={() => this.showInfoDialog(item)} />
            </span>
        ),
    }];

    mAllData = [];

    state = {
        mJobs: [],
        mData: [],
        jobSelected: 0,
        showInfoDialog: false,
        smallSize: false,
        editingItem: null,
    };

    getTestData() {
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
                contact_logs: '12341234',
            }

            this.mAllData.push(staff);
        }
        this.setState({
            mJobs: Const.jobs,
            mData: this.mAllData,
        });
    }

    getData() {
        HttpUtil.get(ApiUtil.API_JOB_LIST)
            .then(
                jobList => {
                    CommonValues.JOBS = jobList;
                    HttpUtil.get(ApiUtil.API_GET_STAFF_LIST + this.state.jobSelected);
                }
            ).then( // 等待两次请求依次完成了才刷新界面
                staffList => {
                    this.mAllData = staffList;
                    this.setState({
                        mJobs: CommonValues.JOBS,
                        mData: staffList,
                    });
                }
            ).catch(error => {
                message.error(error.message);
            });
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
        this.setState({
            smallSize: width < 1160,
        });
    }

    showInfoDialog(item) {
        if (item === undefined) {
            item = {};
        }

        this.setState({
            showInfoDialog: true,
            editingItem: item,
        });
    }

    handleInfoDialogClose = (staff) => {
        if (staff) {
            if (staff.id) { // 修改
                let datas = [...this.state.mData];
                for (let i = 0; i < datas.length; i++) {
                    if (datas[i].id === staff.id) {
                        datas[i] = staff;
                        this.setState({
                            mData: datas,
                            showInfoDialog: false,
                        });
                        break;
                    }
                }
            } else {    // 新增

            }
        } else {    // 删除

        }
    }

    handleFilterChange(value) {
        let items = value===0 ? this.mAllData : this.mAllData.filter(item => item.job === value);
        this.setState({
            mData: items,
            jobSelected: value,
        });
    }

    render() {
        return (
            <div>
                <div>

                    <Form layout="inline" onSubmit={this.handleSubmit}>

                        <Select style={{ width: 160, marginRight: 20, marginTop: 4}} defaultValue={this.state.jobSelected} onChange={value => this.handleFilterChange(value)}>
                            {this.state.mJobs.map((item) => <Select.Option value={item.id} key={item.id + ''}>{item.id > 0 ? item.name : '所有职位'}</Select.Option>)}
                        </Select>

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
                    style={{ marginTop: 10 }}
                    dataSource={this.state.mData}
                    columns={this.columns}
                    scroll={{ x: 800 }} />

                <StaffInfoDialog
                    visible={this.state.showInfoDialog}
                    staff={this.state.editingItem}
                    afterClose={() => this.setState({showInfoDialog: false})}
                    onDialogConfirm={this.handleInfoDialogClose} />

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
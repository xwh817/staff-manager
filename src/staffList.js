import React from 'react';


import {
    Table, Icon, Input, Select, message, Button
} from 'antd';

import StaffInfoDialog from './StaffInfoDialog';

const Option = Select.Option;

const jobs = ['所有', 'Android', 'IOS', 'Web前端', 'Java后台', '算法', '数据库'];
const edus = ['博士', '硕士', '本科', '专科', '其他']

class StaffList extends React.Component {
    columns = [{
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '职位',
        dataIndex: 'job',
        key: 'job',
        render:(index) => (<span>{jobs[index]}</span>)
    }, {
        title: '公司',
        dataIndex: 'company',
        key: 'company',
    }, {
        title: '学历',
        dataIndex: 'education',
        key: 'education',
        render:(index) => (<span>{edus[index]}</span>)
    }, {
        title: '出生年',
        dataIndex: 'birth_year',
        key: 'birth_year',
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
    }, {
        title: '编辑',
        dataIndex: 'id',
        key: 'action',
        fixed: 'right',
        render: (id) => (
            <span>
                <Icon type="edit" onClick={id => this.showInfoDialog()}/>
            </span>
        ),
    }];

    mAllData = [];

    state = {
        mJobs: [],
        mData: [],
        showInfoDialog: false,
    };

    getData() {
        for (let i = 1; i <= 100; i++) {
            
            let jobIndex = Math.floor((Math.random()*(jobs.length-1))+1);
            //let jobIndex = i % this.state.mJobs.length;
            let edu = Math.floor((Math.random()*(edus.length -1)));
            let staff = {
                key: '' + i,
                id: i,
                name: '姓名-' + i,
                job: jobIndex,
                company: '公司-' + i,
                birth_year: 85 + edu*2,
                education: edu,
                hometown: '深圳',
                phone: '13567893456',
                email: 'test@163.com',
                qq: '67893456',
                wechat: '1356789',
            }

            this.mAllData.push(staff);
        }

        this.setState({
            mJobs: jobs,
            mData: this.mAllData,
        });
    }

    componentDidMount() {
        this.getData();
    }

    showInfoDialog(id) {
        this.setState({
            showInfoDialog: true,
        });
    }
    
    handleFilterChange(value) {
        message.info(`selected ${value}`);
        let items = this.mAllData.filter(item => item.job === value);
        this.setState({
            mData: items,
        });
    }

    render() {
        return (
            <div>
                <div>
                    <Select defaultValue={0} style={{ width: 120 }} onChange={value => this.handleFilterChange(value)}>
                        {this.state.mJobs.map((job, index) => <Option value={index}>{job}</Option>)}
                    </Select>
                    <Input.Search
                        placeholder="搜索"
                        onSearch={value => console.log(value)}
                        style={{ width: 200, marginLeft: 10 }}
                    />

                    <Button type="primary" shape="round" icon="plus" style={{float: 'right'}} onClick={() => this.showInfoDialog()}>添加</Button>

                </div>
                <Table
                    style={{ marginTop: 10 }}
                    dataSource={this.state.mData}
                    columns={this.columns}
                    scroll={{ x: 800 }} />

                <StaffInfoDialog 
                visible={this.state.showInfoDialog} 
                afterClose={() => this.setState({showInfoDialog:false})}/>

            </div>
        )
    }


}

export default StaffList;
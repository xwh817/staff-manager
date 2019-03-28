import React from 'react';
import Const from './Const'
import CommonValues from './Utils/CommonValues'
import HttpUtil from './Utils/HttpUtil'
import ApiUtil from './Utils/ApiUtil'

import {
    Table, Icon, Input, Select, Button, message, Popover, Divider, Pagination, Spin
} from 'antd';

import StaffInfoDialog from './StaffInfoDialog';

class StaffList extends React.Component {

    mAllData = [];

    state = {
        mJobs: [],
        mData: [],
        jobSelected: 0,
        showInfoDialog: false,
        smallSize: false,
        editingItem: null,
        loading: true,
    };

    showPopoverInfo = (staff) => (
        <div style={{ whiteSpace: 'pre-wrap', minWidth: 200, maxWidth: 800, maxHeight: 600, overflow: 'auto' }}>
            <div style={{ fontWeight: 'bold', display: 'block' }}>工作经历：</div>
            {/* <Input.TextArea placeholder="" autosize={{ minRows: 4, maxRows: 8 }} value={staff.experience}/> */}
            <div style={{ marginLeft: 12, lineHeight: 2 }}>{staff.experience ? staff.experience : '无'}</div>
            <Divider dashed style={{ marginTop: 4, marginBottom: 8 }} />
            <div style={{ fontWeight: 'bold', display: 'block' }}>联系记录：</div>
            <div style={{ marginLeft: 12, lineHeight: 2 }}>{staff.contact_logs ? staff.contact_logs : '无'}</div>
        </div>
    );

    showPopoverContact = (staff) => (
        <div style={{minWidth: 200, }}>
            <p>电话：{staff.phone}</p>
            <Divider dashed style={{ marginTop: 4, marginBottom: 8 }} />
            <p>邮箱：{staff.email}</p>
            <Divider dashed style={{ marginTop: 4, marginBottom: 8 }} />
            <p>QQ：{staff.qq}</p>
            <Divider dashed style={{ marginTop: 4, marginBottom: 8 }} />
            <p>微信：{staff.wechat}</p>
        </div>
    );

    columns = [{
        title: '姓名',
        key: 'name',
        width: 80,
        render: (staff) => (
            <Popover placement="right" content={this.showPopoverInfo(staff)} >
                {staff.name}
            </Popover>
        ),
    }, {
        title: '职位',
        dataIndex: 'job',
        key: 'job',
        render: (jobId) => (<span>{CommonValues.JOBS.getById(jobId) && CommonValues.JOBS.getById(jobId).name}</span>)
    }, {
        title: '地址',
        dataIndex: 'address',
    }, {
        title: '公司',
        dataIndex: 'company',
    }, {
        title: '学历',
        dataIndex: 'education',
        align: 'center',
        render: (eduId) => (<span>{Const.edus[eduId].name}</span>)
    }, {
        title: '生年',
        dataIndex: 'birth_year',
        key: 'birth_year',
        align: 'center',
        render: (birth_year) => (<span>{birth_year > 0 ? birth_year : ''}</span>)
    }, {
        title: '籍贯',
        dataIndex: 'hometown',
        align: 'center',
    }, {
        title: '联系方式',
        align: 'center',
        width: 120,
        render: (staff) => (
            <Popover placement="left" content={this.showPopoverContact(staff)} >
                <Button type="dashed" icon="user" style={{ fontSize: 10 }}>查看</Button>
            </Popover>
        ),
    }/*, {
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
        //fixed: 'right',
        width: 80,
        align: 'center',
        render: (staff) => (
            <span>
                <Icon type="edit" title="编辑" onClick={() => this.showUpdateDialog(staff)} style={{ padding: 8 }} />
            </span>
        ),
    }];

    pagination = <Pagination total={this.state.mData.length} hideOnSinglePage={true} />;

    getData() {
        HttpUtil.get(ApiUtil.API_JOB_LIST)
            .then(
                jobList => {
                    CommonValues.JOBS = [
                        { 'id': 0, 'name': '' }
                    ];
                    CommonValues.JOBS.getById = function (id) {
                        return CommonValues.JOBS.filter(job => job.id === id)[0]
                    }
                    jobList.map(job => CommonValues.JOBS.push(job))
                }
            )
            .then(() => HttpUtil.get(ApiUtil.API_STAFF_LIST + 0))   // TODO:这个版本暂时取全部数据，后面完善
            .then( // 等待两次请求依次完成了才刷新界面
                staffList => {
                    this.mAllData = staffList;
                    this.setState({
                        mJobs: CommonValues.JOBS,
                        mData: staffList,
                        showInfoDialog: false,
                        jobSelected: 0,
                        loading: false,
                    });
                }
            ).catch(error => {
                message.error(error.message);
                this.setState({loading:false})
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
        /* let width = document.documentElement.clientWidth;
        console.log("window width: " + width);
        this.setState({
            smallSize: width < 1260,
        }); */
    }

    showUpdateDialog(item) {
        if (item === undefined) {
            item = {};
        }

        // state元素为对象时赋值，同时注意不要给state直接赋值，先追加到空对象{}
        //let currentStaff = Object.assign({}, this.state.staff, item);
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
                this.getData();
            }
        } else {    // 删除
            this.getData();
        }
    }


    handleFilterChange = (value) => {
        /* let items = value === 0 ? this.mAllData : this.mAllData.filter(item => item.job === value);
        this.setState({
            mData: items,
            jobSelected: value,
        }); */
        this.searchItems['job'] = value;
        this.handleSearch();
    }

    searchItems = {};

    handleTextChange = (e) => {
        let attr = e.target.getAttribute('item');
        if (attr) {
            this.searchItems[attr] = e.target.value;
            console.log(attr + ":" + e.target.value);
        }
    }
    handleSearch = () => {
        let where = JSON.stringify(this.searchItems);
        let url = ApiUtil.API_STAFF_SEARCH + "?where=" + encodeURI(where);
        this.setState({loading: true});
        HttpUtil.get(url)
            .then(
                staffList => {
                    this.mAllData = staffList;
                    this.setState({
                        mData: staffList,
                        showInfoDialog: false,
                        jobSelected: 0,
                        loading: false,
                    });
                }
            ).catch(error => {
                message.error(error.message);
            });
    }

    render() {
        return (
            <div>

                <div>
                    <Select style={{ width: 160, marginRight: 20, marginTop: 4 }} defaultValue={this.state.jobSelected} onChange={this.handleFilterChange}>
                        {this.state.mJobs.map((item) => <Select.Option value={item.id} key={item.id + ''}>{item.id > 0 ? item.name : '所有职位'}</Select.Option>)}
                    </Select>
                    <Input placeholder="地址" item="address" prefix={<Icon type="home" style={styles.prefixIcon} />} style={styles.searchItem} onChange={this.handleTextChange} />
                    <Input placeholder="姓名" item="name" prefix={<Icon type="user" style={styles.prefixIcon} />} style={styles.searchItem} onChange={this.handleTextChange} />
                    <Input placeholder="电话" item="phone" prefix={<Icon type="mobile" style={styles.prefixIcon} />} style={styles.searchItem} onChange={this.handleTextChange} />
                    {this.state.smallSize && <br />}
                    <Input placeholder="QQ" item="qq" prefix={<Icon type="qq" style={styles.prefixIcon} />} style={styles.searchItem} onChange={this.handleTextChange} />
                    <Input placeholder="微信" item="wechat" prefix={<Icon type="wechat" style={styles.prefixIcon} />} style={styles.searchItem} onChange={this.handleTextChange} />
                    <Button type="primary" icon="search" onClick={this.handleSearch}>搜索</Button>
                    <Button type="primary" icon="plus" onClick={() => this.showUpdateDialog()} style={{ float: 'right', marginTop: 4 }}>添加</Button>
                </div>

                <Spin spinning={this.state.loading} size="large" delay={500}>
                    <Table
                        style={{ marginTop: 10 }}
                        dataSource={this.state.mData}
                        rowKey={item => item.id}
                        columns={this.columns}
                        size="small"
                        pagination={this.pagination} />
                </Spin>

                <StaffInfoDialog
                    visible={this.state.showInfoDialog}
                    staff={this.state.editingItem}
                    afterClose={() => this.setState({ showInfoDialog: false })}
                    onDialogConfirm={this.handleInfoDialogClose} />
            </div>
        )
    }
}

const styles = {
    searchItem: {
        width: 132,
        marginTop: 4,
        marginRight: 6,
    },
    prefixIcon: {
        color: 'rgba(0,0,0,.25)',
    },
    divider: { 
        marginTop: 4, 
        marginBottom: 8,
    }
}


export default StaffList;
import React from 'react';
import Const from './Const'
import CommonValues from './Utils/CommonValues'
import HttpUtil from './Utils/HttpUtil'
import ApiUtil from './Utils/ApiUtil'

import {
    Table, Icon, Input, Select, Button, message, Popover, Divider, Pagination
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
    };

    getPopoverInfo = (staff) => (
        <div style={{whiteSpace: 'pre-wrap', minWidth:200, maxWidth:800, maxHeight:600, overflow:'auto'}}>
            <div style={{fontWeight:'bold',display:'block'}}>工作经历：</div>
            {/* <Input.TextArea placeholder="" autosize={{ minRows: 4, maxRows: 8 }} value={staff.experience}/> */}
            <div style={{marginLeft:12, lineHeight:2}}>{staff.experience ? staff.experience: '无'}</div>
            <Divider dashed style={{marginTop:4,marginBottom:8}}/>
            <div style={{fontWeight:'bold',display:'block'}}>联系记录：</div>
            <div style={{marginLeft:12, lineHeight:2}}>{staff.contact_logs ? staff.contact_logs : '无'}</div>
        </div>
    );

    columns = [{
        title: '姓名',
        key: 'name',
        render: (staff) => (
            <Popover placement="right" content={this.getPopoverInfo(staff)} >
                {staff.name}
            </Popover>
        ),
    }, {
        title: '职位',
        dataIndex: 'job',
        key: 'job',
        render: (index) => (<span>{CommonValues.JOBS.getById(index) && CommonValues.JOBS.getById(index).name}</span>)
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
        align: 'center',
        render: (birth_year) => (<span>{birth_year > 0 ? birth_year : ''}</span>)
    }, {
        title: '籍贯',
        dataIndex: 'hometown',
        key: 'hometown',
    }, {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
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
        //fixed: 'right',
        align: 'center',
        render: (item) => (
            <span>
                <Icon type="edit" title="编辑" onClick={() => this.showUpdateDialog(item)} style={styles.buttonIcon} />
            </span>
        ),
    }];

    pagination = <Pagination total={this.state.mData.length}/>;

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
            smallSize: width < 1260,
        });
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


    handleFilterChange(value) {
        let items = value === 0 ? this.mAllData : this.mAllData.filter(item => item.job === value);
        this.setState({
            mData: items,
            jobSelected: value,
        });
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
        HttpUtil.get(url)
            .then(
                staffList => {
                    this.mAllData = staffList;
                    this.setState({
                        mData: staffList,
                        showInfoDialog: false,
                        jobSelected: 0,
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
                    <Select style={{ width: 160, marginRight: 20, marginTop: 4 }} defaultValue={this.state.jobSelected} onChange={value => this.handleFilterChange(value)}>
                        {this.state.mJobs.map((item) => <Select.Option value={item.id} key={item.id + ''}>{item.id > 0 ? item.name : '所有职位'}</Select.Option>)}
                    </Select>
                    <Input placeholder="姓名" item="name" prefix={<Icon type="user" style={styles.prefixIcon} />} style={styles.searchItem} onChange={this.handleTextChange} />
                    <Input placeholder="电话" item="phone" prefix={<Icon type="mobile" style={styles.prefixIcon} />} style={styles.searchItem} onChange={this.handleTextChange} />
                    <Input placeholder="邮箱" item="email" prefix={<Icon type="mail" style={styles.prefixIcon} />} style={styles.searchItem} onChange={this.handleTextChange} />
                    {this.state.smallSize && <br />}
                    <Input placeholder="QQ" item="qq" prefix={<Icon type="qq" style={styles.prefixIcon} />} style={styles.searchItem} onChange={this.handleTextChange} />
                    <Input placeholder="微信" item="wechat" prefix={<Icon type="wechat" style={styles.prefixIcon} />} style={styles.searchItem} onChange={this.handleTextChange} />
                    <Button type="primary" icon="search" onClick={this.handleSearch}>搜索</Button>
                    <Button type="primary" icon="plus" onClick={() => this.showUpdateDialog()} style={{ float: 'right', marginTop: 4 }}>添加</Button>
                </div>

                <Table
                    style={{ marginTop: 10 }}
                    dataSource={this.state.mData}
                    rowKey={item => item.id}
                    columns={this.columns}
                    pagination={this.pagination}
                    scroll={{ x: 1000 }} />

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
    buttonIcon: {
        padding: 6,
    },
}


export default StaffList;
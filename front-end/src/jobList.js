import React from 'react';
import HttpUtil from './Utils/HttpUtil'
import ApiUtil from './Utils/ApiUtil'

import {connect} from "react-redux"
import {getJobs, updateJob} from "./redux/actions"

import {
    Table, Icon, Button, message, Input, Modal
} from 'antd';


class JobList extends React.Component {
    columns = [{
        title: '序号',
        dataIndex: 'index',
        width: 80,
        align: 'center'
    }, {
        title: '职位',
        dataIndex: 'name',
    }, {
        title: '编辑',
        align: 'center',
        width: 160,
        render: (job) => (
            <span>
                <Icon type="edit" title="编辑" onClick={() => this.showUpdateDialog(job)} />
                <Icon type="close" title="删除" style={{ color: '#ee6633', marginLeft:12}} onClick={() => this.deleteConfirm(job)} />
            </span>
        ),
    }];

    state = {
        mJobs: [],
        showAddDialog: false,
        job:{}
    };

    /* getData() {
        HttpUtil.get(ApiUtil.API_JOB_LIST)
            .then(
                data => {
                    data.map((item, index) => {
                        item.index = index + 1;
                        return item;
                    });
                    this.setState({
                        mJobs: data
                    });
                }
            ).catch(error => {
                message.error(error.message);
            });
    } */

    removeData(id) {
        HttpUtil.get(ApiUtil.API_JOB_DELETE + id)
            .then(
                re => {
                    message.info(re.message);
                    this.props.getJobs()
                }
            ).catch(error => {
                message.error(error.message);
            });
    }

    componentDidMount() {
        //this.getData();
        this.props.getJobs()
    }


    render() {
        if (this.props.message) {
            message.error(this.props.message.message);
        }

        return (
            <div>
                <div style={{ textAlign: 'right'}} >
                    <Button type="primary" icon="plus" 
                        onClick={() => this.showUpdateDialog()}>添加</Button>
                </div>
                <Table
                    style={{ marginTop: 10 }}
                    dataSource={this.props.jobList}
                    rowKey={item => item.id}
                    columns={this.columns}
                    pagination={false} />
                
                <Modal
                title={this.state.job.id ? "修改职位" : "添加职位"}
                okText="保存"
                cancelText="取消"
                visible={this.state.showAddDialog}
                onOk={this.handleAdd}
                onCancel={() => this.setState({showAddDialog:false})}>
                    <Input type='text'
                    onChange={this.handleTextChanged} 
                    value={this.state.job.name}
                    placeholder="请输入职位名" />
                    
                </Modal>
            </div>
        )
    }

    showUpdateDialog = (job) => {
        if (job === undefined) {
            job = {
                id:0,
                name:''
            };
        }
        let currentJob = Object.assign({}, this.state.job, job);     // 对象赋值，同时注意不要给state直接赋值，先追加到空对象{}
        this.setState({
            showAddDialog: true,
            job:currentJob
        });
    }

    handleAdd = () => {
        console.log(this.input);
        console.log(this.refs.input);
        let job = this.state.job;
        console.log(job);

        if (job.name) {
            //this.props.updateJob(job);
            HttpUtil.post(ApiUtil.API_JOB_UPDATE, job)
            .then(
                re => {
                    message.info(re.message);
                    this.setState({
                        showAddDialog: false
                    });
                    this.props.getJobs()
                }
            ).catch(error => {
                message.error(error.message);
            });
        } else {
            message.error('请输入职位名');
        }
       
    }

    handleTextChanged = (e) => {
        //console.log(e.target.value);
        // state元素为对象时赋值，同时注意不要给state直接赋值，先追加到空对象{}
        let currentJob = Object.assign({}, this.state.job, {'name':e.target.value});
        this.setState({
            job:currentJob
        });
    }
    
    deleteConfirm = (job) => {
        var that = this;    // 下面的内嵌对象里面，this就改变了，这里在外面存一下。
        const modal = Modal.confirm({
            title: '确认',
            content: '确定要删除该职位吗？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                that.removeData(job.id);
                modal.destroy();
            },
            onCancel() { },
        });
    }

}



const mapStateToProps = (state) => {
    return {
      jobList: state.jobs.jobs,
      error: state.jobs.message
    }
  }

// 将action进行抽取后的写法：
export default connect(
    mapStateToProps, 
    {getJobs, updateJob})(JobList);
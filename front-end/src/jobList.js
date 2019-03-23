import React from 'react';
import Const from './Const'
import ApiUtil from './Utils/ApiUtil'

import {
    Table, Icon, Button, message, Modal
} from 'antd';


class JobList extends React.Component {
    columns = [{
        title: '序号',
        dataIndex: 'id',
        width: 80,
        align: 'center'
    }, {
        title: '职位',
        dataIndex: 'name',
    }, {
        title: '编辑',
        dataIndex: 'id',
        align: 'center',
        width: 160,
        render: (id) => (
            <span>
                <Icon type="close" title="删除" style={{ color: '#ee6633', }} onClick={() => this.showConfirm(id)} />
            </span>
        ),
    }];

    state = {
        mJobs: [],
    };

    getData() {
        HttpUtil.get(ApiUtil.API_JOB_LIST)
            .then(
                data => {
                    this.setState({
                        mJobs: data
                    });
                }
            ).catch(error => {
                message.error(error.message);
            });

        /* let mData = [];
        for (let i = 1; i < Const.jobs.length; i++) {
            let job = {
                index: i,
                key: i,
                id: i,
                job: Const.jobs[i],
            }
            mData.push(job);
        }

        this.setState({
            mJobs: mData,
        }); */
    }

    removeData(id) {
        HttpUtil.get(ApiUtil.API_JOB_DELETE + id)
            .then(
                re => {
                    message.info(re.message);
                    let jobs = this.state.mJobs.filter((item) => item.id !== id);
                    this.setState({
                        mJobs: jobs
                    });
                    
                }
            ).catch(error => {
                message.error(error.message);
            });
    }

    componentDidMount() {
        this.getData();
    }


    render() {
        return (
            <div>

                <Button type="primary" icon="plus" style={{ float: 'right', marginBottom: 10 }} onClick={() => this.showInfoDialog()}>添加</Button>

                <Table
                    dataSource={this.state.mJobs}
                    columns={this.columns}
                    pagination={false} />
            </div>
        )
    }

    showConfirm(id) {
        var that = this;    // 下面的内嵌对象里面，this就改变了，这里在外面存一下。
        const modal = Modal.confirm({
            title: '确认',
            content: '确定要删除该职位吗？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                that.removeData(id);
                modal.destroy();
            },
            onCancel() { },
        });
    }
}


export default JobList;
import React from 'react';
import Const from './Const'

import {
    Table, Icon, Button, message, Modal
} from 'antd';


class JobList extends React.Component {
    columns = [{
        title: '序号',
        dataIndex: 'index',
        width: 80,
        align: 'center'
    }, {
        title: '职位',
        dataIndex: 'job',
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
        let mData = [];
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
        });
    }

    removeData(id) {
        let jobs = this.state.mJobs.filter((item) => item.id !== id);
        this.setState({
            mJobs: jobs
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
        var that = this;    // 进入new Promise里面this就不能用了，这里在外面存一下。
        const modal = Modal.confirm({
            title: '确认',
            content: '确定要删除该条' + id + '记录吗？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                return new Promise((resolve, reject) => {
                    //this.removeData(id);
                    let rdm = Math.random();
                    console.log('test' + rdm);
                    setTimeout(rdm > 0.5 ? resolve(rdm) : reject(rdm), 2000);
                })
                    .then((re) => {
                        modal.destroy();
                        message.info('删除成功!' + re);
                        that.removeData(id);
                    })
                    .catch((re) => {
                        message.error('操作失败，该职位已经有数据录入!' + re);
                    });
            },
            onCancel() { },
        });
    }
}


export default JobList;
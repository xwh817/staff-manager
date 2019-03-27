import React from 'react';
import HttpUtil from './Utils/HttpUtil'
import ApiUtil from './Utils/ApiUtil'

import {
    Button, message,
} from 'antd';


export default class DataManager extends React.Component {
    state = {
        showDownload: false,
    }

    exportData = () => {
        HttpUtil.get(ApiUtil.API_FILE_BACKUP)
            .then(
                re => {
                    if (re.code >= 0) {
                        this.setState({
                            showDownload: true
                        });
                        message.info('保存成功');
                    } else { message.info('保存失败'); }

                }
            ).catch(error => {
                message.error(error.message);
            });
    }

    render() {
        return <div style={{ marginTop: 24, }}>
            <Button type="dashed" icon="export" onClick={this.exportData} >导出数据</Button>

            {this.state.showDownload && <Button type="primary" icon="download" href={ApiUtil.URL_IP + ApiUtil.API_FILE_GET_BACKUP} style={{ marginLeft: 24}}>下载数据</Button>}
        </div>
    }

}
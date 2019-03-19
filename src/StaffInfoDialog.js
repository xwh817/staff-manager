import React from 'react';
import { Modal, Button } from 'antd';

export default class StaffInfoDialog extends React.Component {
    state = {
        ModalText: '信息',
        visible: false,
        confirmLoading: false,
        staff:null,
    }

    componentDidMount() {
        this.getData();
    }

    componentWillReceiveProps(newProps){
        //console.log(newProps);
        if (newProps.visible){
            this.showModal()
        }
    }


    getData() {
        let i = 1;
        let staff = {
                key: '' + i,
                id: i,
                name: '姓名-' + i,
                job: 3,
                company: '公司-' + i,
                birth_year: 30,
                education: 3,
                hometown: '深圳',
                phone: '13567893456',
                email: 'test@163.com',
                qq: '67893456',
                wechat: '1356789',
            }
    }


    showModal = () => {
        this.setState({
            visible: true,
        });
    }

  handleOk = () => {
    this.setState({
      ModalText: '正在保存中……',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  }

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  }

  render() {
    const { visible, confirmLoading, ModalText } = this.state;
    return (
      <div>
        <Modal
          title="Title"
          visible={visible}
          style={{ top: 20, bottom: 20 }}
          width={800}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          afterClose = {this.props.afterClose}
        >
          <div style={{height:300}}>{ModalText}</div>
        </Modal>
      </div>
    );
  }
}
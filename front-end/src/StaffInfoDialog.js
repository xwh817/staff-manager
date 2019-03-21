import React from 'react';
import { Modal, Form, Icon, Input, Select, Button, Upload } from 'antd';
import Const from './Const'
const { TextArea } = Input;

export default class StaffInfoDialog extends React.Component {
  state = {
    ModalText: '信息',
    visible: false,
    confirmLoading: false,
    staff: null,
    mJobs: [],
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(newProps) {
    //console.log(newProps);
    if (newProps.visible) {
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

    this.setState({staff:staff});
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
    const { visible, confirmLoading } = this.state;

    return (
      <Modal
        title="信息编辑"
        visible={visible}
        style={{ top: 20 }}
        width={800}
        onOk={this.handleOk}
        confirmLoading={confirmLoading}
        onCancel={this.handleCancel}
        afterClose={this.props.afterClose}
        okText="保存"
        cancelText="取消"
      >
        <div>
          <Form layout="horizontal" onSubmit={this.handleSubmit}>

            <Form.Item label="职位" {...styles.formItemLayout}>
              <Select defaultValue={0} style={{ width: 140 }} onChange={value => console.log(value)}>
                {Const.jobs.map((job, index) => <Select.Option value={index} key={index+''}>{job}</Select.Option>)}
              </Select>
            </Form.Item>

            <Form.Item label="公司" {...styles.formItemLayout}>
              <Input placeholder="公司" />
            </Form.Item>

            <Form.Item label="学历" {...styles.formItemLayout}>
              <Select defaultValue={0} style={{ width: 140 }} onChange={value => console.log(value)}>
                {Const.edus.map((job, index) => <Select.Option value={index} key={index+''}>{job}</Select.Option>)}
              </Select>
            </Form.Item>

            <Form.Item label="出生年" {...styles.formItemLayout}>
              <Input placeholder="年份" />
            </Form.Item>

            <Form.Item label="籍贯" {...styles.formItemLayout}>
              <Input placeholder="省市" />
            </Form.Item>

            <Form.Item label="手机" {...styles.formItemLayout}>
              <Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} />
            </Form.Item>
            <Form.Item label="邮箱" {...styles.formItemLayout}>
              <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} />
            </Form.Item>
            <Form.Item label="QQ" {...styles.formItemLayout}>
              <Input prefix={<Icon type="qq" style={{ color: 'rgba(0,0,0,.25)' }} />} />
            </Form.Item>
            <Form.Item label="微信" {...styles.formItemLayout}>
              <Input prefix={<Icon type="wechat" style={{ color: 'rgba(0,0,0,.25)' }} />} />
            </Form.Item>

            <Form.Item label="工作经历"  {...styles.formItemLayout}>
              <TextArea placeholder="" autosize={{ minRows: 4, maxRows: 8 }} />
            </Form.Item>

            <Form.Item label="联系记录"  {...styles.formItemLayout}>
              <TextArea placeholder="" autosize={{ minRows: 4, maxRows: 8 }} />
            </Form.Item>


            <Form.Item label="附件" {...styles.formItemLayout} extra='已上传文件：'>
              <Upload name="logo" action="/upload.do" listType="picture">
                <Button>
                  <Icon type="upload" /> 选择附件上传
              </Button>
              </Upload>
            </Form.Item>

            <Form.Item wrapperCol={{span: 16, offset: 4}}>
              <Button
                  type="danger"
                  icon="delete"
                  style={{ width: 500}}>删除</Button>
            </Form.Item>
            
          </Form>

          
        </div>
      </Modal>
    );
  }
}

const styles = {
  formItemLayout: {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  },

};

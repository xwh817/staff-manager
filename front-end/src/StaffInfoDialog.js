import React from 'react';
import { Modal, Form, Icon, Input, InputNumber, Select, Button, Upload } from 'antd';
import Const from './Const'
const { TextArea } = Input;

class StaffInfoDialog extends React.Component {
  state = {
    ModalText: '信息',
    visible: false,
    confirmLoading: false,
    staff: {},
    mJobs: [],
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(newProps) {

    if (newProps.visible) {
      this.setState({
        visible: true,
        staff: newProps.staff,
      });
    }
  }


  getData() {

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

      this.props.onDialogConfirm(this.state.staff);

    }, 1000);
  }

  handleCancel = () => {

    this.setState({
      visible: false,
    });
  }

  handleDelete = () => {

  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }


  render() {
    const { visible, confirmLoading, staff } = this.state;

    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;



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


            <Form.Item label="姓名" {...styles.formItem2Col}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入姓名!' }],
              })(
                <Input placeholder="" />
              )}
            </Form.Item>


            <Form.Item label="职位" {...styles.formItemLayout}>
              {getFieldDecorator('job')(
                <Select defaultValue={staff.job} style={{ width: 140 }} onChange={value => console.log(value)}>
                  {Const.jobs.map((item) => <Select.Option value={item.id} key={item.id + ''}>{item.name}</Select.Option>)}
                </Select>
              )}

            </Form.Item>

            <Form.Item label="公司" {...styles.formItemLayout}>
              {getFieldDecorator('company')(
                <Input placeholder="公司" />
              )}
            </Form.Item>

            <Form.Item label="学历" {...styles.formItemLayout}>
              {getFieldDecorator('education')(
                <Select style={{ width: 140 }} onChange={value => console.log(value)}>
                  {Const.edus.map((item) => <Select.Option value={item.id} key={item.id + ''}>{item.name}</Select.Option>)}
                </Select>
              )}

            </Form.Item>

            <Form.Item label="出生年" {...styles.formItemLayout}>
            {getFieldDecorator('birth_year')(
                <InputNumber placeholder="年份" />
              )}
              
            </Form.Item>

            <Form.Item label="籍贯" {...styles.formItemLayout}>
              <Input placeholder="省市" defaultValue={staff.hometown} />
            </Form.Item>

            <Form.Item label="手机" {...styles.formItemLayout}>
              <Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} defaultValue={staff.phone} />
            </Form.Item>
            <Form.Item label="邮箱" {...styles.formItemLayout}>
              <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} defaultValue={staff.email} />
            </Form.Item>
            <Form.Item label="QQ" {...styles.formItemLayout}>
              <Input prefix={<Icon type="qq" style={{ color: 'rgba(0,0,0,.25)' }} />} defaultValue={staff.qq} />
            </Form.Item>
            <Form.Item label="微信" {...styles.formItemLayout}>
              <Input prefix={<Icon type="wechat" style={{ color: 'rgba(0,0,0,.25)' }} />} defaultValue={staff.wechat} />
            </Form.Item>

            <Form.Item label="工作经历"  {...styles.formItemLayout}>
              <TextArea placeholder="" autosize={{ minRows: 4, maxRows: 8 }} defaultValue={staff.experience} />
            </Form.Item>

            <Form.Item label="联系记录"  {...styles.formItemLayout}>
              <TextArea placeholder="" autosize={{ minRows: 4, maxRows: 8 }} defaultValue={staff.logs} />
            </Form.Item>

            <Form.Item label="附件" {...styles.formItemLayout} extra='已上传文件：'>
              <Upload name="logo" action="/upload.do" listType="picture">
                <Button>
                  <Icon type="upload" /> 选择附件上传
              </Button>
              </Upload>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
              <Button
                type="danger"
                icon="delete"
                style={{ width: 500 }}>删除</Button>
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
  formItem2Col: {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  },

};

const objToForm = (obj) => {
  let target = {}
  for (let [key, value] of Object.entries(obj)) {
    target[key] = Form.createFormField({ value })
  }
  return target
}


const mForm = Form.create({
  name: 'infoForm',
  mapPropsToFields(props) {
    if (!props.staff) {
      return;
    }

    return objToForm(props.staff);

    /* let value = {name:"test1234"};
    return {
      name: {value:Form.createFormField({value})},
      company:{value:Form.createFormField("test1234234")}, 
      
    }; */

    /* let p = {};
    let initValues = props.staff;
    if (initValues) {
      // 编辑时赋初值
      fieldsName.forEach(key => p[key] = { value: initValues[key] });
    } else {
      // 新建时赋空值
      fieldsName.forEach(key => p[key] = { value: '' });
    }
    return p; */

  }

})(StaffInfoDialog);

export default mForm;

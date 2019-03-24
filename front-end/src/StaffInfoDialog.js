import React from 'react';
import { Modal, Form, Icon, Input, InputNumber, Select, Button, Upload, message} from 'antd';
import CommonValues from './Utils/CommonValues';
import Const from './Const';
import ApiUtil from './Utils/ApiUtil';
import HttpUtil from './Utils/HttpUtil';


class StaffInfoDialog extends React.Component {
  state = {
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
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('表单数据有误，请根据提示填写！');
      } else {
        this.setState({
          confirmLoading: true,
        });


        HttpUtil.post(ApiUtil.API_STAFF_UPDATE, values)
            .then(
                re => {
                  message.info(re.message);
                }
            ).catch(error => {
                message.error(error.message);
            });

        console.log('Received values of form: ', values);
        setTimeout(() => {
          this.setState({
            visible: false,
            confirmLoading: false,
          });
    
          this.props.onDialogConfirm(values);
    
        }, 1000);
      }
    });

    
  }

  handleCancel = () => {

    this.setState({
      visible: false,
    });
  }

  handleDelete = () => {
    HttpUtil.get(ApiUtil.API_STAFF_DELETE + this.state.staff.id)
            .then(
                re => {
                  message.info(re.message);
                  this.setState({
                    visible: false,
                  });
                }
            ).catch(error => {
                message.error(error.message);
            });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit");
  }


  render() {
    const { visible, confirmLoading, staff } = this.state;

    const {
      getFieldDecorator,
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

            <Form.Item {...styles.formItem2Col}>
              {getFieldDecorator('id')(
                <Input type="hidden" />
              )}
            </Form.Item>

            <Form.Item label="姓名" {...styles.formItem2Col}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入姓名!' }],
              })(
                <Input placeholder="" />
              )}
            </Form.Item>


            <Form.Item label="职位" {...styles.formItemLayout}>
              {getFieldDecorator('job')(
                <Select style={{ width: 140 }} onChange={value => console.log(value)}>
                  {CommonValues.JOBS.map((item) => <Select.Option value={item.id} key={item.id + ''}>{item.name}</Select.Option>)}
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
              {getFieldDecorator('hometown')(
                <Input placeholder="省市" />
              )}
            </Form.Item>

            <Form.Item label="手机" {...styles.formItemLayout}>
              {getFieldDecorator('phone')(
                <Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} />
              )}
              </Form.Item>
            <Form.Item label="邮箱" {...styles.formItemLayout}>
              {getFieldDecorator('email')(
                <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} />
              )}
            </Form.Item>
            <Form.Item label="QQ" {...styles.formItemLayout}>
              {getFieldDecorator('qq')(
                <Input prefix={<Icon type="qq" style={{ color: 'rgba(0,0,0,.25)' }} />} />
              )}
            </Form.Item>
            <Form.Item label="微信" {...styles.formItemLayout}>
              {getFieldDecorator('wechat')(
                <Input prefix={<Icon type="wechat" style={{ color: 'rgba(0,0,0,.25)' }} />} />
              )}
            </Form.Item>

            <Form.Item label="工作经历"  {...styles.formItemLayout}>
              {getFieldDecorator('experience')(
                <Input.TextArea placeholder="" autosize={{ minRows: 4, maxRows: 8 }} />
              )}
            </Form.Item>

            <Form.Item label="联系记录"  {...styles.formItemLayout}>
              {getFieldDecorator('contact_logs')(
                <Input.TextArea placeholder="" autosize={{ minRows: 4, maxRows: 8 }} />
              )}
            </Form.Item>

            <Form.Item label="附件" {...styles.formItemLayout} extra='已上传文件：'>
              <Upload name="logo" action="/upload.do" listType="picture">
                <Button>
                  <Icon type="upload" /> 选择附件上传
              </Button>
              </Upload>
            </Form.Item>

            {
              staff.id > 0 && <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
                <Button
                  type="danger"
                  icon="delete"
                  onClick={this.handleDelete}
                  style={{ width: 500 }}>删除</Button>
              </Form.Item>
            }
            

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
  // Object.entries 返回其可枚举属性的键值对的对象。
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
  }
})(StaffInfoDialog);

export default mForm;

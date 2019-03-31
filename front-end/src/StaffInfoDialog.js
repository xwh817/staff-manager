import React from 'react';
import { Modal, Form, Icon, Input, InputNumber, Select, Button, Upload, message } from 'antd';
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
    deleteConfirm: false,
    fileList: [],
  }

  isFileUploaded = false;  // 是否有过文件上传

  componentWillReceiveProps(newProps) {
    if (this.state.visible !== newProps.visible) {
      this.setState({
        visible: newProps.visible
      });
    }

    if (newProps.staff && this.state.staff.id !== newProps.staff.id) {
      this.isFileUploaded = false;
      this.getFileList(newProps.staff.id);
      this.setState({
        visible: true,
        staff: newProps.staff,
        deleteConfirm: false,
      });
    }

  }


  getFileList(id) {

    if (id) {
      HttpUtil.get(ApiUtil.API_FILE_GET_LIST + id)
      .then(
        array => {
          let fileList = array.map((file, index) => {
            return {
              uid: '' + index,
              name: file,
              status: 'done',
              staffId: this.state.staff.id,
              url: (`${ApiUtil.URL_IP + ApiUtil.API_FILE_GET}/${id}/${file}`)
            }
          })
          console.info('getFileList:' + array.length);
          this.setState({fileList: fileList});
        }
      ).catch(error => {
        message.error(error.message);
      });
    } else {
      this.setState({fileList: []});
    }
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
          this.state.fileList.forEach(file => {
            file.staffId = this.state.staff.id
            file.url = `${ApiUtil.URL_IP + ApiUtil.API_FILE_GET}/${file.staffId}/${file.name}`
          });
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

    if (this.isFileUploaded) {
      HttpUtil.get(ApiUtil.API_FILE_DELETE_DIR + 0) // 取消时删除临时上传文件目录
      .then(re => {
        let fileList = this.state.fileList;

        fileList = fileList.filter(file => {
          return file.staffId > 0
        });

        if (fileList.length !== this.state.fileList.length) {
          this.setState({fileList: fileList});
        }
      }).catch(error => {
        message.error(error.message);
      });
    }
    
  }

  handleDelete = () => {
    if (!this.state.deleteConfirm) {
      this.setState({
        deleteConfirm: true
      });
      return;
    }

    HttpUtil.get(ApiUtil.API_STAFF_DELETE + this.state.staff.id)
      .then(
        re => {
          message.info(re.message);
          this.setState({
            visible: false,
          });
          this.props.onDialogConfirm(undefined);
        }
      ).catch(error => {
        message.error(error.message);
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit");
  }

  handleFileChange = (info) => {
    console.log('handleFileChange:' + info.file.status + ",info.fileList:" + info.fileList.length);
    /* if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    } */
    if (info.file.status === 'done') {
      this.isFileUploaded = true;
      message.success(`${info.file.name} 文件上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    } else if (info.file.status === 'removed') {
      //message.warn(`${info.file.name} 文件删除中……`);
      HttpUtil.get(`${ApiUtil.API_FILE_DELETE}/${info.file.staffId}/${info.file.name}`)
      .then(
        re => {
          message.info(re.code===0 ? '文件删除成功':'文件删除失败');
        }
      ).catch(error => {
        message.error(error.message);
      });
    }

    info.fileList.forEach(file => {
      if (!file.url) {// 刚上传的文件在临时文件夹里
        file.staffId = 0
        file.url = `${ApiUtil.URL_IP + ApiUtil.API_FILE_GET}/0/${file.name}`
      }
    });

    // 这里是一个大坑啊，每次要手动更新fileList,不然界面不更新
    this.setState({fileList:info.fileList});
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
                <InputNumber placeholder="年份" formatter={value => value > 0 ? value + '' : ''} />
              )}
            </Form.Item>

            <Form.Item label="籍贯" {...styles.formItemLayout}>
              {getFieldDecorator('hometown')(
                <Input placeholder="省市" />
              )}
            </Form.Item>
            
            <Form.Item label="地址" {...styles.formItemLayout}>
              {getFieldDecorator('address')(
                <Input placeholder="当前住址" />
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

            <Form.Item label="附件" {...styles.formItemLayout} >
                <Upload name="file"
                  action={ApiUtil.API_FILE_UPLOAD}
                  onChange={this.handleFileChange}
                  fileList={this.state.fileList} >
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
                  style={{ width: 500 }}>{this.state.deleteConfirm ? '删除' + this.state.staff.name + '吗？ 请再点一次确认操作。' : '删除'}</Button>
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

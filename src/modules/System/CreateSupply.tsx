import React, { KeyboardEvent, ReactElement, Component } from 'react';
import {
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Row,
  Col,
  Button,
  Upload,
  Icon,
  Rate,
  Tooltip,
  Input,
  Card,
  DatePicker,
  message,
  notification,
  Tree
} from 'antd';
import moment from 'moment';
import urlMaps from '../../common/urlMaps';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { FormComponentProps } from 'antd/es/form';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const RadioButton = Radio.Button;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const { Dragger } = Upload;
interface SupplyProps {
  form: FormComponentProps['form'];
  // onClose: any;
  data: any;
}
interface State {
  status: boolean;
}
// @Form.create()
// @inject('mito')
// @observer
class CreateSupply extends Component<SupplyProps, State> {
  constructor(props: SupplyProps) {
    super(props);
    this.state = {
      status: true
    };
  }
  componentDidMount() {}
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     const { cover_http, imgs_http, ...data_list } = values
    //     this.props.data.id ?
    //       this.props.mito.EditMito({
    //         data: {
    //           ...data_list,
    //           id: this.props.data.id,
    //           imgs: values.imgs.split("\n").filter((item: any) => item !== "")
    //         },
    //         callback: res => {
    //           if (res.code === 200) {
    //             message.success('保存成功');
    //             if (this.props.onClose) {
    //               this.props.onClose();
    //             }
    //           }
    //         },
    //       }) :
    //       this.props.mito.CreateMito({
    //         data: {
    //           ...data_list,
    //           imgs: values.imgs.split("\n").filter((item: any) => item !== "")
    //         },
    //         callback: res => {
    //           if (res.code === 200) {
    //             message.success('保存成功');
    //             if (this.props.onClose) {
    //               this.props.onClose();
    //             }
    //           }
    //         },
    //       })
    //   }
    // });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const isEdit = this.props.data;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    let baseUrl =
      window.location.protocol +
      '//' +
      document.domain +
      ':' +
      window.location.port +
      '/api';
    return (
      <Card
        bordered={false}
        title={isEdit ? '编辑供应商' : '添加供应商'}
        className="CreateMito"
      >
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="供应商"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('title', {
                  // initialValue: isEdit ? info_default.title : "",
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '供应商'
                    }
                  ]
                })(<Input placeholder="请输入供应商" />)}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="密码"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('title', {
                  // initialValue: isEdit ? info_default.title : "",
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '密码'
                    }
                  ]
                })(<Input placeholder="请输入密码" />)}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="联系人"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('title', {
                  // initialValue: isEdit ? info_default.title : "",
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '联系人'
                    }
                  ]
                })(<Input placeholder="请输入联系人" />)}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="电话"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('title', {
                  // initialValue: isEdit ? info_default.title : "",
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '电话'
                    }
                  ]
                })(<Input placeholder="请输入电话" />)}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="权限"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('title', {
                  // initialValue: isEdit ? info_default.title : "",
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '权限'
                    }
                  ]
                })(
                  <Select
                    defaultValue="lucy"
                    style={{ width: 300 }}
                    placeholder="选择权限"
                    // onChange={handleChange}
                  >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="disabled" disabled>
                      Disabled
                    </Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                )}
              </FormItem>
            </Col>

            <Col xl={12} md={24} sm={24} offset={6}>
              <div className="submitButtons">
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

export default Form.create<SupplyProps>()(CreateSupply);

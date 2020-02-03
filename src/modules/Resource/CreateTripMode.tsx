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
import NewBraft from '../../components/BraftEditor';
import store from '../../models/index';
import BraftEditor, { EditorState } from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import '../../components/BraftEditor/index.less';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const RadioButton = Radio.Button;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const { Dragger } = Upload;
interface TripModeProps {
  form: FormComponentProps['form'];
  onClose: any;
  data: any;
}
interface State {
  status: boolean;
}
@inject('resource')
@observer
class CreateTripMode extends Component<TripModeProps, State> {
  constructor(props: TripModeProps) {
    super(props);
    this.state = {
      status: true
    };
  }
  componentDidMount() {
    this.props.data &&
      store.resource.getTripModeSingle({
        data: { id: this.props.data.id }
      });
    store.global.getCityList({
      data: {}
    });
  }
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.data
          ? store.resource.EditTripMode({
              data: {
                id: this.props.data.id,
                ...values
              },
              callback: res => {
                if (res.code === 0) {
                  message.success('保存成功');
                  if (this.props.onClose) {
                    this.props.onClose();
                  }
                }
              }
            })
          : store.resource.CreateTripMode({
              data: {
                ...values
              },
              callback: res => {
                if (res.code === 0) {
                  message.success('保存成功');
                  if (this.props.onClose) {
                    this.props.onClose();
                  }
                }
              }
            });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const isEdit = this.props.data !== undefined;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const singleInfo = store.resource.tripModeSingle;
    return (
      <Card
        bordered={false}
        title={isEdit ? '编辑出行方式' : '添加出行方式'}
        className="CreateMito"
      >
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="出行方式"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('tirpMode', {
                  initialValue: isEdit ? singleInfo.tirpMode : undefined,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '选择出行方式'
                    }
                  ]
                })(
                  <Select
                    style={{ width: 300 }}
                    placeholder="选择出行方式"
                    // onChange={handleChange}
                  >
                    <Option value="1">航空</Option>
                    <Option value="2">铁路</Option>
                    <Option value="3">包车</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="所属"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('subordinate', {
                  initialValue: isEdit ? singleInfo.subordinate : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请输入所属'
                    }
                  ]
                })(<Input placeholder="请输入所属" />)}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="起点"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('start', {
                  initialValue: isEdit ? singleInfo.start : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请输入起点'
                    }
                  ]
                })(<Input placeholder="请输入起点" />)}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="中转点"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('transfer', {
                  initialValue: isEdit ? singleInfo.transfer : '',
                  rules: [
                    {
                      required: false,
                      whitespace: true,
                      message: '请输入中转点'
                    }
                  ]
                })(<Input placeholder="请输入中转点" />)}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="终点"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('end', {
                  initialValue: isEdit ? singleInfo.end : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请输入终点'
                    }
                  ]
                })(<Input placeholder="请输入终点" />)}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="班次"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('number', {
                  initialValue: isEdit ? singleInfo.number : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请输入班次'
                    }
                  ]
                })(<Input placeholder="请输入班次" />)}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="出发时间（'小时'）"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('startHour', {
                  initialValue: isEdit ? singleInfo.startHour : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: "请输入出发时间（'小时'）"
                    }
                  ]
                })(
                  <Input
                    placeholder="请输入出发时间（'小时'）"
                    style={{ width: '250px' }}
                  />
                )}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="出发时间（'分钟'）"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('startMin', {
                  initialValue: isEdit ? singleInfo.startMin : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: "请输入出发时间（'分钟'）"
                    }
                  ]
                })(
                  <Input
                    placeholder="请输入出发时间（'分钟'）"
                    style={{ width: '250px' }}
                  />
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

export default Form.create<TripModeProps>()(CreateTripMode);

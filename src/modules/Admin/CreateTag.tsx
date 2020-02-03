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
interface TagProps {
  form: FormComponentProps['form'];
  onClose: any;
  data: any;
}
interface State {
  status: boolean;
}
@inject('tag')
@observer
class CreateTag extends Component<TagProps, State> {
  constructor(props: TagProps) {
    super(props);
    this.state = {
      status: true
    };
  }
  componentDidMount() {
    this.props.data &&
      store.tag.getTagSingle({
        data: { id: this.props.data.id }
      });
  }
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.data
          ? store.tag.EditTag({
              data: {
                id: this.props.data.id,
                ...values,
                startTime:
                  values.startTime !== ''
                    ? moment(values.startTime.valueOf()).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )
                    : '',
                endTime:
                  values.endTime !== ''
                    ? moment(values.endTime.valueOf()).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )
                    : ''
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
          : store.tag.CreateTag({
              data: {
                ...values,
                startTime:
                  values.startTime !== ''
                    ? moment(values.startTime.valueOf()).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )
                    : '',
                endTime:
                  values.endTime !== ''
                    ? moment(values.endTime.valueOf()).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )
                    : ''
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
    const CityList = store.global.cityList;
    const isEdit = this.props.data !== undefined;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const singleInfo = store.tag.tagSingle;
    return (
      <Card
        bordered={false}
        title={isEdit ? '编辑首页标签' : '添加首页标签'}
        className="CreateMito"
      >
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="标签名称"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('title', {
                  initialValue: isEdit ? singleInfo.title : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '标签名称'
                    }
                  ]
                })(<Input placeholder="请输入标签名称" />)}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="副标题名称"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('subtitle', {
                  initialValue: isEdit ? singleInfo.subtitle : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '副标题名称'
                    }
                  ]
                })(<Input placeholder="请输入副标题名称" />)}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="位置"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('sort', {
                  initialValue: isEdit ? singleInfo.sort : undefined,
                  rules: [
                    {
                      required: true,
                      message: '位置'
                    }
                  ]
                })(
                  <Select style={{ width: 200 }} placeholder="请选择位置">
                    <Option value={1}>1</Option>
                    <Option value={2}>2</Option>
                    <Option value={3}>3</Option>
                    <Option value={4}>4</Option>
                    <Option value={5}>5</Option>
                    <Option value={6}>6</Option>
                    <Option value={7}>7</Option>
                    <Option value={8}>8</Option>
                    <Option value={9}>9</Option>
                    <Option value={10}>10</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="上架时间"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('startTime', {
                  initialValue: isEdit
                    ? moment(Date.parse(singleInfo.startTime))
                    : null,
                  rules: [
                    {
                      required: true,
                      message: '上架时间'
                    }
                  ]
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    placeholder="上架时间"
                  />
                )}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="下架时间"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('endTime', {
                  ...(isEdit && singleInfo.endTime
                    ? { initialValue: moment(Date.parse(singleInfo.endTime)) }
                    : {}),
                  rules: [
                    {
                      required: false,
                      message: '下架时间'
                    }
                  ]
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    placeholder="下架时间"
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

Form;

export default Form.create<TagProps>()(CreateTag);

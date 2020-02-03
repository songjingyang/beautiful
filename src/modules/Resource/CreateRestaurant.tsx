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
interface RestaurantProps {
  form: FormComponentProps['form'];
  onClose: any;
  data: any;
}
interface State {
  status: boolean;
}
@inject('resource')
@observer
class CreateRestaurant extends Component<RestaurantProps, State> {
  constructor(props: RestaurantProps) {
    super(props);
    this.state = {
      status: true
    };
  }
  componentDidMount() {
    this.props.data &&
      store.resource.getRestaurantSingle({
        data: { id: this.props.data.id },
        callback: (res: any) => {
          if (res.code === 0) {
            this.props.form.setFieldsValue({
              introduce: BraftEditor.createEditorState(res.data.introduce)
            });
          }
        }
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
          ? store.resource.EditRestaurant({
              data: {
                id: this.props.data.id,
                ...values,
                introduce: values.introduce.toHTML()
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
          : store.resource.CreateRestaurant({
              data: {
                ...values,
                introduce: values.introduce.toHTML()
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
    const singleInfo = store.resource.restaurantSingle;
    return (
      <Card
        bordered={false}
        title={isEdit ? '编辑餐厅' : '添加餐厅'}
        className="CreateMito"
      >
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="餐厅名称"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('name', {
                  initialValue: isEdit ? singleInfo.name : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '餐厅名称'
                    }
                  ]
                })(<Input placeholder="请输入餐厅名称" />)}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="所属城市"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('city', {
                  initialValue: isEdit ? singleInfo.city : undefined,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '所属城市'
                    }
                  ]
                })(
                  <Select
                    style={{ width: 300 }}
                    placeholder="选择所属城市"
                    // onChange={handleChange}
                  >
                    {CityList.map((item: any, index: number) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="餐厅地址"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('address', {
                  initialValue: isEdit ? singleInfo.address : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '餐厅地址'
                    }
                  ]
                })(<Input placeholder="请输入餐厅地址" />)}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="餐厅电话"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('telephone', {
                  initialValue: isEdit ? singleInfo.telephone : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '餐厅电话'
                    }
                  ]
                })(<Input placeholder="请输入餐厅电话" />)}
              </FormItem>
            </Col>
            {/* <Col xl={24} md={24} sm={24}>
              <FormItem
                label="星级"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('star', {
                  initialValue: isEdit ? singleInfo.star : "",
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '星级',
                    },
                  ],
                })(
                  <Input
                    placeholder="请输入星级"
                  />
                )}
              </FormItem>
            </Col> */}
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="交通攻略"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('traffic', {
                  initialValue: isEdit ? singleInfo.traffic : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '交通攻略'
                    }
                  ]
                })(
                  <TextArea
                    placeholder="请输入交通攻略"
                    autoSize={{ minRows: 5 }}
                  />
                )}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="餐厅介绍">
                {getFieldDecorator('introduce', {
                  initialValue: isEdit
                    ? BraftEditor.createEditorState(singleInfo.introduce)
                    : BraftEditor.createEditorState(null),
                  rules: [
                    {
                      required: true,
                      message: '请输入餐厅介绍'
                    }
                  ]
                })(
                  <BraftEditor
                    className="my-editor"
                    style={{ width: '750px' }}
                    excludeControls={[
                      'link',
                      'code',
                      'media',
                      'clear',
                      'blockquote'
                    ]}
                    placeholder="请输入正文内容"
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

export default Form.create<RestaurantProps>()(CreateRestaurant);

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
interface ScenicProps {
  form: FormComponentProps['form'];
  onClose: any;
  data: any;
}
interface State {
  status: boolean;
}
@inject('resource')
@observer
class CreateScenicSpot extends Component<ScenicProps, State> {
  constructor(props: ScenicProps) {
    super(props);
    this.state = {
      status: true
    };
  }
  componentDidMount() {
    this.props.data &&
      store.resource.getScenicSpotSingle({
        data: { id: this.props.data.id },
        callback: (res: any) => {
          if (res.code === 0) {
            this.props.form.setFieldsValue({
              introduce: BraftEditor.createEditorState(res.data.introduce),
              convenient: BraftEditor.createEditorState(res.data.convenient)
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
          ? store.resource.EditScenicSpot({
              data: {
                id: this.props.data.id,
                ...values,
                introduce: values.introduce.toHTML(),
                convenient: values.convenient.toHTML()
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
          : store.resource.CreateScenicSpot({
              data: {
                ...values,
                introduce: values.introduce.toHTML(),
                convenient: values.convenient.toHTML()
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
    console.log('TCL: CreateScenicSpot -> render -> CityList', CityList);
    const isEdit = this.props.data !== undefined;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const singleInfo = store.resource.scenicCreateSingle;
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
        title={isEdit ? '编辑景点' : '添加景点'}
        className="CreateMito"
      >
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="景点名称"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('name', {
                  initialValue: isEdit ? singleInfo.name : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '景点名称'
                    }
                  ]
                })(<Input placeholder="请输入景点名称" />)}
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
              <FormItem {...formItemLayout} label="便捷信息">
                {getFieldDecorator('convenient', {
                  initialValue: isEdit
                    ? BraftEditor.createEditorState(singleInfo.convenient)
                    : BraftEditor.createEditorState(null),
                  rules: [
                    {
                      required: true,
                      message: '请输入便捷信息'
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
            <Col xl={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="景点介绍">
                {getFieldDecorator('introduce', {
                  initialValue: isEdit
                    ? BraftEditor.createEditorState(singleInfo.introduce)
                    : BraftEditor.createEditorState(null),
                  rules: [
                    {
                      required: true,
                      message: '请输入景点介绍'
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

export default Form.create<ScenicProps>()(CreateScenicSpot);

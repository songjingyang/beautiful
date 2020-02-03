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
import OssUpload from '../../components/Upload';
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
interface VideoProps {
  form: FormComponentProps['form'];
  onClose: any;
  data: any;
}
interface State {
  status: boolean;
}
@inject('resource')
@observer
class CreateVideo extends Component<VideoProps, State> {
  constructor(props: VideoProps) {
    super(props);
    this.state = {
      status: true
    };
  }
  componentDidMount() {
    this.props.data &&
      store.resource.getVideoSingle({
        data: { id: this.props.data.id }
      });
    store.global.getCityList({
      data: {}
    });
  }
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('TCL: CreateVideo -> handleSubmit -> values', values);
      if (!err) {
        this.props.data
          ? store.resource.EditVideo({
              data: {
                id: this.props.data.id,
                ...values,
                url: values.url[0].response.data.filename
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
          : store.resource.CreateVideo({
              data: {
                ...values,
                url: values.url[0].response.data.filename
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
  handleChange = () => {};
  render() {
    const { getFieldDecorator } = this.props.form;
    const isEdit = this.props.data !== undefined;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const singleInfo = store.resource.videoSingle;
    let json = [
      {
        uid: 'rc-upload-1574914933264-5',
        url: 'video/15749153445156968682166871161574915347978.mp4',
        lastModified: 1574825447064,
        lastModifiedDate: '2019-11-27T03:30:47.064Z',
        name: 'b0c2bb249c564e3b24785f73fea77905.mp4',
        size: 901823,
        type: 'video/mp4',
        percent: 100,
        originFileObj: {
          uid: 'rc-upload-1574914933264-5',
          url: 'video/15749153445156968682166871161574915347978.mp4'
        },
        status: 'done',
        thumbUrl: '',
        response: {
          code: 0,
          msg: null,
          data: {
            filename:
              'http://miramartravel.oss-cn-shenzhen.aliyuncs.com/video/15749153445156968682166871161574915347978.mp4',
            size: '901823',
            mimeType: 'video/mp4',
            width: '',
            height: ''
          }
        },
        xhr: {}
      }
    ];
    let url = singleInfo.url;
    console.log('TCL: CreateVideo -> render -> url', url);
    json.map((item: any, index: number) => {
      if (url) {
        item.name = url;
        item.uid = '16549861321684';
        item.url = url.split('com/')[1];
        console.log(
          'TCL: CreateVideo -> render ->  url.split',
          url.split('com/')[1]
        );
        item.type = 'video/' + url.split('com/')[1].split('.')[1];
        item.originFileObj.uid = '16549861321684';
        item.originFileObj.url = url.split('com/')[1];
        item.response.data.filename = url;
        item.response.data.mimeType =
          'video/' + url.split('com/')[1].split('.')[1];
      }
    });
    return (
      <Card
        bordered={false}
        title={isEdit ? '编辑视频' : '添加视频'}
        className="CreateMito"
      >
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="视频名称"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('name', {
                  initialValue: isEdit ? singleInfo.name : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请输入视频名称'
                    }
                  ]
                })(<Input placeholder="视频名称" />)}
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
                      message: '选择城市'
                    }
                  ]
                })(
                  <Select style={{ width: 300 }} placeholder="请选择城市">
                    {store.global.cityList.map((item: any, index: number) => (
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
                label={
                  <span>
                    上传视频&nbsp;
                    <Tooltip title="只能上传一个视频！！！">
                      <Icon type="info-circle" />
                    </Tooltip>
                  </span>
                }
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('url', {
                  initialValue: isEdit ? json : [],
                  rules: [
                    {
                      required: true,
                      // whitespace: true,
                      message: '上传视频'
                    }
                  ]
                })(
                  <OssUpload
                    type={'2'}
                    isShowUploadList={true}
                    uploadNumber={1}
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

export default Form.create<VideoProps>()(CreateVideo);

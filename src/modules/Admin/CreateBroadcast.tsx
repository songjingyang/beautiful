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
import { IndexOfHttp } from '../../utils/utils';
import store from '../../models/index';
import BraftEditor, { EditorState } from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import '../../components/BraftEditor/index.less';
import OssUpload from '../../components/Upload';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const RadioButton = Radio.Button;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const { Dragger } = Upload;
interface BroadcastProps {
  form: FormComponentProps['form'];
  onClose: any;
  data: any;
}
interface State {
  status: boolean;
  loading: boolean;
  jump: number;
  cityId: string;
}
@inject('broadcast')
@observer
class CreateBroadcast extends Component<BroadcastProps, State> {
  constructor(props: BroadcastProps) {
    super(props);
    this.state = {
      status: true,
      loading: true,
      jump: 0,
      cityId: ''
    };
  }
  async componentDidMount() {
    await store.global.getCityList({
      data: {
        current: 1,
        size: 10000
      }
    });
    await store.tag.getTagPage({
      data: {
        current: 1,
        size: 10000,
        state: 1
      }
    });
    await store.strategy.getCityStrategyPage({
      data: {
        current: 1,
        size: 10000
      }
    });
    await store.strategy.getPictureStrategyPage({
      data: {
        current: 1,
        size: 10000,
        state: 1
      }
    });
    await store.strategy.getVideoStrategyPage({
      data: {
        current: 1,
        size: 10000,
        state: 1
      }
    });
    await store.tourisms.getTourismPage({
      data: {
        current: 1,
        size: 10000,
        state: 1
      }
    });
    (await this.props.data) &&
      store.broadcast.getBroadcastSingle({
        data: {
          id: this.props.data.id
        },
        callback: res => {
          if (res.code === 0) {
            this.setState({
              loading: false,
              jump: res.data.jump,
              cityId: res.data.cityId
            });
          }
        }
      });
  }
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.data
          ? store.broadcast.EditBroadcast({
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
                    : '',
                url: values.url[0].response.data.filename,
                jumpUrl: values.jumpUrl ? IndexOfHttp(values.jumpUrl) : ''
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
          : store.broadcast.CreateBroadcast({
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
                    : '',
                url: values.url[0].response.data.filename,
                jumpUrl: values.jumpUrl ? IndexOfHttp(values.jumpUrl) : ''
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
  handleChangeCity = (value: any) => {
    this.setState(
      {
        cityId: value
      },
      () => {
        this.props.form.setFieldsValue({
          itemId: undefined
          // jumpUrl: "",
        });
      }
    );
  };
  handleChangeJump = (value: any) => {
    this.setState(
      {
        jump: value,
        cityId: ''
      },
      () => {
        this.props.form.setFieldsValue({
          cityId: undefined,
          itemId: undefined
          // jumpUrl: ""
        });
      }
    );
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const CityList = store.global.cityList;
    const tagList = store.tag.tagPage.records;
    const isEdit = this.props.data !== undefined;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const singleInfo = store.broadcast.broadcastSingle;
    const cityStraegyPage = store.strategy.cityStraegyPage.records.map(item => {
      return { ...item, jumpType: 1 };
    });
    const pictureStraegyPage = store.strategy.pictureStraegyPage.records.map(
      item => {
        return { ...item, jumpType: 2 };
      }
    );
    const videoStraegyPage = store.strategy.videoStraegyPage.records.map(
      item => {
        return { ...item, jumpType: 3 };
      }
    );
    const tourismPage = store.tourisms.tourismPage.records.map(item => {
      return { ...item, jumpType: 4 };
    });
    const info = [
      ...cityStraegyPage,
      ...pictureStraegyPage,
      ...videoStraegyPage,
      ...tourismPage
    ];

    let url = singleInfo.url;
    const json_img = [
      {
        uid: 'rc-upload-1574925611551-2',
        url: 'img/15749256138437071375449767021574925617190.jpg',
        lastModified: 1574400765576,
        lastModifiedDate: '2019-11-22T05:32:45.576Z',
        name: 'b17123b76cb838e9cc2d291f5bf62ba8.jpg',
        size: 1411649,
        type: 'image/jpeg',
        percent: 100,
        originFileObj: {
          uid: 'rc-upload-1574925611551-2',
          url: 'img/15749256138437071375449767021574925617190.jpg'
        },
        status: 'done',
        thumbUrl: '',
        response: {
          code: 0,
          msg: null,
          data: {
            filename:
              'http://miramartravel.oss-cn-shenzhen.aliyuncs.com/img/15749256138437071375449767021574925617190.jpg',
            size: '1411649',
            mimeType: 'image/jpeg',
            width: '1920',
            height: '1080'
          }
        },
        xhr: {}
      }
    ];
    json_img.map((item: any, index: number) => {
      if (url) {
        item.uid = '16549861321684';
        item.url = url;
        item.type = 'img/' + url.split('com/')[1].split('.')[1];
        item.originFileObj.uid = '16549861321684';
        item.originFileObj.url = url;
        item.response.data.filename = url;
        item.response.data.mimeType =
          'img/' + url.split('com/')[1].split('.')[1];
      }
    });

    console.log(
      'TCL: CreateBroadcast -> render -> this.state.jump ',
      this.state.jump
    );
    return (
      <Card
        bordered={false}
        loading={this.props.data ? this.state.loading : false}
        title={isEdit ? '编辑首页轮播' : '添加首页轮播'}
        className="CreateMito"
      >
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="标题"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('title', {
                  initialValue: isEdit ? singleInfo.title : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '标题'
                    }
                  ]
                })(<Input placeholder="请输入标题" />)}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="位置"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('position', {
                  initialValue: isEdit ? singleInfo.position : undefined,
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
                    {/* <Option value={4}>4</Option>
                    <Option value={5}>5</Option>
                    <Option value={6}>6</Option>
                    <Option value={7}>7</Option>
                    <Option value={8}>8</Option>
                    <Option value={9}>9</Option>
                    <Option value={10}>10</Option> */}
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
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label={
                  <span>
                    图片&nbsp;
                    <Tooltip title="只能上传一个图片！！！">
                      <Icon type="info-circle" />
                    </Tooltip>
                  </span>
                }
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('url', {
                  initialValue: isEdit ? json_img : [],
                  rules: [
                    {
                      required: true,
                      message: '选择图片'
                    }
                  ]
                })(
                  <OssUpload
                    type={'1'}
                    isShowUploadList={true}
                    uploadNumber={1}
                  />
                )}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="跳转"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('jump', {
                  initialValue: isEdit ? singleInfo.jump : undefined,
                  rules: [
                    {
                      required: true,
                      message: '跳转'
                    }
                  ]
                })(
                  <Select
                    style={{ width: 200 }}
                    placeholder="请选择跳转"
                    onChange={this.handleChangeJump}
                  >
                    <Option value={1}>城市攻略</Option>
                    <Option value={2}>图集攻略</Option>
                    <Option value={3}>视频攻略</Option>
                    <Option value={4}>旅游产品</Option>
                    <Option value={5}>链接</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            {(this.state.jump === 1 ||
              this.state.jump === 2 ||
              this.state.jump === 3) && (
              <Col xl={24} md={24} sm={24}>
                <FormItem
                  label="跳转城市"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('cityId', {
                    initialValue: isEdit ? singleInfo.cityId : undefined,
                    rules: [
                      {
                        required: true,
                        message: '跳转城市'
                      }
                    ]
                  })(
                    <Select
                      style={{ width: 200 }}
                      placeholder="请选择跳转城市"
                      onChange={this.handleChangeCity}
                    >
                      {CityList.map((item: any) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            )}
            {this.state.jump === 4 && (
              <Col xl={24} md={24} sm={24}>
                <FormItem
                  label="跳转标签"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('cityId', {
                    initialValue: isEdit ? singleInfo.cityId : undefined,
                    rules: [
                      {
                        required: true,
                        message: '跳转标签'
                      }
                    ]
                  })(
                    <Select
                      style={{ width: 200 }}
                      placeholder="请选择跳转标签"
                      onChange={this.handleChangeCity}
                    >
                      {tagList.map((item: any) => (
                        <Option key={item.id} value={item.id}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            )}
            {this.state.jump !== 5 && this.state.cityId && (
              <Col xl={24} md={24} sm={24}>
                <FormItem
                  label="对应产品"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('itemId', {
                    initialValue: isEdit ? singleInfo.itemId : undefined,
                    rules: [
                      {
                        required: true,
                        message: '对应产品'
                      }
                    ]
                  })(
                    <Select style={{ width: 200 }} placeholder="请选择对应产品">
                      {info.map(
                        (item: any) =>
                          item.jumpType ===
                            this.props.form.getFieldValue('jump') &&
                          (this.props.form.getFieldValue('cityId') ===
                            item.cityValue ||
                            this.props.form.getFieldValue('cityId') ===
                              item.tagValue) && (
                            <Option key={item.id} value={item.id}>
                              {' '}
                              {item.title || item.name}
                            </Option>
                          )
                      )}
                    </Select>
                  )}
                </FormItem>
              </Col>
            )}
            {this.state.jump === 5 && (
              <Col xl={24} md={24} sm={24}>
                <FormItem
                  label="跳转链接"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('jumpUrl', {
                    initialValue: isEdit ? singleInfo.jumpUrl : undefined,
                    rules: [
                      {
                        required: true,
                        message: '跳转'
                      }
                    ]
                  })(
                    <Input
                      placeholder="请输入跳转链接"
                      style={{ width: '200px' }}
                    />
                  )}
                </FormItem>
              </Col>
            )}
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

export default Form.create<BroadcastProps>()(CreateBroadcast);

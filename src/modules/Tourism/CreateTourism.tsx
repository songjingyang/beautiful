import React, { KeyboardEvent, ReactElement, Component } from 'react';
import {
  Form,
  Select,
  InputNumber,
  Switch,
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
  Tree,
  Table,
  Popconfirm,
  Radio,
  Badge,
  Calendar,
  Drawer
} from 'antd';
import moment from 'moment';
import urlMaps from '../../common/urlMaps';
import SetPrice from './SetPrice';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { FormComponentProps } from 'antd/es/form';
import NewBraft from '../../components/BraftEditor';
import store from '../../models/index';
import BraftEditor, { EditorState } from 'braft-editor';
import PreviewImg from '../../components/PreviewImg';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import '../../components/BraftEditor/index.less';
import OssUpload from '../../components/Upload';
import Picture from '../../components/Picture';
import { StandardTableColumnProps } from '../Table';
import './index.less';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const { Dragger } = Upload;
interface TourismProps {
  form: FormComponentProps['form'];
  onClose: any;
  data: any;
}
interface State {
  status: boolean;
  columns: StandardTableColumnProps[];
  fileData: any[];
  everyDay: any[];
  loading: boolean;
  // dataChange: any
}
@inject('resource', 'tag')
@observer
class CreateTourism extends Component<TourismProps, State> {
  constructor(props: TourismProps) {
    super(props);
    this.state = {
      status: true,
      fileData: [],
      loading: true,
      everyDay: [],
      // dataChange: {},
      columns: [
        {
          title: '图片',
          dataIndex: 'url',
          render: (text: string, record: any) =>
            record.format === 1 ? (
              <PreviewImg alt="url" src={text} />
            ) : (
              <video style={{ width: 200 }} src={text} controls />
            )
        },
        {
          title: '图片宽度',
          dataIndex: 'wide'
        },
        {
          title: '图片高度',
          dataIndex: 'high'
        },
        {
          title: '编辑',
          dataIndex: 'play',
          render: (text: string, record: any) => {
            return (
              <Popconfirm
                title="你确定删除吗？"
                icon={
                  <Icon type="question-circle-o" style={{ color: 'red' }} />
                }
                okText="确认"
                cancelText="取消"
                onConfirm={() => this.DeleteSingle(record)}
              >
                <a href="#" onClick={(e) => { e.preventDefault() }}>删除</a>
              </Popconfirm>
            );
          }
        }
      ]
    };
  }
  componentDidMount() {
    store.tourisms.ClearPrice();
    this.props.data &&
      store.tourisms.getTourismSingle({
        data: { id: this.props.data.id },
        callback: res => {
          if (res.code === 0) {
            this.props.form.setFieldsValue({
              period: res.data.period,
              holiday: res.data.holiday,
              weekend: res.data.weekend
            });
            this.setState({
              fileData: res.data.bmMaterialList,
              loading: false
            });
          }
        }
      });
    store.tag.getTagPage({
      data: {}
    });
    store.resource.getPicturePage({
      data: {}
    });
    store.resource.getBasicProductsPage({
      data: {},
      callback: res => {}
    });
  }

  ChangeList = (fileList: any) => {
    const dataArray = fileList.map((item: any) => item.response.data);
    console.log('TCL: ChangeList -> dataArray', dataArray);
    this.setState({
      fileData: [
        ...this.state.fileData,
        ...dataArray.map((item: any, index: number) => {
          return {
            wide: +item.width,
            high: +item.height,
            url: item.filename,
            format: 1,
            limits: 1,
            type: 4
          };
        })
      ]
    });
  };
  ChangeVideo = (fileList: any) => {
    const dataArray = fileList.map((item: any) => item.response.data);
    console.log('TCL: ChangeVideo -> dataArray', dataArray);
    this.setState({
      fileData: [
        ...this.state.fileData,
        ...dataArray.map((item: any, index: number) => {
          return {
            wide: +item.width,
            high: +item.height,
            url: item.filename,
            format: 2,
            limits: 1,
            type: 3
          };
        })
      ]
    });
  };
  ChangePicture = (fileList: any) => {
    console.log('TCL: ChangePicture -> fileList', fileList);
    this.setState({
      fileData: [
        ...this.state.fileData,
        ...fileList.map((item: any, index: number) => {
          return {
            format: 1,
            limits: 2,
            type: 3,
            high: item.high,
            wide: item.wide,
            url: item.url
          };
        })
      ]
    });
  };
  DeleteSingle = (record: any) => {
    this.setState({
      fileData: this.state.fileData.filter(item => {
        return item !== record;
      })
    });
  };
  clearPrice = () => {
    store.tourisms.ClearPrice();
    // this.props.form.setFieldsValue({
    //   weekend: 1,
    //   holiday: 1,
    //   period: 1
    // });
  };
  changeWeek = () => {
    store.tourisms.ClearPrice();
    // this.props.form.setFieldsValue({
    //   holiday: 1
    // });
  };
  ChangeEnd = () => {
    store.tourisms.EditEndTime(this.props.form.getFieldValue('endTime'));
  };
  ChangeStart = () => {
    store.tourisms.EditStartTime(this.props.form.getFieldValue('startTime'));
  };
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bmTourProductDaysList = store.tourisms.tourismSingle.bmTourProductDaysList.map(
      (item: any, index: number) => {
        return {
          data: item.data,
          price: item.price,
          childrenPrice: item.childrenPrice,
          babyPrice: item.babyPrice
        };
      }
    );
    this.props.form.validateFields((err, values) => {
      console.log('TCL: CreateTourism -> handleSubmit -> values', values);
      if (!err) {
        this.setState(
          {
            everyDay:
              values.type === '1'
                ? [
                    {
                      data: moment(values.startTime.valueOf()).format(
                        'YYYY-MM-DD'
                      ),
                      price:
                        store.tourisms.tourismSingle.bmTourProductDaysList[0]
                          .price,
                      babyPrice:
                        store.tourisms.tourismSingle.bmTourProductDaysList[0]
                          .babyPrice,
                      childrenPrice:
                        store.tourisms.tourismSingle.bmTourProductDaysList[0]
                          .childrenPrice
                    }
                  ]
                : []
          },
          () => {
            this.props.data
              ? store.tourisms.EditTourism({
                  data: {
                    ...values,
                    id: this.props.data.id,
                    bmMaterialList: this.state.fileData.slice(-9),
                    startTime: moment(values.startTime.valueOf()).format(
                      'YYYY-MM-DD HH:mm:ss'
                    ),
                    endTime: moment(values.endTime.valueOf()).format(
                      'YYYY-MM-DD HH:mm:ss'
                    ),
                    coverUrl: values.coverUrl[0].response.data.filename,
                    bmTourProductDaysList:
                      values.type === '1'
                        ? this.state.everyDay
                        : bmTourProductDaysList
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
              : store.tourisms.CreateTourism({
                  data: {
                    ...values,
                    bmMaterialList: this.state.fileData.slice(-9),
                    startTime: moment(values.startTime.valueOf()).format(
                      'YYYY-MM-DD HH:mm:ss'
                    ),
                    endTime: moment(values.endTime.valueOf()).format(
                      'YYYY-MM-DD HH:mm:ss'
                    ),
                    coverUrl: values.coverUrl[0].response.data.filename,
                    bmTourProductDaysList:
                      values.type === '1'
                        ? this.state.everyDay
                        : bmTourProductDaysList
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
        );
      }
    });
  };
  handleChange = (value: any) => {
    const item = store.resource.basicProductsPage.records.find(
      item => item.id === value
    );
    this.props.form.setFieldsValue({
      title: item.name
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const dataChange = Object.assign(
      { startTime: this.props.form.getFieldValue('startTime') },
      { endTime: this.props.form.getFieldValue('endTime') },
      { type: this.props.form.getFieldValue('type') },
      { holiday: this.props.form.getFieldValue('holiday') },
      { weekend: this.props.form.getFieldValue('weekend') },
      { period: this.props.form.getFieldValue('period') }
    );
    const Products = store.resource.basicProductsPage;
    const isEdit = this.props.data !== undefined;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const tagPage = store.tag.tagPage;
    const singleInfo = store.tourisms.tourismSingle;
    let url = singleInfo.coverUrl;
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
        console.log(
          'TCL: CreateVideo -> render ->  url.split',
          url.split('com/')[1]
        );
        item.type = 'img/' + url.split('com/')[1].split('.')[1];
        item.originFileObj.uid = '16549861321684';
        item.originFileObj.url = url;
        item.response.data.filename = url;
        item.response.data.mimeType =
          'img/' + url.split('com/')[1].split('.')[1];
      }
    });
    return (
      <Card
        bordered={false}
        title={isEdit ? '编辑旅游产品' : '添加旅游产品'}
        className="CreateMito"
        loading={isEdit ? this.state.loading : false}
      >
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="基础产品"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('baseProductId', {
                  initialValue: isEdit ? singleInfo.baseProductId : undefined,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '基础产品'
                    }
                  ]
                })(
                  <Select
                    style={{ width: 300 }}
                    placeholder="选择基础产品"
                    onChange={this.handleChange}
                  >
                    {Products.records.map((item: any, index: number) => (
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
                label="产品名称"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('title', {
                  initialValue: isEdit ? singleInfo.title : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '产品名称'
                    }
                  ]
                })(<Input placeholder="请输入产品名称" />)}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="所属标签"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('tagId', {
                  initialValue: isEdit ? singleInfo.tagId : undefined,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '所属标签'
                    }
                  ]
                })(
                  <Select style={{ width: 300 }} placeholder="选择所属标签">
                    {tagPage.records.map((item: any, index: number) => (
                      <Option key={item.id} value={item.id}>
                        {item.title}
                      </Option>
                    ))}
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
                    onOk={this.ChangeStart}
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
                      required: true,
                      message: '下架时间'
                    }
                  ]
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    placeholder="下架时间"
                    onOk={this.ChangeEnd}
                  />
                )}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="提前关闭时间"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('howDays', {
                  initialValue: isEdit ? singleInfo.howDays : undefined,
                  rules: [
                    {
                      required: true,
                      message: '提前关闭时间'
                    }
                  ]
                })(
                  <InputNumber
                    style={{ width: 180 }}
                    placeholder="请输入提前关闭时间"
                    min={0}
                    max={100}
                    step={1}
                  />
                )}
                天
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label={
                  <span>
                    上传封面&nbsp;
                    <Tooltip title="只能上传一个封面！！！">
                      <Icon type="info-circle" />
                    </Tooltip>
                  </span>
                }
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('coverUrl', {
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
                label={
                  <span>
                    上传轮播&nbsp;
                    <Tooltip title="轮播视频加图片不超过9个！！！">
                      <Icon type="info-circle" />
                    </Tooltip>
                  </span>
                }
                {...formItemLayout}
                className="form-inline-item"
              >
                <div
                  style={{
                    marginLeft: '20px',
                    listStyle: 'none',
                    float: 'left'
                  }}
                >
                  <OssUpload
                    onChange={this.ChangeList}
                    type={'1'}
                    isShowUploadList={false}
                  />
                </div>
                {/* <div style={{ marginLeft: '20px', listStyle: 'none', float: "left" }}>
                  <OssUpload
                    onChange={this.ChangeVideo}
                    type={'2'}
                    isShowUploadList={false}
                    disabled={this.state.fileData.find(item => item.url.includes('video/admin'))}
                  />
                </div> */}
                <div
                  style={{
                    marginLeft: '20px',
                    listStyle: 'none',
                    float: 'left'
                  }}
                >
                  <Picture onChange={this.ChangePicture} type={'1'} />
                </div>
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="轮播图片"
                {...formItemLayout}
                className="form-inline-item"
              >
                <Table
                  columns={this.state.columns}
                  bordered={false}
                  dataSource={this.state.fileData.slice(-9)}
                  pagination={false}
                />
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="出团类型"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('type', {
                  initialValue: isEdit ? singleInfo.type : '1',
                  rules: [
                    {
                      required: true,
                      message: '出团类型'
                    }
                  ]
                })(
                  <Radio.Group onChange={this.clearPrice}>
                    <Radio value={'1'}>每日出团</Radio>
                    <Radio value={'2'}>周期出团</Radio>
                    <Radio value={'3'}>非周期出团</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>
            {this.props.form.getFieldValue('type') === '2' && (
              <Col xl={24} md={24} sm={24}>
                <FormItem
                  label="周期类型"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('period', {
                    initialValue: undefined,
                    rules: [
                      {
                        required: true,
                        message: '出团类型'
                      }
                    ]
                  })(
                    <Radio.Group onChange={this.changeWeek}>
                      <Radio value={1}>每周出团</Radio>
                      <Radio value={2}>每月出团</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
            )}
            {this.props.form.getFieldValue('type') !== '3' && (
              <Col xl={24} md={24} sm={24}>
                <FormItem
                  label="节假日照常发团"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('holiday', {
                    initialValue: undefined,
                    rules: [
                      {
                        required: true,
                        message: '节假日照常发团'
                      }
                    ]
                  })(
                    <Radio.Group>
                      <Radio value={1}>是</Radio>
                      <Radio value={2}>否</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
            )}
            {(this.props.form.getFieldValue('type') === '1' ||
              this.props.form.getFieldValue('period') === 2) && (
              <Col xl={24} md={24} sm={24}>
                <FormItem
                  label="周末照常发团"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('weekend', {
                    initialValue: undefined,
                    rules: [
                      {
                        required: true,
                        message: '周末照常发团'
                      }
                    ]
                  })(
                    <Radio.Group>
                      <Radio value={1}>是</Radio>
                      <Radio value={2}>否</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
            )}
          </Row>
        </Form>
        <Col xl={24} md={24} sm={24}>
          <FormItem
            label={'价格日历'}
            {...formItemLayout}
            className="form-inline-item"
          >
            <SetPrice
              data={isEdit ? singleInfo.bmTourProductDaysList : []}
              content={dataChange}
            />
          </FormItem>
        </Col>
        <Col xl={12} md={24} sm={24} offset={6}>
          <div className="submitButtons">
            <Button
              type="primary"
              htmlType="submit"
              onClick={this.handleSubmit}
            >
              确定
            </Button>
          </div>
        </Col>
      </Card>
    );
  }
}

export default Form.create<TourismProps>()(CreateTourism);

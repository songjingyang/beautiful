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
  Tree,
  Tag,
  Popconfirm
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
import './index.less';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const RadioButton = Radio.Button;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Products: any = [
  {
    name: '出行',
    type: 1
  },
  {
    name: '酒店',
    type: 2
  },
  {
    name: '城市',
    type: 3
  },
  {
    name: '景点',
    type: 4
  },
  {
    name: '餐厅',
    type: 5
  },
  {
    name: '文本',
    type: 6
  }
];
const { Dragger } = Upload;
const Number2Data: any = {
  '0': '零',
  '1': '一',
  '2': '二',
  '3': '三',
  '4': '四',
  '5': '五',
  '6': '六',
  '7': '七',
  '8': '八',
  '9': '九'
};
const columns: any = [
  // {
  //   title: '序号',
  //   dataIndex: 'sort',
  //   editable: false
  // },
  {
    title: '行程',
    dataIndex: 'day',
    editable: false,
    render: (text: string, record: any) => (
      <div>{'第' + Number2Data[text] + '天'}</div>
    )
  },
  {
    title: '插入资源类型',
    dataIndex: 'type',
    editable: true
  },
  {
    title: '出行方式(非必选)',
    dataIndex: 'tirpType',
    editable: true
  },
  {
    title: '资源内容',
    dataIndex: 'itemId',
    editable: true
  },
  {
    title: '操作',
    dataIndex: 'operation'
  }
];
interface HotelProps {
  form: FormComponentProps['form'];
  onClose: any;
  data: any;
}
interface State {
  status: boolean;
  days: number;
  sort: number;
  dataSource: any[];
  type: string;
  tMode: string;
}
@inject('resource')
@observer
class CreateBasicProducts extends Component<HotelProps, State> {
  constructor(props: HotelProps) {
    super(props);
    this.state = {
      status: true,
      sort: 1,
      days: 0,
      dataSource: [],
      type: '',
      tMode: ''
    };
  }
  componentDidMount() {
    this.props.data &&
      store.resource.getProductSingle({
        data: { id: this.props.data.id },
        callback: res => {
          if (res.code === 0) {
            const arr = res.data.baseProductDaysList.map(
              (item: any) => item.days
            );
            const arrSort = res.data.baseProductDaysList.map(
              (item: any) => item.sort
            );
            this.setState({
              dataSource: res.data.baseProductDaysList,
              days: Math.max(...arr),
              sort: Math.max(...arrSort) + 1
            });
          }
        }
      });
    store.resource.getTripModePage({
      data: {}
    });
    store.resource.getHotelPage({ data: {} });
    store.global.getCityList({ data: {} });
    store.resource.getScenicSpot({ data: {} });
    store.resource.getRestaurantPage({ data: {} });
  }
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.data
          ? store.resource.EditBasicProducts({
              data: {
                id: this.props.data.id,
                ...values,
                pdfUrl: values.pdfUrl[0].response.data.filename,
                baseProductDaysList: this.state.dataSource.map((item: any) => {
                  return {
                    ...item,
                    productId: this.props.data.id
                  };
                })
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
          : store.resource.CreateBasicProducts({
              data: {
                ...values,
                pdfUrl: values.pdfUrl[0].response.data.filename,
                baseProductDaysList: this.state.dataSource
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
  handleDay = () => {
    this.setState({
      days: this.state.days + 1
    });
  };
  handleChangeResouce = (item: any, value: any) => {
    item.type = value;
    this.setState({
      dataSource: this.state.dataSource,
      type: value
    });
  };
  handleChageTrip = (item: any, value: any) => {
    item.tirpType = value;
    this.setState({
      dataSource: this.state.dataSource,
      tMode: value
    });
  };
  handleChangeInfo = (item: any, value: any) => {
    item.type === 6
      ? (item.itemId = value.target.value)
      : (item.itemId = value);
    this.setState({
      dataSource: this.state.dataSource
    });
  };
  handleDelete = (value: any) => {
    this.setState({
      dataSource: this.state.dataSource.filter(item => {
        return item !== value;
      })
    });
  };
  handleAdd = (item: any) => {
    const newData = {
      productId: this.props.data !== undefined ? this.props.data.id : '',
      sort: this.state.sort,
      type: item.type,
      days: this.state.days,
      itemId: '',
      tirpType: 0
    };
    this.setState({
      dataSource: [...this.state.dataSource, newData],
      sort: this.state.sort + 1,
      type: item.type
    });
  };

  render() {
    console.log('this.state.sort', this.state.sort);

    const tripModePage = store.resource.tripModePage.records.map(
      (item: any, index: number) => {
        return { ...item, type: '1' };
      }
    );
    const hotelPage = store.resource.hotelPage.records.map(
      (item: any, index: number) => {
        return { ...item, type: '2' };
      }
    );
    const cityList = store.global.cityList.map((item: any, index: number) => {
      return { ...item, type: '3' };
    });
    const scenicPage = store.resource.scenicPage.records.map(
      (item: any, index: number) => {
        return { ...item, type: '4' };
      }
    );
    const restaurantPage = store.resource.restaurantPage.records.map(
      (item: any, index: number) => {
        return { ...item, type: '5' };
      }
    );
    let dataAll = [
      ...tripModePage,
      ...hotelPage,
      ...cityList,
      ...scenicPage,
      ...restaurantPage
    ];
    console.log('TCL: CreateBasicProducts -> render -> dataAll', dataAll);
    const { getFieldDecorator } = this.props.form;
    const CityList = store.global.cityList;
    const isEdit = this.props.data !== undefined;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const singleInfo = store.resource.productSingle;
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
    let url = singleInfo.pdfUrl;
    json.map((item: any, index: number) => {
      if (url) {
        item.name = url;
        item.uid = '16549861321684';
        item.url = url.split('com/')[1];
        item.type = 'video/' + url.split('com/')[1].split('.')[1];
        item.originFileObj.uid = '16549861321684';
        item.originFileObj.url = url.split('com/')[1];
        item.response.data.filename = url;
        item.response.data.mimeType =
          'video/' + url.split('com/')[1].split('.')[1];
      }
    });

    console.log('dataSource', this.state.dataSource);
    return (
      <Card bordered={false} title={isEdit ? '编辑基础产品' : '添加基础产品'}>
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="产品类型"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('type', {
                  initialValue: isEdit ? '' + singleInfo.type : undefined,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '产品类型'
                    }
                  ]
                })(
                  <Select style={{ width: 200 }} placeholder="请选择产品类型">
                    <Option value={'1'}>国内游</Option>
                    <Option value={'2'}>港澳游</Option>
                    <Option value={'3'}>境外游</Option>
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
                {getFieldDecorator('name', {
                  initialValue: isEdit ? singleInfo.name : '',
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
                label="副标题"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('copywriting', {
                  initialValue: isEdit ? singleInfo.copywriting : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '副标题'
                    }
                  ]
                })(<Input placeholder="请输入副标题" />)}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="行程天数"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('days', {
                  initialValue: isEdit ? singleInfo.days : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '行程天数'
                    }
                  ]
                })(<Input placeholder="请输入行程天数" />)}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="产品亮点"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('brightSpot', {
                  initialValue: isEdit ? singleInfo.brightSpot : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '产品亮点'
                    }
                  ]
                })(
                  <TextArea
                    placeholder="请输入产品亮点"
                    autoSize={{ minRows: 5 }}
                  />
                )}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="行程"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('trip', {
                  rules: [
                    {
                      required: this.state.dataSource ? false : true,
                      message: '行程'
                    }
                  ]
                })(
                  <div>
                    <div
                      style={{
                        marginBottom: 16,
                        marginRight: 50,
                        marginLeft: 10
                      }}
                    >
                      <Button
                        type="primary"
                        onClick={this.handleDay}
                        style={{ marginRight: 50 }}
                      >
                        添加行程
                      </Button>
                      {this.state.days ? (
                        <Tag color="#87d068">
                          {'第' + Number2Data[this.state.days] + '天'}
                        </Tag>
                      ) : null}
                    </div>
                    {Products.map((item: any, index: number) => (
                      <Button
                        type="primary"
                        disabled={this.state.days === 0 ? true : false}
                        key={item.id}
                        style={{ marginBottom: 16, marginLeft: 10 }}
                        onClick={() => this.handleAdd(item)}
                      >
                        {item.name}
                      </Button>
                    ))}
                    <table className={'tableSelf'}>
                      <thead>
                        <tr>
                          {columns.map((item: any) => {
                            return (
                              <th key={item.dataIndex} className={'thSelf'}>
                                {item.title}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.dataSource.map(item => {
                          return (
                            <tr key={item.id}>
                              {/* <td className={"thSelf"}>
                                {item.sort}
                              </td> */}
                              <td className={'thSelf'}>
                                {'第' + Number2Data[item.days] + '天'}
                              </td>
                              <td className={'thSelf'}>
                                <FormItem label="" className="form-inline-item">
                                  {getFieldDecorator(`type${item.sort}`, {
                                    initialValue: item.type,
                                    rules: [
                                      {
                                        required: true,
                                        // whitespace: true,
                                        message: '资源类型'
                                      }
                                    ]
                                  })(
                                    <Select
                                      placeholder="请选择资源类型"
                                      disabled
                                      onChange={value =>
                                        this.handleChangeResouce(item, value)
                                      }
                                    >
                                      {Products.map((item: any) => {
                                        return (
                                          <Option
                                            key={item.id}
                                            value={item.type}
                                          >
                                            {item.name}
                                          </Option>
                                        );
                                      })}
                                    </Select>
                                  )}
                                </FormItem>
                              </td>
                              <td className={'thSelf'}>
                                {this.props.form.getFieldValue(
                                  `type${item.sort}`
                                ) === 1 && (
                                  <FormItem
                                    label=""
                                    className="form-inline-item"
                                  >
                                    {getFieldDecorator(`tirpType${item.sort}`, {
                                      initialValue: isEdit
                                        ? item.tirpType === 0
                                          ? undefined
                                          : item.tirpType
                                        : undefined,
                                      rules: [
                                        {
                                          required: true,
                                          // whitespace: true,
                                          message: '资源类型'
                                        }
                                      ]
                                    })(
                                      <Select
                                        placeholder="请选择内容"
                                        style={{ width: 120 }}
                                        onChange={value =>
                                          this.handleChageTrip(item, value)
                                        }
                                      >
                                        <Option value={1}>航空</Option>
                                        <Option value={2}>铁路</Option>
                                        <Option value={3}>包车</Option>
                                      </Select>
                                    )}
                                  </FormItem>
                                )}
                              </td>
                              {this.props.form.getFieldValue(
                                `type${item.sort}`
                              ) === 6 ? (
                                <td className={'thSelf'}>
                                  <FormItem
                                    label=""
                                    className="form-inline-item"
                                  >
                                    {getFieldDecorator(`itemId${item.sort}`, {
                                      initialValue: isEdit
                                        ? item.itemId
                                        : undefined,
                                      rules: [
                                        {
                                          required: true,
                                          whitespace: true,
                                          message: '资源内容'
                                        }
                                      ]
                                    })(
                                      <TextArea
                                        placeholder="请输入资源内容"
                                        onChange={value =>
                                          this.handleChangeInfo(item, value)
                                        }
                                      />
                                    )}
                                  </FormItem>
                                </td>
                              ) : (
                                <td className={'thSelf'}>
                                  <FormItem
                                    label=""
                                    className="form-inline-item"
                                  >
                                    {getFieldDecorator(`itemId${item.sort}`, {
                                      initialValue: isEdit
                                        ? item.itemId
                                        : undefined,
                                      rules: [
                                        {
                                          required: true,
                                          whitespace: true,
                                          message: '资源内容'
                                        }
                                      ]
                                    })(
                                      <Select
                                        onChange={value =>
                                          this.handleChangeInfo(item, value)
                                        }
                                        placeholder="请选择资源内容"
                                      >
                                        {dataAll.map((item_new: any) => {
                                          return this.props.form.getFieldValue(
                                            `type${item.sort}`
                                          ) === 1
                                            ? this.props.form.getFieldValue(
                                                `tirpType${item.sort}`
                                              ) +
                                                '' ===
                                                item_new.tirpMode && (
                                                <Option
                                                  key={item_new.id}
                                                  value={item_new.id}
                                                >
                                                  {item_new.number}
                                                </Option>
                                              )
                                            : this.props.form.getFieldValue(
                                                `type${item.sort}`
                                              ) +
                                                '' ===
                                                item_new.type && (
                                                <Option
                                                  key={item_new.id}
                                                  value={item_new.id}
                                                >
                                                  {item_new.name}
                                                </Option>
                                              );
                                        })}
                                      </Select>
                                    )}
                                  </FormItem>
                                </td>
                              )}
                              <td className={'thSelf'}>
                                <Popconfirm
                                  title="确定删除吗?"
                                  onConfirm={() => this.handleDelete(item)}
                                  okText="确认"
                                  cancelText="取消"
                                >
                                  <a>删除</a>
                                </Popconfirm>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label={
                  <span>
                    上传PDF&nbsp;
                    <Tooltip title="只能上传一个PDF！！！">
                      <Icon type="info-circle" />
                    </Tooltip>
                  </span>
                }
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('pdfUrl', {
                  initialValue: isEdit ? json : [],
                  rules: [
                    {
                      required: true,
                      // whitespace: true,
                      message: '上传PDF'
                    }
                  ]
                })(
                  <OssUpload
                    type={'3'}
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

export default Form.create<HotelProps>()(CreateBasicProducts);

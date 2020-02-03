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
  Drawer,
  List,
  Avatar
} from 'antd';
import moment from 'moment';
import urlMaps from '../../common/urlMaps';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
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
import DragSortingTable from '../../components/DragSorting';
import { StandardTableColumnProps } from '../Table';
import Relation from '../../components/Relation';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const { Dragger } = Upload;
interface CityStrCreateCityStrategyProps {
  form: FormComponentProps['form'];
  onClose: any;
  data: any;
}
interface State {
  status: boolean;
  fileData: any[];
  everyDay: any[];
  ButtonInfo: any;
  visible: boolean;
  ButtonType: number;
  buttonMaps: any;
  DrawerInfo: any;
  selectedRowKeys: any[];
  selectedRows: any[];
  inputValue: string;
  selectInfo: any[];
  columnsTop: StandardTableColumnProps[];
  columnsPutIn: StandardTableColumnProps[];
  loading: boolean;
  type: {
    [index: string]: string;
  };
}
@inject('resource', 'tag', 'strategy')
@observer
class CreateCityStrategy extends Component<
CityStrCreateCityStrategyProps,
State
> {
  constructor(props: CityStrCreateCityStrategyProps) {
    super(props);
    this.state = {
      loading: true,
      status: true,
      ButtonType: 0,
      visible: false,
      fileData: [],
      inputValue: '',
      selectedRowKeys: [],
      selectedRows: [],
      selectInfo: [],
      DrawerInfo: [],
      type: {
        2: '酒店',
        3: '城市',
        4: '景点',
        5: '餐厅'
      },
      buttonMaps: {
        0: '无',
        1: '插入文字',
        2: '插入图片',
        3: '插入视频'
      },
      ButtonInfo: [
        { type: 1, name: '插入文字' },
        { type: 2, name: '插入图片' },
        { type: 3, name: '插入视频' }
      ],
      everyDay: [],
      columnsTop: [
        {
          title: '资源',
          dataIndex: 'url',
          render: (text: string, record: any) => (
            <div>
              {record.format === 1 && <PreviewImg alt="url" src={text} />}
              {record.format === 2 && (
                <video style={{ width: 200 }} src={text} controls />
              )}
            </div>
          )
        },
        {
          title: '资源宽度',
          dataIndex: 'wide'
        },
        {
          title: '资源高度',
          dataIndex: 'high'
        },
        {
          title: '操作',
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
      ],
      columnsPutIn: [
        {
          title: '资源',
          dataIndex: 'url',
          render: (text: string, record: any) => (
            <div>
              {this.state.ButtonType === 2 && (
                <PreviewImg alt="url" src={text} />
              )}
              {this.state.ButtonType === 3 && (
                <video style={{ width: 100 }} src={text} controls />
              )}
            </div>
          )
        },
        {
          title: '分类',
          dataIndex: 'type',
          render: (text: string, record: any) => (
            <span>{this.state.type[text]}</span>
          )
        },
        {
          title: '城市',
          dataIndex: 'city'
        },
        {
          title: '景点/酒店/餐厅',
          dataIndex: 'itemId'
        }
      ]
    };
  }
  componentDidMount() {
    store.global.getCityList({
      data: {}
    });
    this.props.data &&
      store.strategy.getCitySingle({
        data: {
          id: this.props.data.id
        },
        callback: res => {
          console.log(
            'TCL: CreateCityStrategy -> componentDidMount -> res',
            res
          );
          if (res.code === 0) {
            this.setState({
              fileData: res.data.bmMaterialList,
              DrawerInfo: res.data.strategyCityIntroduceList,
              loading: false
            });
          }
        }
      });
  }

  ChangeList = (fileList: any) => {
    debugger;
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
            type: 1
          };
        })
      ]
    });
  };
  ChangeVideo = (fileList: any) => {
    const dataArray = fileList.map((item: any) => item.response.data);
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
            type: 1
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
            type: 1,
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
  showDrawer = (item: any) => {
    if (item.type === 2) {
      store.resource.getPicturePage({
        data: {
          city: this.props.form.getFieldValue('city'),
          current: 1,
          size: 10000
        }
      });
    } else if (item.type === 3) {
      store.resource.getVideoPage({
        data: {
          city: this.props.form.getFieldValue('city'),
          current: 1,
          size: 10000
        }
      });
    }
    this.setState({
      visible: true,
      ButtonType: item.type,
      selectedRowKeys: [],
      selectedRows: []
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };
  onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
    this.setState({
      selectedRowKeys: selectedRowKeys,
      selectedRows: selectedRows
    });
  };
  handleInput = (e: any) => {
    this.setState({
      inputValue: e.target.value
    });
  };
  handleChange = () => {
    this.state.ButtonType === 1 &&
      this.setState(
        {
          DrawerInfo: [
            ...this.state.DrawerInfo,
            {
              content: this.state.inputValue,
              type: this.state.ButtonType,
              itemId: ''
            }
          ],
          visible: false
        },
        () => {
          this.setState({
            inputValue: '',
            DrawerInfo: this.state.DrawerInfo.map(
              (item: any, index: number) => {
                return {
                  ...item,
                  sort: index + 1
                };
              }
            )
          });
        }
      );
    this.state.ButtonType !== 1 &&
      this.setState(
        {
          DrawerInfo: [
            ...this.state.DrawerInfo,
            ...this.state.selectedRows.map((item: any) => {
              return {
                type: this.state.ButtonType,
                itemId: item.id,
                content: item.url
              };
            })
          ],
          visible: false
        },
        () => {
          this.setState({
            DrawerInfo: this.state.DrawerInfo.map(
              (item: any, index: number) => {
                return {
                  ...item,
                  sort: index + 1
                };
              }
            )
          });
        }
      );
  };
  DeleteInfo = (value: any) => {
    this.forceUpdate();
    console.log('TCL: Relation -> DeleteInfo -> value', value);
    this.setState(
      {
        selectInfo: this.props.form
          .getFieldValue('bmTourProductDaysList')
          .filter((item: any) => {
            return item !== value;
          })
      },
      () => {
        this.props.form.setFieldsValue({
          bmTourProductDaysList: this.state.selectInfo
        });
      }
    );
  };
  handleChangeTable = (value: any) => {
    this.setState({
      DrawerInfo: value
    });
  };
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('TCL: CreateCityStrategy -> handleSubmit -> values', values);
      if (!err) {
        this.props.data
          ? store.strategy.EditCityStraegy({
            data: {
              id: this.props.data.id,
              ...values,
              strategyCityIntroduceList: this.state.DrawerInfo,
              bmMaterialList: this.state.fileData.slice(-9),
              imgUrl: values.imgUrl[0].response.data.filename,
              information: values.information.toHTML()
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
          : store.strategy.AddCityStraegy({
            data: {
              ...values,
              strategyCityIntroduceList: this.state.DrawerInfo,
              bmMaterialList: this.state.fileData.slice(-9),
              imgUrl: values.imgUrl[0].response.data.filename,
              information: values.information.toHTML()
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
    const selectedRowKeys = this.state.selectedRowKeys;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const { getFieldDecorator } = this.props.form;
    const isEdit = this.props.data !== undefined;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const singleInfo = store.strategy.citySingle;
    let url = singleInfo.imgUrl;
    const CityList = store.global.cityList;
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
        console.log('TCL: CreateCityStrategy -> render -> url', url);
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
    const imgInfo = store.resource.picturePage;
    const videoInfo = store.resource.videoPage;
    const hasSelected = this.state.selectedRowKeys.length > 0;
    console.log('this.state.=?', this.state.fileData);
    return (
      <Card
        bordered={false}
        title={isEdit ? '编辑城市攻略' : '添加城市攻略'}
        loading={this.props.data ? this.state.loading : false}
        className="CreateMito"
      >
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="攻略名称"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('name', {
                  initialValue: isEdit ? singleInfo.name : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '攻略名称'
                    }
                  ]
                })(
                  <Input style={{ width: 200 }} placeholder="请输入攻略名称" />
                )}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="城市"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('city', {
                  initialValue: isEdit ? singleInfo.city : undefined,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '城市'
                    }
                  ]
                })(
                  <Select style={{ width: 200 }} placeholder="请选择搜索城市">
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
                {getFieldDecorator('imgUrl', {
                  initialValue: isEdit ? json_img : [],
                  rules: [
                    {
                      required: true,
                      message: '选择图片'
                    }
                  ]
                })(<OssUpload type={'1'} isShowUploadList={true} />)}
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
                {/* <div
                  style={{
                    marginLeft: '20px',
                    listStyle: 'none',
                    float: 'left'
                  }}
                >
                  <OssUpload
                    onChange={this.ChangeVideo}
                    type={'2'}
                    isShowUploadList={false}
                    uploadNumber={1}
                    disabled={this.state.fileData.find(item =>
                      item.url.includes('video/admin')
                    )}
                  />
                </div> */}
                <div
                  style={{
                    marginLeft: '20px',
                    listStyle: 'none',
                    float: 'left'
                  }}
                >
                  <Picture
                    city={this.props.form.getFieldValue('city')}
                    onChange={this.ChangePicture}
                    type={'1'}
                  />
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
                  columns={this.state.columnsTop}
                  bordered={false}
                  dataSource={this.state.fileData.slice(-9)}
                  pagination={false}
                />
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem {...formItemLayout} label="便捷信息">
                {getFieldDecorator('information', {
                  initialValue: isEdit
                    ? BraftEditor.createEditorState(singleInfo.information)
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
              <FormItem {...formItemLayout} label="城市介绍">
                {this.state.ButtonInfo.map((item: any) => (
                  <Button
                    key={item.type}
                    style={{ marginRight: 10 }}
                    onClick={() => this.showDrawer(item)}
                  >
                    {item.name}
                  </Button>
                ))}
                <Drawer
                  title={this.state.buttonMaps[this.state.ButtonType]}
                  placement="right"
                  closable={false}
                  onClose={this.onClose}
                  visible={this.state.visible}
                  width={700}
                >
                  {this.state.ButtonType !== 1 && (
                    <div>
                      <Button
                        type="primary"
                        onClick={this.handleChange}
                        disabled={!hasSelected}
                      >
                        {this.state.buttonMaps[this.state.ButtonType]}
                      </Button>
                      <Table
                        columns={this.state.columnsPutIn}
                        rowKey={'id' || 'key'}
                        dataSource={
                          this.state.ButtonType === 2
                            ? imgInfo.records
                            : this.state.ButtonType === 3
                              ? videoInfo.records
                              : []
                        }
                        pagination={false}
                        rowSelection={rowSelection}
                      />
                    </div>
                  )}
                  {this.state.ButtonType === 1 && (
                    <Row
                      gutter={{ md: 8, lg: 24, xl: 48 }}
                      style={{ marginTop: '20px' }}
                    >
                      <Col xl={24} md={24} sm={24}>
                        <FormItem
                          label="文字"
                          {...formItemLayout}
                          className="form-inline-item"
                        >
                          <TextArea
                            placeholder="文字"
                            value={this.state.inputValue}
                            onChange={this.handleInput}
                            autoSize={{ minRows: 5 }}
                          />
                        </FormItem>
                      </Col>
                      <Col
                        xl={24}
                        md={24}
                        sm={24}
                        style={{ marginLeft: 170, marginTop: 50 }}
                      >
                        <Button type="primary" onClick={this.handleChange}>
                          {this.state.buttonMaps[this.state.ButtonType]}
                        </Button>
                      </Col>
                    </Row>
                  )}
                </Drawer>
                <DragSortingTable
                  onChange={this.handleChangeTable}
                  data={this.state.DrawerInfo}
                />
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label={
                  <span>
                    关联旅游产品&nbsp;
                    <Tooltip title="仅可关联一个旅游产品">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                }
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('bmTourProductDaysList', {
                  initialValue: isEdit ? singleInfo.bmTourProductDaysList : [],
                  rules: [
                    {
                      required: true,
                      message: '关联旅游产品'
                    }
                  ]
                })(
                  <Relation
                    type={1}
                  // onChange={this.ChangeSelect}
                  />
                )}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label={`已选中旅游产品`}
                {...formItemLayout}
                className="form-inline-item"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={this.props.form.getFieldValue(
                    'bmTourProductDaysList'
                  )}
                  renderItem={(item: any) => (
                    <List.Item
                      actions={[
                        <a
                          key="list-loadmore-edit"
                          onClick={() => this.DeleteInfo(item)}
                        >
                          删除
                        </a>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={item.coverUrl} />}
                        title={<span>{item.title}</span>}
                        description={
                          <div>
                            <span>{item.count}人出游</span>{' '}
                            <span style={{ color: '#d00' }}>
                              ￥{item.price}起
                            </span>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
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

export default Form.create<CityStrCreateCityStrategyProps>()(
  CreateCityStrategy
);

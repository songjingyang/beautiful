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
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { FormComponentProps } from 'antd/es/form';
import NewBraft from '../../components/BraftEditor';
import store from '../../models/index';
import BraftEditor, { EditorState } from 'braft-editor';
import PreviewImg from '../../components/PreviewImg';
// 引入编辑器样式
import OssUpload from '../../components/Upload';
import { StandardTableColumnProps } from '../Table';
import Picture from '../../components/Picture';
import Relation from '../../components/Relation';
// import './index.less'
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const { Dragger } = Upload;
interface Props {
  form: FormComponentProps['form'];
  onClose: any;
  data: any;
}
interface State {
  status: boolean;
  columns: StandardTableColumnProps[];
  fileData: any[];
  everyDay: any[];
  selectInfo: any[];
  // dataChange: any
}
@inject('resource', 'global')
@observer
class CreateVideo extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      status: true,
      fileData: [],
      everyDay: [],
      selectInfo: [],
      // dataChange: {},
      columns: [
        {
          title: '视频',
          dataIndex: 'url',
          render: (text: string, record: any) => (
            <video style={{ width: 200 }} src={text} controls />
          )
        },
        {
          title: '视频宽度',
          dataIndex: 'wide'
        },
        {
          title: '视频高度',
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

  DeleteSingle = (record: any) => {
    this.setState({
      fileData: this.state.fileData.filter(item => {
        return item !== record;
      })
    });
  };
  componentDidMount() {
    store.global.getCityList({
      data: {}
    });
    this.props.data &&
      store.strategy.getVideoSingle({
        data: {
          id: this.props.data.id
        },
        callback: res => {
          console.log('TCL: CreateVideo -> componentDidMount -> res', res);
          if (res.code === 0) {
            this.setState({
              fileData: res.data.bmMaterialList
            });
          }
        }
      });
  }
  ChangeList = (fileList: any) => {
    const dataArray = fileList.map((item: any) => item.response.data);
    this.setState({
      fileData: [
        ...this.state.fileData,
        ...dataArray.map((item: any, index: number) => {
          return {
            wide: item.width,
            high: item.height,
            url: item.filename,
            format: 1,
            limits: 1,
            type: 3
          };
        })
      ]
    });
  };
  ChangeVideo = (fileList: any) => {
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
  DeleteInfo = (value: any) => {
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
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.data
          ? store.strategy.EditVideoStraegy({
              data: {
                id: this.props.data.id,
                ...values,
                type: 3,
                bmMaterialList: this.state.fileData.slice(-1)
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
          : store.strategy.CreateVideoStraegy({
              data: {
                ...values,
                type: 3,
                bmMaterialList: this.state.fileData.slice(-1)
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
    const CityList = store.global.cityList;
    const info = store.strategy.videoSingle;
    return (
      <Card
        bordered={false}
        title={isEdit ? '编辑视频攻略' : '添加视频攻略'}
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
                {getFieldDecorator('title', {
                  initialValue: isEdit ? info.title : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '视频名称'
                    }
                  ]
                })(<Input placeholder="请输入视频名称" />)}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="视频说明"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('content', {
                  initialValue: isEdit ? info.content : '',
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '视频说明'
                    }
                  ]
                })(
                  <TextArea
                    placeholder="请输入视频说明"
                    autoSize={{ minRows: 5 }}
                  />
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
                  initialValue: isEdit ? info.city : undefined,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '城市'
                    }
                  ]
                })(
                  <Select style={{ width: 200 }} placeholder="请选择城市">
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
                    上传视频&nbsp;
                    <Tooltip title="只能上传一个视频！！！">
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
                    type={'2'}
                    isShowUploadList={false}
                    uploadNumber={1}
                  />
                </div>
                <div
                  style={{
                    marginLeft: '20px',
                    listStyle: 'none',
                    float: 'left'
                  }}
                >
                  <Picture
                    city={this.props.form.getFieldValue('city')}
                    onChange={this.ChangeVideo}
                    type={'2'}
                  />
                </div>
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="视频"
                {...formItemLayout}
                className="form-inline-item"
              >
                <Table
                  columns={this.state.columns}
                  bordered={false}
                  dataSource={this.state.fileData.slice(-1)}
                  pagination={false}
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
                  initialValue: isEdit ? info.bmTourProductDaysList : [],
                  rules: [
                    {
                      required: true,
                      message: '关联旅游产品'
                    }
                  ]
                })(
                  <Relation
                    type={3}
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
          </Row>
        </Form>
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

export default Form.create<Props>()(CreateVideo);

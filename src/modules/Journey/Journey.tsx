import React from 'react';
import {
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Button,
  Upload,
  Icon,
  Rate,
  Tooltip,
  Input,
  Table,
  Card,
  Divider,
  DatePicker,
  Row,
  Col,
  Modal,
  message,
  Popconfirm,
  Alert,
  BackTop
} from 'antd';
import {
  StandardTableColumnProps,
  TableListParams,
  TableListData,
  TableListPagination,
  TableListItem
} from '../Table';
import { ColumnProps, TableRowSelection, TableProps } from 'antd/es/table';
import { SorterResult } from 'antd/es/table';
import { FormComponentProps } from 'antd/es/form';
import { inject, observer } from 'mobx-react';
import CommentPage from './Comment';
import PreviewImg from '../../components/PreviewImg';
import Travels from '../../models/Travels';
import Products from './Products';
import CreatePicture from './CreatePicture';
import AllowPass from './AllowPass';
import RelationJourney from './RelationJourney';
const FormItem = Form.Item;
const Option = Select.Option;
interface Props {
  form: FormComponentProps['form'];
  travels: Travels;
}
interface State {
  columns: StandardTableColumnProps[];
  loading: boolean;
  currItem: any;
  pagination: TableListPagination;
  products: any;
  showProducts: boolean;
  showComment: boolean;
  comment: any;
  stateMaps: any;
  shelfMaps: any;
  showPicture: boolean;
  pictureData: any;
  recommendMaps: any;
  RelationData: any;
  isRelation: boolean;
  isAllowPass: boolean;
  AllowData: any;
}
@inject('travels')
@observer
class Journey extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currItem: {},
      RelationData: {},
      isRelation: false,
      isAllowPass: false,
      AllowData: {},
      showProducts: false,
      showComment: false,
      showPicture: false,
      pictureData: {},
      comment: {},
      products: {},
      stateMaps: {
        0: '未审核',
        1: '审核通过',
        2: '审核未通过'
      },
      shelfMaps: {
        1: '上架',
        2: '下架'
      },
      recommendMaps: {
        0: '不推荐',
        1: '推荐'
      },
      pagination: {
        total: 20,
        pageSize: 20,
        current: 1
      },
      loading: true,
      columns: [
        {
          title: '标题',
          dataIndex: 'title'
        },
        {
          title: '上传用户',
          dataIndex: 'nickName'
        },
        {
          title: '资源',
          dataIndex: 'materialCount',
          render: (text: string, record: any) => (
            <span>
              {text + '个'}
              <a
                href="javascript:void(0);"
                onClick={() => this.CreatePicture(record)}
              >
                查看
              </a>
            </span>
          )
        },
        {
          title: '城市',
          dataIndex: 'city'
        },
        {
          title: '关联旅游产品',
          dataIndex: 'productCount',
          render: (text: string, record: any) => (
            <span>
              {text + '个'}
              <a
                href="javascript:void(0);"
                onClick={() => this.CreateProducts(record)}
              >
                查看
              </a>
            </span>
          )
        },
        {
          title: '用户评论',
          dataIndex: 'composeCount',
          render: (text: string, record: any) => (
            <span>
              {text + '条'}
              <a
                href="javascript:void(0);"
                onClick={() => this.CreateComment(record)}
              >
                查看
              </a>
            </span>
          )
        },
        {
          title: '推荐',
          dataIndex: 'recommend',
          render: (text: string, record: any) => (
            <span>{this.state.recommendMaps[text]}</span>
          )
        },
        {
          title: '审核状态',
          dataIndex: 'state',
          render: (text: number, record: any) => (
            <span>{this.state.stateMaps[text]}</span>
          )
        },
        {
          title: '状态',
          dataIndex: 'shelf',
          render: (text: string, record: any) => (
            <span>{this.state.shelfMaps[text]}</span>
          )
        },
        {
          title: '操作',
          dataIndex: 'play',
          render: (text: string, record: any) => (
            <span>
              <a
                href="javascript:void(0);"
                onClick={() => this.Relation(record)}
              >
                关联旅游产品
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title={`设置为热门推荐？`}
                icon={
                  <Icon type="question-circle-o" style={{ color: 'red' }} />
                }
                okText="确认"
                cancelText="取消"
                onConfirm={() =>
                  this.SetRecommend(record, record.recommend === 0 ? 1 : 0)
                }
              >
                <a href="#" onClick={(e) => { e.preventDefault() }}>
                  {record.recommend === 0 ? '设为推荐' : '取消推荐'}
                </a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title={`设置上/下架？`}
                icon={
                  <Icon type="question-circle-o" style={{ color: 'red' }} />
                }
                okText="确认"
                cancelText="取消"
                onConfirm={() => this.isUp(record, record.shelf === 2 ? 1 : 2)}
              >
                <a href="#" onClick={(e) => { e.preventDefault() }}>
                  {record.shelf === 2 ? '上架' : '下架'}
                </a>
              </Popconfirm>
              <Divider type="vertical" />
              <a
                href="javascript:void(0);"
                onClick={() => this.AllowPass(record)}
              >
                审核
              </a>
            </span>
          )
        }
      ]
    };
  }
  componentDidMount() {
    this.getJourneyPage();
  }
  getJourneyPage = (params: any = {}) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let payload = {
          ...values
        };
        if (!params.current) {
          params.current = 1;
        }
        // if (params.current === 1) {
        //   params.ts = new Date().valueOf();
        // }
        // else {
        //   params.ts = this.props.message.messagePage.ts;
        // }
        if (!params.size) {
          params.size = 20;
        }
        if (payload.timeRange) {
          if (payload.timeRange.length !== 0) {
            payload.start_at = parseInt(payload.timeRange[0].valueOf());
            payload.end_at = parseInt(payload.timeRange[1].valueOf());
          } else {
            payload.start_at = 0;
            payload.end_at = 0;
          }
        }
        payload = {
          ...payload,
          ...params
        };
        this.props.travels.getTravelsPage({
          data: {
            ...payload
          },

          callback: res => {
            if (res.code === 0) {
              this.setState({
                loading: false
              });
            }
          }
        });
      } else {
        console.log('getHotelPage error');
      }
    });
  };

  SetRecommend = (record: any, state: number) => {
    this.props.travels.EditTravelstravelsCommend({
      data: {
        id: record.id,
        recommend: state
      },
      callback: res => {
        if (res.code === 0) {
          message.success(res.msg || '操作成功');
          this.getJourneyPage();
        } else {
          message.error(res.msg || '操作失败');
        }
      }
    });
  };
  isUp = (record: any, state: number) => {
    this.props.travels.EditTravelsupOrDown({
      data: {
        id: record.id,
        shelf: state
      },
      callback: res => {
        if (res.code === 0) {
          message.success(res.msg || '操作成功');
          this.getJourneyPage();
        } else {
          message.error(res.msg || '操作失败');
        }
      }
    });
  };
  Relation = (item?: any) => {
    this.isRelation(true);
    this.setState({
      RelationData: item
    });
  };
  isRelation = (bool: boolean) => {
    this.setState({
      isRelation: bool
    });
  };
  AllowPass = (item?: any) => {
    this.isAllowPass(true);
    this.setState({
      AllowData: item
    });
  };
  isAllowPass = (bool: boolean) => {
    this.setState({
      isAllowPass: bool
    });
  };

  CreateComment = (item?: any) => {
    this.isCreateComment(true);
    this.setState({
      comment: item
    });
  };
  isCreateComment = (bool: boolean) => {
    this.setState({
      showComment: bool
    });
  };
  CreatePicture = (item?: any) => {
    this.isCreatePicture(true);
    this.setState({
      pictureData: item
    });
  };
  isCreatePicture = (bool: boolean) => {
    this.setState({
      showPicture: bool
    });
  };

  CreateProducts = (item?: any) => {
    this.isCreateProducts(true);
    this.setState({
      products: item
    });
  };
  isCreateProducts = (bool: boolean) => {
    this.setState({
      showProducts: bool
    });
  };
  PropsInfo = (bool: boolean) => {
    this.isCreateProducts(false);
    this.isCreateComment(false);
    this.isCreatePicture(false);
    this.isRelation(false);
    this.isAllowPass(false);
  };
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getJourneyPage(values);
      }
    });
  };
  handleTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>
  ) => {
    const pager = {
      ...this.state.pagination
    };
    pager.current = pagination.current || 1;
    this.setState({
      pagination: pager
    });
    this.getJourneyPage({
      size: pagination.pageSize,
      current: pagination.current
    });
    window.scroll(0, 0);
  };
  render() {
    const info = this.props.travels.travelsPage;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    return (
      <Card title="游记管理" bordered={false} loading={this.state.loading}>
        {this.state.isAllowPass && (
          <Modal
            visible={this.state.isAllowPass}
            width={1100}
            onCancel={() => this.isAllowPass(false)}
            footer={null}
          >
            <AllowPass
              data={this.state.AllowData}
              onClose={() => {
                this.PropsInfo(false);
                this.getJourneyPage({
                  size: this.state.pagination.pageSize,
                  current: this.state.pagination.current
                });
              }}
            />
          </Modal>
        )}
        {this.state.showComment && (
          <Modal
            visible={this.state.showComment}
            width={1100}
            onCancel={() => this.isCreateComment(false)}
            footer={null}
          >
            <CommentPage
              data={this.state.comment}
              onClose={() => {
                this.PropsInfo(false);
                this.getJourneyPage({
                  size: this.state.pagination.pageSize,
                  current: this.state.pagination.current
                });
              }}
            />
          </Modal>
        )}

        {this.state.showProducts && (
          <Modal
            visible={this.state.showProducts}
            width={1100}
            onCancel={() => this.isCreateProducts(false)}
            footer={null}
          >
            <Products
              data={this.state.products}
              onClose={() => {
                this.PropsInfo(false);
                this.getJourneyPage({
                  size: this.state.pagination.pageSize,
                  current: this.state.pagination.current
                });
              }}
            />
          </Modal>
        )}
        {this.state.isRelation && (
          <Modal
            visible={this.state.isRelation}
            width={1100}
            onCancel={() => this.isRelation(false)}
            footer={null}
          >
            <RelationJourney
              data={this.state.RelationData}
              onClose={() => {
                this.PropsInfo(false);
                this.getJourneyPage({
                  size: this.state.pagination.pageSize,
                  current: this.state.pagination.current
                });
              }}
            />
          </Modal>
        )}

        {this.state.showPicture && (
          <Modal
            visible={this.state.showPicture}
            width={1100}
            onCancel={() => this.isCreatePicture(false)}
            footer={null}
          >
            <CreatePicture
              data={this.state.pictureData}
              onClose={() => {
                this.PropsInfo(false);
                this.getJourneyPage({
                  size: this.state.pagination.pageSize,
                  current: this.state.pagination.current
                });
              }}
            />
          </Modal>
        )}
        <div className="tableList">
          <BackTop className="ant-back-top-inner" />
          <Form onSubmit={this.handleSubmit}>
            <Row
              gutter={{ md: 8, lg: 24, xl: 48 }}
              style={{ marginTop: '20px' }}
            >
              <Col xl={10} md={24} sm={24}>
                <FormItem
                  label="标题"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('title')(<Input placeholder="标题" />)}
                </FormItem>
              </Col>
              <Col xl={10} md={24} sm={24}>
                <FormItem
                  label="上下架状态"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('shelf')(
                    <Select
                      style={{ width: 200 }}
                      placeholder="请选择上下架状态"
                    >
                      <Option key={1} value={1}>
                        上架
                      </Option>
                      <Option key={2} value={2}>
                        下架
                      </Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col xl={10} md={24} sm={24}>
                <FormItem
                  label="审核状态"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('state')(
                    <Select style={{ width: 200 }} placeholder="请选择审核状态">
                      <Option key={0} value={0}>
                        未审核
                      </Option>
                      <Option key={1} value={1}>
                        通过
                      </Option>
                      <Option key={2} value={2}>
                        未通过
                      </Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col
                xl={10}
                md={24}
                sm={24}
                offset={2}
                style={{ marginBottom: '10px' }}
              >
                <div className="submitButtons">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="listsearch"
                  >
                    查询
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
          <Col span={24}>
            <Table
              columns={this.state.columns}
              rowKey={'id' || 'key'}
              dataSource={info.records}
              pagination={{
                ...this.state.pagination,
                total: info.total,
                current: info.current,
                pageSize: info.size,
                showQuickJumper: true
                // hideOnSinglePage: true
              }}
              onChange={this.handleTableChange}
            />
          </Col>
        </div>
      </Card>
    );
  }
}
export default Form.create<Props>()(Journey);

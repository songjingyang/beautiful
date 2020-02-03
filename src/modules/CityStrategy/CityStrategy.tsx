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
import { ColumnProps, TableRowSelection, TableProps } from 'antd/es/table';
import { SorterResult } from 'antd/es/table';
import { FormComponentProps } from 'antd/es/form';
import Strategy from '../../models/Strategy';
import Global from '../../models/Global';
import Products from './Products';
import CreateCityStrategy from './CreateCityStrategy';
import CommentPage from './Comment';
import {
  StandardTableColumnProps,
  TableListParams,
  TableListData,
  TableListPagination,
  TableListItem
} from '../Table';
import { inject, observer } from 'mobx-react';
const FormItem = Form.Item;
const Option = Select.Option;
interface CityStrategyProps {
  form: FormComponentProps['form'];
  strategy: Strategy;
  global: Global;
}
interface CityStrategyState {
  columns: StandardTableColumnProps[];
  loading: boolean;
  visible: boolean;
  currItem: any;
  products: any;
  showProducts: boolean;
  pagination: TableListPagination;
  SeeItinerary: boolean;
  searchData: any;
  baseType: any;
  recommendMaps: any;
  statusMaps: any;
  showComment: boolean;
  comment: any;
}
@inject('strategy', 'global')
@observer
class CityStrategyPage extends React.Component<
CityStrategyProps,
CityStrategyState
> {
  constructor(props: CityStrategyProps) {
    super(props);
    this.state = {
      loading: true,
      visible: false,
      showProducts: false,
      showComment: false,
      baseType: {
        '1': '国内游',
        '2': '港澳游',
        '3': '境外游'
      },
      statusMaps: {
        1: '上架',
        2: '下架'
      },
      recommendMaps: {
        0: '不推荐',
        1: '推荐'
      },
      currItem: {},
      products: {},
      comment: {},
      SeeItinerary: false,
      searchData: {},
      pagination: {
        total: 20,
        pageSize: 20,
        current: 1
      },
      columns: [
        {
          title: '攻略名称',
          dataIndex: 'name'
        },
        {
          title: '城市',
          dataIndex: 'city'
        },
        {
          title: '关联旅游产品',
          dataIndex: 'copywriting',
          render: (text: string, record: any) => (
            <span>
              {record.bmTourProductDaysList.length + '个'}
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
          title: '热门推荐',
          dataIndex: 'recommend',
          render: (text: number, record: any) => (
            <span>{this.state.recommendMaps[text]}</span>
          )
        },
        {
          title: '状态',
          dataIndex: 'state',
          render: (text: string, record: any) => (
            <span>{this.state.statusMaps[text]}</span>
          )
        },
        {
          title: '操作',
          dataIndex: 'play',
          render: (text: string, record: any) => (
            <span>
              <a
                href="javascript:void(0);"
                onClick={() => this.CreateCityStrategy(record)}
              >
                编辑
              </a>
              <Divider type="vertical" />
              {/* <Popconfirm
                title="你确定删除吗？"
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                okText="确认"
                cancelText="取消"
                onConfirm={() => this.DeleteSingle(record)}
              >
                <a href="#" onClick={(e) => { e.preventDefault() }}>删除</a>
              </Popconfirm>
              <Divider type="vertical" /> */}
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
                onConfirm={() => this.isUp(record, record.state === 2 ? 1 : 2)}
              >
                <a href="#" onClick={(e) => { e.preventDefault() }}>
                  {record.state === 2 ? '上架' : '下架'}
                </a>
              </Popconfirm>
            </span>
          )
        }
      ]
    };
  }

  componentDidMount() {
    this.getCityStrategyPage();
    this.props.global.getCityList({
      data: {}
    });
  }
  getCityStrategyPage = (params: any = {}) => {
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
        this.props.strategy.getCityStrategyPage({
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
        console.log('getCityStrategyPage error');
      }
    });
  };
  SetRecommend = (record: any, state: number) => {
    this.props.strategy.SetRecommend({
      data: {
        id: record.id,
        recommend: state
      },
      callback: res => {
        if (res.code === 0) {
          message.success(res.msg || '操作成功');
          this.getCityStrategyPage();
        } else {
          message.error(res.msg || '操作失败');
        }
      }
    });
  };
  isUp = (record: any, state: number) => {
    this.props.strategy.SetCityState({
      data: {
        id: record.id,
        state: state
      },
      callback: res => {
        if (res.code === 0) {
          message.success(res.msg || '操作成功');
          this.getCityStrategyPage();
        } else {
          message.error(res.msg || '操作失败');
        }
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
    this.getCityStrategyPage({
      size: pagination.pageSize,
      current: pagination.current
    });
    window.scroll(0, 0);
  };
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getCityStrategyPage(values);
      }
    });
  };

  CreateCityStrategy = (item?: any) => {
    this.isCreateCityStrategy(true);
    this.setState({
      currItem: item
    });
  };
  isCreateCityStrategy = (bool: boolean) => {
    this.setState({
      visible: bool
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
  PropsInfo = (bool: boolean) => {
    this.isCreateCityStrategy(false);
    this.isCreateProducts(false);
    this.isCreateComment(false);
  };
  render() {
    const info = this.props.strategy.cityStraegyPage;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const { getFieldDecorator } = this.props.form;
    const CityList = this.props.global.cityList;
    return (
      <Card title="城市攻略" bordered={false} loading={this.state.loading}>
        {this.state.visible && (
          <Modal
            visible={this.state.visible}
            width={1100}
            onCancel={() => this.isCreateCityStrategy(false)}
            footer={null}
          >
            <CreateCityStrategy
              data={this.state.currItem}
              onClose={() => {
                this.PropsInfo(false);
                this.getCityStrategyPage({
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
                this.getCityStrategyPage({
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
                this.getCityStrategyPage({
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
                  label="城市"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('city')(
                    <Select style={{ width: 200 }} placeholder="请选择状态">
                      {CityList.map((item: any, index: number) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col xl={10} md={24} sm={24}>
                <FormItem
                  label="搜索状态"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('state')(
                    <Select style={{ width: 200 }} placeholder="请选择搜索状态">
                      <Option value={1}>上架</Option>
                      <Option value={2}>下架</Option>
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
          <Col xl={12} md={24} sm={24} style={{ marginBottom: '10px' }}>
            <Button
              type="primary"
              htmlType="submit"
              className="listsearch"
              onClick={() => {
                this.CreateCityStrategy();
              }}
            >
              添加城市攻略
            </Button>
          </Col>
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
              }}
              onChange={this.handleTableChange}
            />
          </Col>
        </div>
      </Card>
    );
  }
}
export default Form.create<CityStrategyProps>()(CityStrategyPage);

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
import {
  StandardTableColumnProps,
  TableListParams,
  TableListData,
  TableListPagination,
  TableListItem
} from '../Table';
import { inject, observer } from 'mobx-react';
import SearchOrder from './SearchOrder';
import AfterSales from './AfterSales';
import Orders from '../../models/Orders';
const FormItem = Form.Item;
const Option = Select.Option;
interface Props {
  form: FormComponentProps['form'];
  orders: Orders;
}
interface State {
  columns: StandardTableColumnProps[];
  loading: boolean;
  pagination: TableListPagination;
  stateMaps: any;
  visible: boolean;
  currItem: any;
  isAfter: boolean;
  SalesData: any;
}
@inject('orders')
@observer
class Order extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isAfter: false,
      SalesData: {},
      loading: true,
      visible: false,
      currItem: {},
      stateMaps: {
        1: '未付款',
        2: '已付款',
        3: '退款中',
        4: '已退款'
      },
      pagination: {
        total: 20,
        pageSize: 20,
        current: 1
      },
      columns: [
        {
          title: '订单编号',
          dataIndex: 'runningNumber',
          render: (text: string, record: any) => (
            <span onClick={() => this.SearchOrder(record)}>
              <a href="javacript:void(0);">{text}</a>
            </span>
          )
        },
        {
          title: '旅游产品',
          dataIndex: 'name'
        },
        {
          title: '金额',
          dataIndex: 'price'
        },
        {
          title: '下单用户',
          dataIndex: 'nickName'
        },
        {
          title: '订单状态',
          dataIndex: 'state',
          render: (text: number, record: any) => (
            <span>{this.state.stateMaps[text]}</span>
          )
        },
        {
          title: '下单时间',
          dataIndex: 'createTime'
        },
        {
          title: '售后/退款',
          dataIndex: 'return',
          render: (text: string, record: any) => (
            <span>
              {(record.state === 2 || record.state === 3) && (
                <a
                  href="javacript:void(0);"
                  onClick={() => this.AfterSales(record)}
                >
                  查看申请
                </a>
              )}
            </span>
          )
        },
        {
          title: '操作',
          dataIndex: 'play',
          render: (text: string, record: any) => <span>暂无</span>
        }
      ]
    };
  }
  isAfterSales = (bool: boolean) => {
    this.setState({
      isAfter: bool
    });
  };
  AfterSales = (item?: any) => {
    this.isAfterSales(true);
    this.setState({
      SalesData: item
    });
  };
  isSearchOrder = (bool: boolean) => {
    this.setState({
      visible: bool
    });
  };
  SearchOrder = (item?: any) => {
    this.isSearchOrder(true);
    this.setState({
      currItem: item
    });
  };
  PropsInfo = (bool: boolean) => {
    this.isSearchOrder(false);
    this.isAfterSales(false);
  };
  componentDidMount() {
    this.getOrderPage();
  }
  getOrderPage = (params: any = {}) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let payload = {
          ...values
        };
        if (!params.current) {
          params.current = 1;
        }
        if (params.current === 1) {
          params.ts = new Date().valueOf();
        }
        // else {
        //   params.ts = this.props.message.messagePage.ts;
        // }
        if (!params.size) {
          params.size = 20;
        }
        if (payload.timeRange) {
          if (payload.timeRange.length !== 0) {
          } else {
            payload.start_at = 0;
            payload.end_at = 0;
          }
        }
        payload = {
          ...payload,
          ...params
        };
        this.props.orders.getOrderPage({
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
        console.log('getVideoPage error');
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
    this.getOrderPage({
      size: pagination.pageSize,
      current: pagination.current
    });
    window.scroll(0, 0);
  };
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getOrderPage(values);
      }
    });
  };
  render() {
    const info = this.props.orders.orderPage;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Card title="订单管理" bordered={false} loading={this.state.loading}>
        {this.state.visible && (
          <Modal
            visible={this.state.visible}
            width={700}
            onCancel={() => this.isSearchOrder(false)}
            footer={null}
          >
            <SearchOrder
              data={this.state.currItem}
              onClose={() => {
                this.PropsInfo(false);
                this.getOrderPage({
                  size: this.state.pagination.pageSize,
                  current: this.state.pagination.current
                });
              }}
            />
          </Modal>
        )}
        {this.state.isAfter && (
          <Modal
            visible={this.state.isAfter}
            width={700}
            onCancel={() => this.isAfterSales(false)}
            footer={null}
          >
            <AfterSales
              data={this.state.SalesData}
              onClose={() => {
                this.PropsInfo(false);
                this.getOrderPage({
                  size: this.state.pagination.pageSize,
                  current: this.state.pagination.current
                });
              }}
            />
          </Modal>
        )}
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: '20px' }}>
            <Col xl={10} md={24} sm={24}>
              <FormItem
                label="订单/用户"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('runningNumber')(
                  <Input placeholder="订单/用户" />
                )}
              </FormItem>
            </Col>
            <Col xl={10} md={24} sm={24}>
              <FormItem
                label="订单状态"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('state')(
                  <Select style={{ width: 200 }} placeholder="订单状态">
                    <Option key={1} value={1}>
                      未付款
                    </Option>
                    <Option key={2} value={2}>
                      已付款
                    </Option>
                    <Option key={3} value={3}>
                      退款中
                    </Option>
                    <Option key={4} value={4}>
                      已退款
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
                <Button type="primary" htmlType="submit" className="listsearch">
                  查询
                </Button>
              </div>
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
                  // hideOnSinglePage: true
                }}
                onChange={this.handleTableChange}
              />
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}
export default Form.create<Props>()(Order);

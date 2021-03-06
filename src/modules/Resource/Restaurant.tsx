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
import Resource from '../../models/Resource';
import Global from '../../models/Global';
import {
  StandardTableColumnProps,
  TableListParams,
  TableListData,
  TableListPagination,
  TableListItem
} from '../Table';
import CreateRestaurant from './CreateRestaurant';
import { inject, observer } from 'mobx-react';
const FormItem = Form.Item;
const Option = Select.Option;
interface RestaurantProps {
  form: FormComponentProps['form'];
  resource: Resource;
  global: Global;
}
interface RestaurantState {
  columns: StandardTableColumnProps[];
  loading: boolean;
  visible: boolean;
  currItem: any;
  pagination: TableListPagination;
}
@inject('resource', 'global')
@observer
class Restaurant extends React.Component<RestaurantProps, RestaurantState> {
  constructor(props: RestaurantProps) {
    super(props);
    this.state = {
      loading: true,
      visible: false,
      currItem: {},
      pagination: {
        total: 20,
        pageSize: 20,
        current: 1
      },
      columns: [
        {
          title: '餐厅名称',
          dataIndex: 'name',
          width: 100
        },
        {
          title: '所属城市',
          dataIndex: 'city',
          width: 100
        },
        // {
        //   title: '星级',
        //   dataIndex: 'star',
        // },
        {
          title: '餐厅介绍',
          dataIndex: 'introduce',
          render: (text: string) => (
            <div dangerouslySetInnerHTML={{ __html: text }}></div>
          )
        },
        {
          title: '操作',
          width: 100,
          dataIndex: 'play',
          render: (text: string, record: any) => (
            <span>
              {/* <Popconfirm
                title="你确定启用吗？"
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                okText="确认"
                cancelText="取消"
                onConfirm={() => this.EnableShutdown(record)}
              >
                <a href="#" onClick={(e) => { e.preventDefault() }}>启用</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title="你确定停用吗？"
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                okText="确认"
                cancelText="取消"
                onConfirm={() => this.EnableShutdown(record)}
              >
                <a href="#" onClick={(e) => { e.preventDefault() }}>停用</a>
              </Popconfirm>
              <Divider type="vertical" /> */}
              <a
                href="javascript:void(0);"
                onClick={() => this.CreateRestaurant(record)}
              >
                编辑
              </a>
              {/* <Divider type="vertical" />
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
              </Popconfirm> */}
            </span>
          )
        }
      ]
    };
  }
  componentDidMount() {
    this.getRestaurantPage();
    this.props.global.getCityList({
      data: {}
    });
  }
  getRestaurantPage = (params: any = {}) => {
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
        if (!params.page_size) {
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
        this.props.resource.getRestaurantPage({
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
        console.log('getRestaurantPage error');
      }
    });
  };
  DeleteSingle = (record: { id: string }) => {
    this.props.resource.DeleteRestaurant({
      data: {
        id: record.id
      },
      callback: res => {
        if (res.code === 0) {
          message.success(res.msg || '操作成功');
          this.getRestaurantPage();
        } else {
          message.error(res.msg || '操作失败');
        }
      }
    });
  };
  EnableShutdown = (record: object) => {
    // this.props.mito.DeleteMito({
    //   data: {
    //     id:  record.id
    //     )
    //   },
    //   callback: (res) => {
    //     if (res.code === 200) {
    //       message.success(res.msg || "操作成功")
    //       this.getMitoList();
    //     } else {
    //       message.error(res.msg || "操作失败")
    //     }
    //   }
    // })
  };
  isCreateRestaurant = (bool: boolean) => {
    this.setState({
      visible: bool
    });
  };
  CreateRestaurant = (item?: any) => {
    this.isCreateRestaurant(true);
    this.setState({
      currItem: item
    });
  };
  PropsInfo = (bool: boolean) => {
    this.isCreateRestaurant(false);
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
    this.getRestaurantPage({
      size: pagination.pageSize,
      current: pagination.current
    });
    window.scroll(0, 0);
  };
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getRestaurantPage(values);
      }
    });
  };
  render() {
    const info = this.props.resource.restaurantPage;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const { getFieldDecorator } = this.props.form;
    const CityList = this.props.global.cityList;
    return (
      <Card title="餐厅管理" bordered={false} loading={this.state.loading}>
        {this.state.visible && (
          <Modal
            visible={this.state.visible}
            width={1100}
            onCancel={() => this.isCreateRestaurant(false)}
            footer={null}
          >
            <CreateRestaurant
              data={this.state.currItem}
              onClose={() => {
                this.PropsInfo(false);
                this.getRestaurantPage({
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
                  label="餐厅名称"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('name')(<Input placeholder="餐厅名称" />)}
                </FormItem>
              </Col>
              <Col xl={10} md={24} sm={24}>
                <FormItem
                  label="搜索城市"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('city')(
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
                this.CreateRestaurant();
              }}
            >
              添加餐厅
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
export default Form.create<RestaurantProps>()(Restaurant);

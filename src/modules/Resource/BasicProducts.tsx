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
import CreateBasicProducts from './CreateBasicProducts';
import { inject, observer } from 'mobx-react';
import CheckItinerary from './CheckItinerary';
const FormItem = Form.Item;
const Option = Select.Option;
interface BasicProductsProps {
  form: FormComponentProps['form'];
  resource: Resource;
  global: Global;
}
interface BasicProductsState {
  columns: StandardTableColumnProps[];
  loading: boolean;
  visible: boolean;
  currItem: any;
  pagination: TableListPagination;
  SeeItinerary: boolean;
  searchData: any;
  baseType: any;
}
@inject('resource', 'global')
@observer
class BasicProducts extends React.Component<
  BasicProductsProps,
  BasicProductsState
> {
  constructor(props: BasicProductsProps) {
    super(props);
    this.state = {
      loading: true,
      visible: false,
      baseType: {
        '1': '国内游',
        '2': '港澳游',
        '3': '境外游'
      },
      currItem: {},
      SeeItinerary: false,
      searchData: {},
      pagination: {
        total: 20,
        pageSize: 20,
        current: 1
      },
      columns: [
        {
          title: '产品类型',
          dataIndex: 'type',
          render: (text: string, record: any) => (
            <span>{this.state.baseType[text]}</span>
          )
        },
        {
          title: '产品名称',
          dataIndex: 'name'
        },
        {
          title: '副文案',
          dataIndex: 'copywriting'
        },
        {
          title: '行程天数',
          dataIndex: 'days'
        },
        {
          title: '行程',
          dataIndex: 'search',
          render: (text: string, record: any) => (
            <span>
              <a
                href="javascript:void(0);"
                onClick={() => this.CheckItinerary(record)}
              >
                查看行程
              </a>
            </span>
          )
        },
        {
          title: '操作',
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
                onClick={() => this.CreateBasicProducts(record)}
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
    this.getBasicProductsPage();
  }
  getBasicProductsPage = (params: any = {}) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let payload = {
          ...values
        };
        if (!params.current) {
          params.current = 1;
        }
        //  if (params.current === 1) {
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
        this.props.resource.getBasicProductsPage({
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
        console.log('getBasicProductsPage error');
      }
    });
  };
  DeleteSingle = (record: { id: string }) => {
    this.props.resource.DeleteBasicProducts({
      data: {
        id: record.id
      },
      callback: res => {
        if (res.code === 0) {
          message.success(res.msg || '操作成功');
          this.getBasicProductsPage();
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
  isCreateBasicProducts = (bool: boolean) => {
    this.setState({
      visible: bool
    });
  };
  isCheckItinerary = (bool: boolean) => {
    this.setState({
      SeeItinerary: bool
    });
  };
  CheckItinerary = (item?: any) => {
    this.isCheckItinerary(true);
    this.setState({
      searchData: item
    });
  };
  CreateBasicProducts = (item?: any) => {
    this.isCreateBasicProducts(true);
    this.setState({
      currItem: item
    });
  };
  PropsInfo = (bool: boolean) => {
    this.isCreateBasicProducts(false);
    this.isCheckItinerary(false);
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
    this.getBasicProductsPage({
      size: pagination.pageSize,
      current: pagination.current
    });
    window.scroll(0, 0);
  };
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getBasicProductsPage(values);
      }
    });
  };
  render() {
    const info = this.props.resource.basicProductsPage;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const { getFieldDecorator } = this.props.form;
    const CityList = this.props.global.cityList;
    return (
      <Card title="基础产品管理" bordered={false} loading={this.state.loading}>
        {this.state.visible && (
          <Modal
            visible={this.state.visible}
            width={1400}
            onCancel={() => this.isCreateBasicProducts(false)}
            footer={null}
          >
            <CreateBasicProducts
              data={this.state.currItem}
              onClose={() => {
                this.PropsInfo(false);
                this.getBasicProductsPage({
                  size: this.state.pagination.pageSize,
                  current: this.state.pagination.current
                });
              }}
            />
          </Modal>
        )}
        {this.state.SeeItinerary && (
          <Modal
            visible={this.state.SeeItinerary}
            width={1400}
            onCancel={() => this.isCheckItinerary(false)}
            footer={null}
          >
            <CheckItinerary
              data={this.state.searchData}
              onClose={() => {
                this.PropsInfo(false);
                this.getBasicProductsPage({
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
                  label="基础产品名称"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('name')(
                    <Input placeholder="基础产品名称" />
                  )}
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
                this.CreateBasicProducts();
              }}
            >
              添加基础产品
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
export default Form.create<BasicProductsProps>()(BasicProducts);

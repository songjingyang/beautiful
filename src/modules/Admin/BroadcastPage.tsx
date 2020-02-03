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
import Broadcast from '../../models/Broadcast';
import {
  StandardTableColumnProps,
  TableListParams,
  TableListData,
  TableListPagination,
  TableListItem
} from '../Table';
import CreateBroadcast from './CreateBroadcast';
import { inject, observer } from 'mobx-react';
import PreviewImg from '../../components/PreviewImg';
const FormItem = Form.Item;
const Option = Select.Option;
interface BroadcastProps {
  form: FormComponentProps['form'];
  broadcast: Broadcast;
}
interface BroadcastState {
  columns: StandardTableColumnProps[];
  loading: boolean;
  visible: boolean;
  currItem: any;
  pagination: TableListPagination;
  stateMaps: any;
  positionMaps: any;
}
@inject('broadcast')
@observer
class BroadcastPage extends React.Component<BroadcastProps, BroadcastState> {
  constructor(props: BroadcastProps) {
    super(props);
    this.state = {
      loading: true,
      visible: false,
      currItem: {},
      positionMaps: {
        1: '启动页',
        2: '首页'
      },
      stateMaps: {
        1: '待显示',
        2: '显示',
        3: '隐藏'
      },
      pagination: {
        total: 20,
        pageSize: 20,
        current: 1
      },
      columns: [
        {
          title: '标题',
          dataIndex: 'title'
        },
        {
          title: '位置',
          dataIndex: 'position'
          // render: (text: string, record: any) => (
          //   <span>{this.state.positionMaps[text]}</span>
          // )
        },
        {
          title: '图片',
          dataIndex: 'url',
          render: (text: string) => <PreviewImg alt={'img'} src={text} />
        },
        {
          title: '跳转',
          dataIndex: 'jumpUrl'
        },
        {
          title: '开始时间',
          dataIndex: 'startTime'
        },
        {
          title: '结束时间',
          dataIndex: 'endTime'
        },
        {
          title: '状态',
          dataIndex: 'state',
          render: (text: number, record: any) => (
            <span>{this.state.stateMaps[text]}</span>
          )
        },
        {
          title: '操作',
          dataIndex: 'play',
          render: (text: string, record: any) => (
            <span>
              <a
                href="javascript:void(0);"
                onClick={() => this.CreateBroadcast(record)}
              >
                编辑
              </a>
              <Divider type="vertical" />
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
              <Divider type="vertical" />
              {/* {record.state === 2 &&
                <span>
                  <Popconfirm
                    title="你确定上架吗？"
                    icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                    okText="确认"
                    cancelText="取消"
                    onConfirm={() => this.EnableShutdown(record)}
                  >
                    <a href="#" onClick={(e) => { e.preventDefault() }}>上架</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                </span>
              }
              {record.state === 1 &&
                <span>
                  <Popconfirm
                    title="你确定下架吗？"
                    icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                    okText="确认" 
                    cancelText="取消"
                    onConfirm={() => this.EnableShutdown(record)}
                  >
                    <a href="#" onClick={(e) => { e.preventDefault() }}>下架</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                </span>
              } */}
            </span>
          )
        }
      ]
    };
  }
  componentDidMount() {
    this.getBroadcastPage();
  }
  getBroadcastPage = (params: any = {}) => {
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
        this.props.broadcast.getBroadcastPage({
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
        console.log('getTagPage error');
      }
    });
  };
  DeleteSingle = (record: { id: string }) => {
    this.props.broadcast.DeleteCast({
      data: {
        id: record.id
      },
      callback: res => {
        if (res.code === 0) {
          message.success(res.msg || '操作成功');
          this.getBroadcastPage();
        } else {
          message.error(res.msg || '操作失败');
          this.getBroadcastPage();
        }
      }
    });
  };
  // EnableShutdown = (record: any) => {
  //   this.props.tag.EditTag({
  //     data: {
  //       id: record.id,
  //       state: record.state === 2 ? 1 : 2
  //     },
  //     callback: (res) => {
  //       if (res.code === 0) {
  //         message.success(res.msg || "操作成功")
  //         this.getTagPage();
  //       } else {
  //         message.error(res.msg || "操作失败")
  //       }
  //     }
  //   })
  // }
  isCreateBroadcast = (bool: boolean) => {
    this.setState({
      visible: bool
    });
  };
  CreateBroadcast = (item?: any) => {
    this.isCreateBroadcast(true);
    this.setState({
      currItem: item
    });
  };
  PropsInfo = (bool: boolean) => {
    this.isCreateBroadcast(false);
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
    this.getBroadcastPage({
      size: pagination.pageSize,
      current: pagination.current
    });
    window.scroll(0, 0);
  };
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getBroadcastPage(values);
      }
    });
  };
  render() {
    const info = this.props.broadcast.broadcastPage;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Card title="首页轮播管理" bordered={false} loading={this.state.loading}>
        {this.state.visible && (
          <Modal
            visible={this.state.visible}
            width={1100}
            onCancel={() => this.isCreateBroadcast(false)}
            footer={null}
          >
            <CreateBroadcast
              data={this.state.currItem}
              onClose={() => {
                this.PropsInfo(false);
                this.getBroadcastPage({
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
                  {getFieldDecorator('name')(<Input placeholder="标题" />)}
                </FormItem>
              </Col>
              <Col xl={10} md={24} sm={24}>
                <FormItem
                  label="状态"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('state')(
                    <Select style={{ width: 200 }} placeholder="请选择状态">
                      <Option key={1} value={1}>
                        待显示
                      </Option>
                      <Option key={2} value={2}>
                        显示
                      </Option>
                      <Option key={3} value={3}>
                        隐藏
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
          <Col xl={12} md={24} sm={24} style={{ marginBottom: '10px' }}>
            <Button
              type="primary"
              htmlType="submit"
              className="listsearch"
              onClick={() => {
                this.CreateBroadcast();
              }}
            >
              添加首页轮播
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
export default Form.create<BroadcastProps>()(BroadcastPage);

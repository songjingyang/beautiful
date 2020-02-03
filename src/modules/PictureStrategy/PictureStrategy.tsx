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
import {
  StandardTableColumnProps,
  TableListParams,
  TableListData,
  TableListPagination,
  TableListItem
} from '../Table';
import CreatePicture from './CreatePicture';
import ShowPicture from './ShowPicture';
import { inject, observer } from 'mobx-react';
const FormItem = Form.Item;
const Option = Select.Option;
interface Props {
  form: FormComponentProps['form'];
  strategy: Strategy;
  global: Global;
}
interface State {
  columns: StandardTableColumnProps[];
  loading: boolean;
  visible: boolean;
  currItem: any;
  pagination: TableListPagination;
  stateMaps: any;
  isShow: boolean;
  dataShow: any;
}
@inject('strategy', 'global')
@observer
class PictureStrategy extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      stateMaps: {
        1: '上架',
        2: '下架'
      },
      isShow: false,
      dataShow: {},
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
          title: '图集名称',
          dataIndex: 'title'
        },
        {
          title: '图集说明',
          dataIndex: 'content',
          width: 600
        },
        {
          title: '图片数量',
          dataIndex: 'num',
          render: (text: string, record: any) => (
            <span>
              {record.bmMaterialList.length}个
              <a
                href="javascript:void(0);"
                onClick={() => this.ShowPicture(record)}
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
          dataIndex: 'cityInfo',
          render: (text: string, record: any) => (
            <span>
              {record.bmTourProductDaysList[0] &&
                record.bmTourProductDaysList[0].title}
            </span>
          )
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
                onClick={() => this.CreateHotel(record)}
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
              {record.state === 2 && (
                <span>
                  <Popconfirm
                    title="你确定上架吗？"
                    icon={
                      <Icon type="question-circle-o" style={{ color: 'red' }} />
                    }
                    okText="确认"
                    cancelText="取消"
                    onConfirm={() => this.EnableShutdown(record)}
                  >
                    <a href="#" onClick={(e) => { e.preventDefault() }}>上架</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                </span>
              )}
              {record.state === 1 && (
                <span>
                  <Popconfirm
                    title="你确定下架吗？"
                    icon={
                      <Icon type="question-circle-o" style={{ color: 'red' }} />
                    }
                    okText="确认"
                    cancelText="取消"
                    onConfirm={() => this.EnableShutdown(record)}
                  >
                    <a href="#" onClick={(e) => { e.preventDefault() }}>下架</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                </span>
              )}
            </span>
          )
        }
      ]
    };
  }
  componentDidMount() {
    this.getPictureStrategyPage();
  }
  getPictureStrategyPage = (params: any = {}) => {
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
        this.props.strategy.getPictureStrategyPage({
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
        console.log('getPictureStrategyPage error');
      }
    });
  };
  DeleteSingle = (record: { id: string }) => {
    this.props.strategy.DeletePictureStrategyPage({
      data: {
        id: record.id
      },
      callback: res => {
        if (res.code === 0) {
          message.success(res.msg || '操作成功');
          this.getPictureStrategyPage();
        } else {
          message.error(res.msg || '操作失败');
        }
      }
    });
  };
  EnableShutdown = (record: any) => {
    this.props.strategy.EditImageUpOrDown({
      data: {
        id: record.id,
        state: record.state === 2 ? 1 : 2
      },
      callback: res => {
        if (res.code === 0) {
          message.success(res.msg || '操作成功');
          this.getPictureStrategyPage();
        } else {
          message.error(res.msg || '操作失败');
        }
      }
    });
  };
  ShowPicture = (item?: any) => {
    this.isShowPicture(true);
    this.setState({
      dataShow: item
    });
  };
  isShowPicture = (bool: boolean) => {
    this.setState({
      isShow: bool
    });
  };
  isCreateHotel = (bool: boolean) => {
    this.setState({
      visible: bool
    });
  };
  CreateHotel = (item?: any) => {
    this.isCreateHotel(true);
    this.setState({
      currItem: item
    });
  };
  PropsInfo = (bool: boolean) => {
    this.isCreateHotel(false);
    this.isShowPicture(false);
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
    this.getPictureStrategyPage({
      size: pagination.pageSize,
      current: pagination.current
    });
    window.scroll(0, 0);
  };
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getPictureStrategyPage(values);
      }
    });
  };
  render() {
    const info = this.props.strategy.pictureStraegyPage;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Card title="图集攻略管理" bordered={false} loading={this.state.loading}>
        {this.state.isShow && (
          <Modal
            visible={this.state.isShow}
            width={1300}
            onCancel={() => this.isShowPicture(false)}
            footer={null}
          >
            <ShowPicture
              data={this.state.dataShow}
              onClose={() => {
                this.PropsInfo(false);
                this.getPictureStrategyPage({
                  size: this.state.pagination.pageSize,
                  current: this.state.pagination.current
                });
              }}
            />
          </Modal>
        )}
        {this.state.visible && (
          <Modal
            visible={this.state.visible}
            width={1100}
            onCancel={() => this.isCreateHotel(false)}
            footer={null}
          >
            <CreatePicture
              data={this.state.currItem}
              onClose={() => {
                this.PropsInfo(false);
                this.getPictureStrategyPage({
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
                  label="图集名称"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('name')(<Input placeholder="图集名称" />)}
                </FormItem>
              </Col>
              <Col xl={10} md={24} sm={24}>
                <FormItem
                  label="状态"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('city')(
                    <Select style={{ width: 200 }} placeholder="请选择状态">
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
                this.CreateHotel();
              }}
            >
              添加图集攻略
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
export default Form.create<Props>()(PictureStrategy);

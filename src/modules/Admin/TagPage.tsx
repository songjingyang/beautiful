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
import Tag from '../../models/Tag';
import {
  StandardTableColumnProps,
  TableListParams,
  TableListData,
  TableListPagination,
  TableListItem
} from '../Table';
import CreateTag from './CreateTag';
import { inject, observer } from 'mobx-react';
const FormItem = Form.Item;
const Option = Select.Option;
interface TagProps {
  form: FormComponentProps['form'];
  tag: Tag;
}
interface TagState {
  columns: StandardTableColumnProps[];
  loading: boolean;
  visible: boolean;
  currItem: any;
  pagination: TableListPagination;
  stateMaps: any;
}
@inject('tag')
@observer
class TagPage extends React.Component<TagProps, TagState> {
  constructor(props: TagProps) {
    super(props);
    this.state = {
      loading: true,
      visible: false,
      currItem: {},
      stateMaps: {
        1: '上架',
        2: '下架'
      },
      pagination: {
        total: 20,
        pageSize: 20,
        current: 1
      },
      columns: [
        {
          title: '标签名称',
          dataIndex: 'title'
        },
        {
          title: '副标题',
          dataIndex: 'subtitle'
        },
        {
          title: '位置',
          dataIndex: 'sort'
        },
        {
          title: '上架时间',
          dataIndex: 'startTime'
        },
        {
          title: '下架时间',
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
                onClick={() => this.CreateTag(record)}
              >
                编辑
              </a>
              <Divider type="vertical" />
              {/* <Popconfirm
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
                    onConfirm={() => this.EditState(record)}
                  >
                    <a href="#" onClick={(e) => { e.preventDefault() }}>上架</a>
                  </Popconfirm>
                  {/* <Divider type="vertical" /> */}
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
                    onConfirm={() => this.EditState(record)}
                  >
                    <a href="#" onClick={(e) => { e.preventDefault() }}>下架</a>
                  </Popconfirm>
                  {/* <Divider type="vertical" /> */}
                </span>
              )}
            </span>
          )
        }
      ]
    };
  }
  componentDidMount() {
    this.getTagPage();
  }
  getTagPage = (params: any = {}) => {
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
        this.props.tag.getTagPage({
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
    this.props.tag.DeleteTag({
      data: {
        id: record.id
      },
      callback: res => {
        if (res.code === 0) {
          message.success(res.msg || '操作成功');
          this.getTagPage();
        } else {
          message.error(res.msg || '操作失败');
        }
      }
    });
  };
  EditState = (record: any) => {
    this.props.tag.EditState({
      data: {
        id: record.id,
        state: record.state === 2 ? 1 : 2
      },
      callback: res => {
        if (res.code === 0) {
          message.success(res.msg || '操作成功');
          this.getTagPage();
        } else {
          message.error(res.msg || '操作失败');
          this.getTagPage();
        }
      }
    });
  };
  isCreateTag = (bool: boolean) => {
    this.setState({
      visible: bool
    });
  };
  CreateTag = (item?: any) => {
    this.isCreateTag(true);
    this.setState({
      currItem: item
    });
  };
  PropsInfo = (bool: boolean) => {
    this.isCreateTag(false);
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
    this.getTagPage({
      size: pagination.pageSize,
      current: pagination.current
    });
    window.scroll(0, 0);
  };
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getTagPage(values);
      }
    });
  };
  render() {
    const info = this.props.tag.tagPage;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Card title="首页标签管理" bordered={false} loading={this.state.loading}>
        {this.state.visible && (
          <Modal
            visible={this.state.visible}
            width={1100}
            onCancel={() => this.isCreateTag(false)}
            footer={null}
          >
            <CreateTag
              data={this.state.currItem}
              onClose={() => {
                this.PropsInfo(false);
                this.getTagPage({
                  size: this.state.pagination.pageSize,
                  current: this.state.pagination.current
                });
              }}
            />
          </Modal>
        )}
        <div className="tableList">
          <BackTop className="ant-back-top-inner" />
          <Col xl={12} md={24} sm={24} style={{ marginBottom: '10px' }}>
            <Button
              type="primary"
              htmlType="submit"
              className="listsearch"
              onClick={() => {
                this.CreateTag();
              }}
            >
              添加首页标签
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
export default Form.create<TagProps>()(TagPage);

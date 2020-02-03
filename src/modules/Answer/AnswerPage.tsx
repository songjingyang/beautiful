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
import Answer from '../../models/Answer';
import UserAnswer from './UserAnswer';
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
interface AnswerProps {
  form: FormComponentProps['form'];
  answer: Answer;
}
interface AnswerState {
  columns: StandardTableColumnProps[];
  loading: boolean;
  pagination: TableListPagination;
  stateMaps: any;
  shelfMaps: any;
  dataShow: any;
  isShow: boolean;
}
@inject('answer')
@observer
class AnswerPage extends React.Component<AnswerProps, AnswerState> {
  constructor(props: AnswerProps) {
    super(props);
    this.state = {
      loading: true,
      dataShow: {},
      isShow: false,
      shelfMaps: {
        1: '上架',
        2: '下架'
      },
      stateMaps: {
        1: '未审核',
        2: '未通过',
        3: '通过'
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
          title: '上传用户',
          dataIndex: 'nickName'
        },
        {
          title: '内容名称',
          dataIndex: 'content'
        },
        {
          title: '城市',
          dataIndex: 'city'
        },
        {
          title: '用户回答',
          dataIndex: 'answersCount',
          render: (text: number, record: any) => (
            <span>
              {text}条
              <a
                href="javascript:void(0);"
                onClick={() => this.ShowUserAnswer(record)}
              >
                查看
              </a>
            </span>
          )
        },
        {
          title: '审核状态',
          dataIndex: 'state',
          render: (text: number) => <span>{this.state.stateMaps[text]}</span>
        },
        {
          title: '状态',
          dataIndex: 'shelf',
          render: (text: number) => <span>{this.state.shelfMaps[text]}</span>
        },
        {
          title: '操作',
          dataIndex: 'play',
          render: (text: string, record: any) => (
            <span>
              <Popconfirm
                title="你确定启用吗？"
                icon={
                  <Icon type="question-circle-o" style={{ color: 'red' }} />
                }
                okText="确认"
                cancelText="取消"
                onConfirm={() =>
                  this.EnableShutdown(record, record.shelf === 2 ? 1 : 2)
                }
              >
                <a href="#" onClick={(e) => { e.preventDefault() }}>
                  {record.shelf === 2 ? '上架' : '下架'}
                </a>
              </Popconfirm>
              <Divider type="vertical" />
              {record.state !== 3 && (
                <span>
                  <Popconfirm
                    title="你确定启用吗？"
                    icon={
                      <Icon type="question-circle-o" style={{ color: 'red' }} />
                    }
                    okText="确认"
                    cancelText="取消"
                    onConfirm={() => this.AllowPass(record, 3)}
                  >
                    <a href="#" onClick={(e) => { e.preventDefault() }}>通过审核</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                </span>
              )}
              {record.state === 1 && (
                <span>
                  <Popconfirm
                    title="你确定启用吗？"
                    icon={
                      <Icon type="question-circle-o" style={{ color: 'red' }} />
                    }
                    okText="确认"
                    cancelText="取消"
                    onConfirm={() => this.AllowPass(record, 2)}
                  >
                    <a href="#" onClick={(e) => { e.preventDefault() }}>拒绝通过</a>
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
  AllowPass = (record: any, state: number) => {
    this.props.answer.EnableState({
      data: {
        id: record.id,
        state: state
      },
      callback: res => {
        if (res.code === 0) {
          message.success('操作成功');
          this.getAnswerPage();
        } else {
          message.error('操作失败');
          this.getAnswerPage();
        }
      }
    });
  };
  EnableShutdown = (record: any, state: number) => {
    this.props.answer.EnableShutDown({
      data: {
        id: record.id,
        shelf: record.shelf === 1 ? 2 : 1
      },
      callback: res => {
        if (res.code === 0) {
          message.success('操作成功');
          this.getAnswerPage();
        } else {
          message.error('操作失败');
          this.getAnswerPage();
        }
      }
    });
  };
  componentDidMount() {
    this.getAnswerPage();
  }
  getAnswerPage = (params: any = {}) => {
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
        this.props.answer.getAnswerPage({
          data: {
            ...payload,
            category: 1
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
        console.log('getAnswerPage error');
      }
    });
  };

  ShowUserAnswer = (item?: any) => {
    this.isShowUserAnswer(true);
    this.setState({
      dataShow: item
    });
  };
  isShowUserAnswer = (bool: boolean) => {
    this.setState({
      isShow: bool
    });
  };
  PropsInfo = (bool: boolean) => {
    this.isShowUserAnswer(false);
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
    this.getAnswerPage({
      size: pagination.pageSize,
      current: pagination.current
    });
    window.scroll(0, 0);
  };
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getAnswerPage(values);
      }
    });
  };
  render() {
    const info = this.props.answer.answerPage;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Card title="问答管理" bordered={false} loading={this.state.loading}>
        {this.state.isShow && (
          <Modal
            visible={this.state.isShow}
            width={1300}
            onCancel={() => this.isShowUserAnswer(false)}
            footer={null}
          >
            <UserAnswer
              data={this.state.dataShow}
              onClose={() => {
                this.PropsInfo(false);
                this.getAnswerPage({
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
              <Col xl={8} md={24} sm={24}>
                <FormItem
                  label="问答内容"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('content')(
                    <Input placeholder="问答内容" />
                  )}
                </FormItem>
              </Col>
              <Col xl={8} md={24} sm={24}>
                <FormItem
                  label="审核状态"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('state')(
                    <Select placeholder="请选择审核状态">
                      <Option value={1}>未审核</Option>
                      <Option value={2}>未通过</Option>
                      <Option value={3}>通过</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col xl={8} md={24} sm={24}>
                <FormItem
                  label="上下架状态"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('shelf')(
                    <Select placeholder="请选择上下架状态">
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
export default Form.create<AnswerProps>()(AnswerPage);

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
import store from '../../models/index';
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
  data: any;
  onClose: any;
}
interface AnswerState {
  columns: StandardTableColumnProps[];
  loading: boolean;
  pagination: TableListPagination;
  stateMaps: any;
  shelfMaps: any;
}
@inject('answer')
@observer
class UserAnswer extends React.Component<AnswerProps, AnswerState> {
  constructor(props: AnswerProps) {
    super(props);
    this.state = {
      loading: true,
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
          title: '用户名称',
          dataIndex: 'nickName'
        },
        {
          title: '点评内容',
          dataIndex: 'content'
        },
        {
          title: '发布时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'play',
          render: (text: string, record: any) => (
            <span>
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
            </span>
          )
        }
      ]
    };
  }
  componentDidMount() {
    this.getUserAnswer();
  }
  getUserAnswer = (params: any = {}) => {
    let payload = {
      ...params,
      parentId: this.props.data.id,

      size: 1000,
      current: 1
    };
    store.answer.getUserAnswer({
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
  };
  DeleteSingle = (record: { id: string }) => {
    store.answer.DeleteUserAnswer({
      data: {
        id: record.id
      },
      callback: res => {
        if (res.code === 0) {
          message.success(res.msg || '操作成功');
          this.getUserAnswer();
          this.props.onClose();
        } else {
          message.error(res.msg || '操作失败');
          this.props.onClose();
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
    this.getUserAnswer({
      size: pagination.pageSize,
      current: pagination.current
    });
    window.scroll(0, 0);
  };
  render() {
    const info = store.answer.userAnswer;
    return (
      <Card title="用户回答" bordered={false} loading={this.state.loading}>
        <div className="tableList">
          <BackTop className="ant-back-top-inner" />
          <Col span={24}>
            <Table
              columns={this.state.columns}
              rowKey={'id' || 'key'}
              dataSource={info.records}
              pagination={false}
              onChange={this.handleTableChange}
            />
          </Col>
        </div>
      </Card>
    );
  }
}
export default UserAnswer;

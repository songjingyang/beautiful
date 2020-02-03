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
import store from '../../models/index';
import { FormComponentProps } from 'antd/es/form';
import Comment from '../../models/Comment';
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
interface CommentProps {
  onClose: any;
  data: any;
}
interface CommentState {
  columns: StandardTableColumnProps[];
  loading: boolean;
  pagination: TableListPagination;
  commentMaps: any;
  itemTypeMaps: any;
}
@inject('comment')
@observer
class CommentPage extends React.Component<CommentProps, CommentState> {
  constructor(props: CommentProps) {
    super(props);
    this.state = {
      itemTypeMaps: {
        1: '城市攻略',
        3: '景点介绍',
        4: '旅游产品',
        5: '游记'
      },
      commentMaps: {
        0: '正常',
        1: '待审核',
        2: '审核失败',
        3: '审核通过'
      },
      loading: true,
      pagination: {
        total: 20,
        pageSize: 20,
        current: 1
      },
      columns: [
        {
          title: '评论内容',
          dataIndex: 'content'
        },
        {
          title: '发表用户',
          dataIndex: 'nickName'
        },
        {
          title: '评论模块',
          dataIndex: 'itemType',
          render: (text: number) => <span>{this.state.itemTypeMaps[text]}</span>
        },
        {
          title: '被评论标题',
          dataIndex: 'itemTitle'
        },
        // {
        //   title: '状态',
        //   dataIndex: 'state',
        //   render: (text: number, record: any) => (
        //     <span>{this.state.commentMaps[text]}</span>
        //   )
        // },
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
    this.getCommentPage();
    store.global.getCityList({
      data: {}
    });
  }
  getCommentPage = (params: any = {}) => {
    let payload = {
      ...params,
      itemId: this.props.data.id,
      itemType: 1
    };
    store.comment.getCommentPage({
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
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     let payload = {
    //       ...values,
    //     };
    //     if (!params.current) {
    //       params.current = 1;
    //     }
    //     if (params.current === 1) {
    //       params.ts = new Date().valueOf();
    //     }
    //     // else {
    //     //   params.ts = this.props.message.messagePage.ts;
    //     // }
    //     if (!params.page_size) {
    //      params.size = 20;
    //     }
    //     if (payload.timeRange) {
    //       if (payload.timeRange.length !== 0) {
    //         payload.start_at = parseInt(payload.timeRange[0].valueOf());
    //         payload.end_at = parseInt(payload.timeRange[1].valueOf());
    //       } else {
    //         payload.start_at = 0;
    //         payload.end_at = 0;
    //       }
    //     }
    //     payload = {
    //       ...payload,
    //       ...params,
    //     };
    //     this.props.comment.getCommentPage({
    //       data: {
    //         ...payload,
    //       },

    //       callback: res => {
    //         if (res.code === 0) {
    //           this.setState({
    //             loading: false
    //           })
    //         }
    //       },
    //     });
    //   } else {
    //     console.log('getCommentPage error');
    //   }
    // });
  };
  DeleteSingle = (record: { id: string }) => {
    store.comment.DeleteComment({
      data: {
        id: record.id
      },
      callback: res => {
        if (res.code === 0) {
          message.success(res.msg || '操作成功');
          this.getCommentPage();
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
    this.getCommentPage({
      size: pagination.pageSize,
      current: pagination.current
    });
    window.scroll(0, 0);
  };
  render() {
    const info = store.comment.commentPage;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    return (
      <Card title="评论管理" bordered={false} loading={this.state.loading}>
        <div className="tableList">
          <BackTop className="ant-back-top-inner" />
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
export default CommentPage;

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
import PreviewImg from '../../components/PreviewImg';
import UserAdmin from '../../models/UserAdmin';
import Global from '../../models/Global';
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
interface HotelProps {
  form: FormComponentProps['form'];
  userAdmin: UserAdmin;
  global: Global;
}
interface HotelState {
  columns: StandardTableColumnProps[];
  loading: boolean;
  visible: boolean;
  currItem: any;
  pagination: TableListPagination;
}
@inject('userAdmin', 'global')
@observer
class UserList extends React.Component<HotelProps, HotelState> {
  constructor(props: HotelProps) {
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
          title: '用户名称',
          dataIndex: 'name'
        },
        {
          title: '头像',
          dataIndex: 'city',
          render: (text: string, record: any) => (
            <PreviewImg src={text} alt="img" />
          )
        },
        {
          title: '手机号',
          dataIndex: 'phone'
        },
        {
          title: '剩余积分',
          dataIndex: 'star'
        },
        {
          title: '出行次数',
          dataIndex: 'num'
        },
        {
          title: '发布游记',
          dataIndex: 'tour'
        },
        {
          title: '分享次数',
          dataIndex: 'share'
        },
        {
          title: '状态',
          dataIndex: 'status'
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
                onConfirm={() => this.EnableShutdown(record)}
              >
                <a href="#" onClick={(e) => { e.preventDefault() }}>启用</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title="你确定停用吗？"
                icon={
                  <Icon type="question-circle-o" style={{ color: 'red' }} />
                }
                okText="确认"
                cancelText="取消"
                onConfirm={() => this.EnableShutdown(record)}
              >
                <a href="#" onClick={(e) => { e.preventDefault() }}>停用</a>
              </Popconfirm>
              {/* <Divider type="vertical" /> */}
              {/* <a
                href="javascript:void(0);"
                onClick={() => this.CreateHotel(record)}
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
              </Popconfirm> */}
            </span>
          )
        }
      ]
    };
  }
  componentDidMount() {
    this.getUserList();
    this.props.global.getCityList({
      data: {}
    });
  }
  getUserList = (params: any = {}) => {
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
        this.props.userAdmin.getUserList({
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
        console.log('getUserList error');
      }
    });
  };
  EnableShutdown = (record: any) => {
    this.props.userAdmin.EnableShutdown({
      data: {
        id: record.id
      },
      callback: res => {
        if (res.code === 200) {
          message.success(res.msg || '操作成功');
          this.getUserList();
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
    this.getUserList({
      size: pagination.pageSize,
      current: pagination.current
    });
    window.scroll(0, 0);
  };
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getUserList(values);
      }
    });
  };
  render() {
    const info = this.props.userAdmin.userList;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const { getFieldDecorator } = this.props.form;
    const CityList = this.props.global.cityList;
    return (
      <Card title="用户列表" bordered={false} loading={this.state.loading}>
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
export default Form.create<HotelProps>()(UserList);

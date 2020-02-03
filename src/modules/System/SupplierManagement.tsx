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
} from './Table';
import CreatePrivilege from './CreateSupply';

interface SupplyProps {
  form: FormComponentProps['form'];
}
interface SupplyState {
  columns: StandardTableColumnProps[];
  loading: boolean;
  visible: boolean;
  currItem: object;
  pagination: TableListPagination;
}
class SupplierManagement extends React.Component<SupplyProps, SupplyState> {
  constructor(props: SupplyProps) {
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
          title: '供应商',
          dataIndex: 'name'
        },
        {
          title: '联系人',
          dataIndex: 'url'
        },
        {
          title: '电话',
          dataIndex: 'url'
        },
        {
          title: '权限',
          dataIndex: 'url'
        },
        {
          title: '状态',
          dataIndex: 'url'
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
              <a
                href="javascript:void(0);"
                onClick={() => this.CreatePrivilege(record)}
              >
                编辑
              </a>
            </span>
          )
        }
      ]
    };
  }
  componentDidMount() {}
  getPrivilegePage = (params: any = {}) => {
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
        } else {
          // params.ts = this.props.message.messagePage.ts;
        }
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
        // this.props.message.getMessagePage({
        //   data: {
        //     ...payload,
        //   },

        //   callback: res => {
        //     if (res.code === 200) {
        //       this.setState({
        //         loading: false
        //       })
        //     }
        //   },
        // });
      } else {
        console.log('PrivilegePage error');
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
  isCreatePrivilege = (bool: boolean) => {
    this.setState({
      visible: bool
    });
  };
  CreatePrivilege = (item?: any) => {
    console.log('TCL: SupplierManagement -> CreatePrivilege -> item', item);
    this.isCreatePrivilege(true);
    this.setState({
      currItem: item
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
    pager.current = pagination.current || 0;
    this.setState({
      pagination: pager
    });
    window.scroll(0, 0);
  };
  render() {
    return (
      <Card
        title="供应商管理"
        bordered={false}
        // loading={this.state.loading}
      >
        {this.state.visible && (
          <Modal
            visible={this.state.visible}
            width={900}
            onCancel={() => this.isCreatePrivilege(false)}
            footer={null}
          >
            <CreatePrivilege
              // form={this.props.form}
              // mito={this.props.mito}
              // system={this.props.system}
              data={this.state.currItem}
              // onClose={() => {
              //     this.PropsInfo(false);
              //     this.getMitoList({
              //         page_size: this.state.pagination.page_size,
              //         page: this.state.pagination.current,
              //     });
              // }}
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
                this.CreatePrivilege();
              }}
            >
              添加供应商
            </Button>
          </Col>
          <Col span={24}>
            <Table
              columns={this.state.columns}
              rowKey={'id' || 'key'}
              dataSource={[]}
              pagination={{
                // ...this.state.pagination,
                // total: info.total,
                // current: info.page,
                showQuickJumper: true,
                hideOnSinglePage: true
              }}
              onChange={this.handleTableChange}
            />
          </Col>
        </div>
      </Card>
    );
  }
}
export default Form.create<SupplyProps>()(SupplierManagement);

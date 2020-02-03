import React from 'react';
import { FormComponentProps } from 'antd/es/form';
import {
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Row,
  Col,
  Button,
  Upload,
  Icon,
  Rate,
  Tooltip,
  Input,
  Card,
  DatePicker,
  message,
  notification,
  Tree,
  Table,
  Drawer,
  List,
  Avatar,
  Popconfirm
} from 'antd';
import store from '../../models/index';
import {
  StandardTableColumnProps,
  TableListParams,
  TableListData,
  TableListPagination,
  TableListItem
} from '../../modules/Table';
import { isPlainObject } from 'mobx/lib/internal';
import { inject, observer } from 'mobx-react';
import PreviewImg from '../../components/PreviewImg';
import { SorterResult } from 'antd/es/table';
const Option = Select.Option;
const FormItem = Form.Item;
interface Props {
  onChange?(selectInfo: any): void;
  value?: any;
  count?: number;
  data: any;
  onClose: any;
}
interface State {
  columns: StandardTableColumnProps[];
  selectedRow: any;
  pagination: TableListPagination;
  selectedRowKeys: any;
  loading: boolean;
}

@inject('global')
@observer
class RelationJourney extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pagination: {
        total: 20,
        pageSize: 20,
        current: 1
      },
      loading: true,
      columns: [
        {
          title: '图片',
          dataIndex: 'coverUrl',
          render: (text: string, record: any) => (
            <PreviewImg alt="url" src={text} />
          )
        },
        {
          title: '标题',
          dataIndex: 'title'
        },
        {
          title: '出游人数',
          dataIndex: 'count'
        },
        {
          title: '价格',
          dataIndex: 'price'
        },
        {
          title: '操作',
          dataIndex: 'play',
          render: (text: string, record: any) => (
            <Popconfirm
              title={
                <div>
                  <span>你确定</span>
                  <span>{record.relation === 1 ? '取消' : '关联'}</span>
                  <span>吗？</span>
                </div>
              }
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
              okText="确认"
              cancelText="取消"
              onConfirm={() =>
                this.EditProducts(record, record.relation === 1 ? 2 : 1)
              }
            >
              <a href="#" onClick={(e) => { e.preventDefault() }}>
                {record.relation === 1 ? '取消' : '关联'}
              </a>
            </Popconfirm>
          )
        }
      ],
      selectedRow: [],
      selectedRowKeys: []
    };
  }
  componentDidMount() {
    console.log(
      'TCL: RelationJourney -> componentDidMount ->  this.props.data',
      this.props.data
    );
    this.getRelationJourney();
  }
  getRelationJourney = (params: any = {}) => {
    store.global.getRelationPage({
      data: {
        isRelation: 2,
        type: 5,
        itemId: this.props.data.id,
        ...params
      },
      callback: res => {
        if (res.code === 0) {
          const newSelect = res.data.records.filter((item: any) => {
            if (item.isRelation === 1) {
              return item.id;
            }
          });
          this.setState({
            selectedRowKeys: newSelect,
            loading: false
          });
        }
      }
    });
  };
  onSelectChange = (selectedRowKeys: any, selectedRow: any) => {
    this.setState({
      selectedRow: selectedRow,
      selectedRowKeys: selectedRowKeys
    });
  };
  EditProducts = (record: any, state: number) => {
    store.global.EditProducts({
      data: {
        tourProductId: record.tourProductId,
        itemId: this.props.data.id,
        isRelation: state,
        type: 5
      },
      callback: res => {
        if (res.code === 0) {
          message.success(res.msg || '操作成功');
          this.getRelationJourney();
        } else {
          message.error(res.msg || '操作失败');
          this.getRelationJourney();
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
    this.getRelationJourney({
      size: pagination.pageSize,
      current: pagination.current
    });
    window.scroll(0, 0);
  };
  // CheckSelect = () => {
  //   store.global.EditProducts({
  //     data: {
  //       tourProductId: this.props.data.tourProductId,
  //       itemId: this.props.data.id,
  //       isRelation: 1,
  //       type: 5,
  //     }, callback: (res) => {
  //       if (res.code === 0) {
  //         message.success(res.msg || "操作成功")

  //       } else {
  //         message.error(res.msg || "操作失败")
  //       }
  //     }
  //   })
  // }
  render() {
    const info = store.global.relationPage;
    const { selectedRow, selectedRowKeys } = this.state;
    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys
    };
    const hasSelected = selectedRow.length > 0;
    return (
      <Card
        title={'关联旅游产品'}
        bordered={false}
        loading={this.state.loading}
      >
        {/* <div style={{ marginBottom: 16 }}>
          <Button
            onClick={this.CheckSelect}
            disabled={!hasSelected}
          >
            提交
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `选择 ${selectedRow.length} 个` : ''}
          </span>
        </div> */}
        <Table
          rowKey={(record: any) => record.tourProductId}
          // rowSelection={rowSelection}
          columns={this.state.columns}
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
      </Card>
    );
  }
}
export default RelationJourney;

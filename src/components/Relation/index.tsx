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
  Avatar
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
import PreviewImg from '../PreviewImg';
import { TableRowSelection } from 'antd/lib/table/interface';
const Option = Select.Option;
const FormItem = Form.Item;
interface Props {
  onChange?(selectInfo: any): void;
  value?: any;
  type: any;
}
interface State {
  columns: StandardTableColumnProps[];
  selectedRow: any;
  visible: boolean;
  selectedRowKeys: any;
}

@inject('global')
@observer
class Relation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false,
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
        }
      ],
      selectedRow: [],
      selectedRowKeys: []
    };
  }
  componentDidMount() {
    store.global.getRelationPage({
      data: {
        isRelation: 2,
        type: this.props.type,
        size: 1000,
        current: 1
      }
    });
  }
  onSelectChange = (selectedRowKeys: any, selectedRow: any) => {
    this.setState({
      selectedRow: selectedRow,
      selectedRowKeys: selectedRowKeys
    });
  };
  showDrawer = () => {
    this.setState(
      {
        visible: true,
        selectedRow: this.props.value,
        selectedRowKeys: this.props.value.map((item: any) => item.tourProductId)
      },
      () => {
        console.log(
          'selectedRow',
          this.state.selectedRow,
          this.state.selectedRowKeys
        );
      }
    );
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };
  CheckSelect = () => {
    this.setState(
      {
        visible: false
      },
      () => {
        this.props.onChange && this.props.onChange(this.state.selectedRow);
      }
    );
  };
  render() {
    const info = store.global.relationPage.records;
    const { selectedRow, selectedRowKeys } = this.state;
    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys,
      type: this.props.type === 1 ? 'checkbox' : 'radio'
    } as TableRowSelection<any>;
    const hasSelected = selectedRow.length > 0;
    return (
      <div>
        <Button style={{ marginLeft: 15 }} onClick={this.showDrawer}>
          关联旅游产品
        </Button>
        <Drawer
          title="关联旅游产品"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          width={700}
        >
          <div style={{ marginBottom: 16 }}>
            <Button onClick={this.CheckSelect} disabled={!hasSelected}>
              关联旅游产品
            </Button>
            <span style={{ marginLeft: 8 }}>
              {hasSelected ? `选择 ${selectedRow.length} 个` : ''}
            </span>
          </div>
          <Table
            rowKey={(record: any) => record.tourProductId}
            rowSelection={rowSelection}
            columns={this.state.columns}
            dataSource={info}
            pagination={{
              pageSize: 1000,
              hideOnSinglePage: true
            }}
          />
        </Drawer>
      </div>
    );
  }
}
export default Relation;

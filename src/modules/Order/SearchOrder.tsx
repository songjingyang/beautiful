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
  BackTop,
  Descriptions
} from 'antd';
import { ColumnProps, TableRowSelection, TableProps } from 'antd/es/table';
import { SorterResult } from 'antd/es/table';
import store from '../../models/index';
import { FormComponentProps } from 'antd/es/form';
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
interface Props {
  onClose: any;
  data: any;
}
interface State {
  columns: StandardTableColumnProps[];
  loading: boolean;
  pagination: TableListPagination;
  commentMaps: any;
  itemTypeMaps: any;
  subClass: any;
}
@inject('orders')
@observer
class SearchOrder extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      subClass: {
        1: '成人',
        2: '儿童',
        3: '婴儿'
      },
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
        {
          title: '状态',
          dataIndex: 'state',
          render: (text: number, record: any) => (
            <span>{this.state.commentMaps[text]}</span>
          )
        }
      ]
    };
  }
  componentDidMount() {
    store.orders.getSearchOrder({
      data: {
        runningNumber: this.props.data.runningNumber
      },
      callback: res => {
        if (res.code === 0) {
          this.setState({
            loading: false
          });
        }
      }
    });
  }

  render() {
    const info = store.orders.searchOrder;
    return (
      <Card title="查看订单" bordered={false} loading={this.state.loading}>
        <Descriptions title="">
          <Descriptions.Item label="订单编号" span={2}>
            {info.runningNumber}
          </Descriptions.Item>
          <Descriptions.Item label="旅游产品" span={2}>
            {info.name}
          </Descriptions.Item>
          {info.shoppingOrderDetails.map((item: any, index: number) => (
            <Descriptions.Item label="金额" key={item.id} span={3}>
              <span style={{ width: '100px', display: 'inline-block' }}>
                {item.nickName + '(' + this.state.subClass[item.subClass] + ')'}
              </span>
              <span style={{ marginLeft: '100px' }}>{'￥' + item.price}</span>
            </Descriptions.Item>
          ))}
          {info.shoppingParticipants.map((item: any, index: number) => (
            <Descriptions.Item key={item.id} label="出行人" span={3}>
              <span style={{ width: '100px', display: 'inline-block' }}>
                {item.name}
              </span>
              <span style={{ marginLeft: '100px' }}>
                {'电话:' + item.phone}
              </span>
            </Descriptions.Item>
          ))}

          <Descriptions.Item label="联系人" span={3}>
            <span style={{ width: '100px', display: 'inline-block' }}>
              {info.userContacts.name}
            </span>
            <span style={{ marginLeft: '100px' }}>
              {'电话:' + info.userContacts.phone}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  }
}
export default SearchOrder;

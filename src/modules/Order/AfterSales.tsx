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
  loading: boolean;
  commentMaps: any;
  itemTypeMaps: any;
  subClass: any;
}
@inject('orders')
@observer
class AfterSales extends React.Component<Props, State> {
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
      loading: true
    };
  }
  componentDidMount() {
    store.orders.getAfterSales({
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
    const info = store.orders.afterSales;
    return (
      <Card title="查看申请" bordered={false} loading={this.state.loading}>
        <Descriptions title="">
          <Descriptions.Item label="订单编号" span={3}>
            {info.runningNumber}
          </Descriptions.Item>
          <Descriptions.Item label="原因" span={3}>
            {info.reason}
          </Descriptions.Item>
          <Descriptions.Item label="电话" span={3}>
            {info.phone}
          </Descriptions.Item>
          <Descriptions.Item label="时间" span={3}>
            {info.createTime}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  }
}
export default AfterSales;

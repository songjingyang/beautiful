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
import Resource from '../../models/Resource';
import store from '../../models/index';
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
const Number2Data: any = {
  '0': '零',
  '1': '一',
  '2': '二',
  '3': '三',
  '4': '四',
  '5': '五',
  '6': '六',
  '7': '七',
  '8': '八',
  '9': '九'
};
const tirpType: any = {
  '1': '航空',
  '2': '铁路',
  '3': '包车'
};
const Products: any = [
  {
    name: '出行',
    type: '1'
  },
  {
    name: '酒店',
    type: '2'
  },
  {
    name: '城市',
    type: '3'
  },
  {
    name: '景点',
    type: '4'
  },
  {
    name: '餐厅',
    type: '5'
  },
  {
    name: '文本',
    type: '6'
  }
];
interface ItineraryProps {
  form: FormComponentProps['form'];
  onClose: any;
  data: any;
}
interface ItineraryState {
  columns: StandardTableColumnProps[];
  loading: boolean;
  visible: boolean;
  currItem: any;
  pagination: TableListPagination;
  dataSource: any;
}
@inject('resource')
@observer
class CheckItinerary extends React.Component<ItineraryProps, ItineraryState> {
  constructor(props: ItineraryProps) {
    super(props);
    this.state = {
      loading: true,
      visible: false,
      currItem: {},
      dataSource: [],
      pagination: {
        total: 20,
        pageSize: 20,
        current: 1
      },
      columns: [
        {
          title: '行程',
          dataIndex: 'days',

          render: (text: string, record: any) => (
            <div>{'第' + Number2Data[text] + '天'}</div>
          )
        },
        {
          title: '插入资源类型',
          dataIndex: 'type',
          render: (text: string, record: any) => (
            <span>
              {Products.map((item: any) => (
                <span>{item.type == text && item.name}</span>
              ))}
            </span>
          )
        },
        {
          title: '出行方式(非必选)',
          dataIndex: 'tirpType',
          render: (text: string, record: any) => <span>{tirpType[text]}</span>
        },
        {
          title: '资源内容',
          dataIndex: 'itemId',
          render: (text: string, record: any) => {
            const target = this.state.dataSource.find(
              (item: any) => item.id === text && item.type !== 6
            );
            return (
              <div>
                {target && (
                  <span>{target.type === 1 ? target.number : target.name}</span>
                )}
                {record.type === 6 && <span>{record.itemId}</span>}
              </div>
            );
          }
        }
      ]
    };
  }

  async componentDidMount() {
    await store.resource.getTripModePage({
      data: {}
    });
    await store.resource.getHotelPage({
      data: {}
    });
    await store.global.getCityList({
      data: {}
    });
    await store.resource.getScenicSpot({
      data: {}
    });
    await store.resource.getRestaurantPage({
      data: {}
    });
    await store.resource.getProductSingle({
      data: { id: this.props.data.id },
      callback: res => {
        if (res.code === 0) {
          this.setState(
            {
              loading: false
            },
            () => {
              const tripModePage = store.resource.tripModePage.records.map(
                (item: any, index: number) => {
                  return { ...item, type: 1 };
                }
              );
              const hotelPage = store.resource.hotelPage.records.map(
                (item: any, index: number) => {
                  return { ...item, type: 2 };
                }
              );
              const cityList = store.global.cityList.map(
                (item: any, index: number) => {
                  return { ...item, type: 3 };
                }
              );
              const scenicPage = store.resource.scenicPage.records.map(
                (item: any, index: number) => {
                  return { ...item, type: 4 };
                }
              );
              const restaurantPage = store.resource.restaurantPage.records.map(
                (item: any, index: number) => {
                  return { ...item, type: 5 };
                }
              );
              let dataAll = [
                ...tripModePage,
                ...hotelPage,
                ...cityList,
                ...scenicPage,
                ...restaurantPage
              ];
              this.setState({
                dataSource: dataAll
              });
            }
          );
        }
      }
    });
  }
  render() {
    const info = store.resource.productSingle;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Card title="查看行程" bordered={false} loading={this.state.loading}>
        <div className="tableList">
          <BackTop className="ant-back-top-inner" />
          <Col span={24}>
            <Table
              columns={this.state.columns}
              rowKey={'id' || 'key'}
              dataSource={info.baseProductDaysList}
              pagination={false}
              // onChange={this.handleTableChange}
            />
          </Col>
        </div>
      </Card>
    );
  }
}
export default Form.create<ItineraryProps>()(CheckItinerary);

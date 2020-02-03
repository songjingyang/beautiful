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
const Option = Select.Option;
const FormItem = Form.Item;
interface Props {
  onClose: any;
  data: any;
}
interface State {
  columns: StandardTableColumnProps[];
  visible: boolean;
  loading: boolean;
}

@inject('global')
@observer
class Products extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false,
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
              title="你确定删除吗？"
              icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
              okText="确认"
              cancelText="取消"
              onConfirm={() => this.EditProducts(record, 2)}
            >
              <a href="#" onClick={(e) => { e.preventDefault() }}>删除</a>
            </Popconfirm>
          )
        }
      ]
    };
  }
  componentDidMount() {
    this.getProduct();
  }
  getProduct = () => {
    store.global.getRelationPage({
      data: {
        itemId: this.props.data.id,
        isRelation: 1,
        type: 1,
        size: 1000,
        current: 1
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
  EditProducts = (record: any, state: number) => {
    store.global.EditProducts({
      data: {
        tourProductId: record.tourProductId,
        itemId: this.props.data.id,
        isRelation: state,
        type: 1
      },
      callback: res => {
        if (res.code === 0) {
          message.success(res.msg || '操作成功');
          this.getProduct();
        } else {
          message.error(res.msg || '操作失败');
        }
      }
    });
  };
  render() {
    const info = store.global.relationPage.records;
    return (
      <Card title="关联旅游产品" bordered={false} loading={this.state.loading}>
        <div>
          <Table
            rowKey={(record: any) => record.tourProductId}
            columns={this.state.columns}
            dataSource={info}
            pagination={{
              pageSize: 1000,
              hideOnSinglePage: true
            }}
          />
        </div>
      </Card>
    );
  }
}
export default Products;

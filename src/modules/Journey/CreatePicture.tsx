import React, { KeyboardEvent, ReactElement, Component } from 'react';
import {
  Form,
  Select,
  InputNumber,
  Switch,
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
  Popconfirm,
  Radio,
  Badge,
  Calendar,
  Drawer
} from 'antd';
import PreviewImg from '../../components/PreviewImg';
import store from '../../models/index';
import { getQueryString } from '../../utils/utils';
import { FormComponentProps } from 'antd/lib/form';
import { StandardTableColumnProps } from '../Table';
import { observer, inject } from 'mobx-react';
interface Props {
  onClose: any;
  data: any;
}
interface State {
  columns: StandardTableColumnProps[];
  // dataChange: any
  loading: boolean;
}
@inject('travels')
@observer
export default class ShowPicture extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      columns: [
        {
          title: '资源',
          dataIndex: 'url',
          render: (text: string, record: any) =>
            record.format === 1 ? (
              <PreviewImg alt="url" src={text} />
            ) : (
              <video style={{ width: 200 }} src={text} controls />
            )
        },
        {
          title: '资源宽度',
          dataIndex: 'wide',
          render: (text: string, record: any) => <span></span>
        },
        {
          title: '资源高度',
          dataIndex: 'high',
          render: (text: string, record: any) => (
            <span>{/* {getQueryString("height", record.url)} */}</span>
          )
        }
      ]
    };
  }

  componentDidMount() {
    this.getPicturePage();
  }
  getPicturePage = () => {
    store.travels.getTravelsSingle({
      data: {
        id: this.props.data.id
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
  render() {
    const info = store.travels.travelsSingle;
    return (
      <Card title="资源" bordered={false} loading={this.state.loading}>
        <Table
          columns={this.state.columns}
          bordered={false}
          dataSource={info.userMaterialList}
          pagination={false}
        />
      </Card>
    );
  }
}

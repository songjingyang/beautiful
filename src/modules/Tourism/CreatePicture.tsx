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
}
@inject('tourisms')
@observer
export default class ShowPicture extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '图片',
          dataIndex: 'url',
          render: (text: string, record: any) =>
            record.format === 1 ? (
              <PreviewImg alt="url" src={text} />
            ) : (
              <video style={{ width: 200 }} src={text} controls />
            )
        },
        {
          title: '图片宽度',
          dataIndex: 'wide'
        },
        {
          title: '图片高度',
          dataIndex: 'high'
        },
        {
          title: '操作',
          dataIndex: 'play',
          render: (text: string, record: any) => {
            return (
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
            );
          }
        }
      ]
    };
  }
  DeleteSingle = (record: any) => {
    store.tourisms.DeleteImage({
      data: {
        id: record.id
      },
      callback: res => {
        if (res.code === 0) {
          message.success('删除成功');
          this.getPicturePage();
        } else {
          message.success('删除失败');
        }
      }
    });
  };
  componentDidMount() {
    this.getPicturePage();
  }
  getPicturePage = () => {
    store.tourisms.getOwnPictures({
      data: {
        itemId: this.props.data.id,
        current: 1,
        size: 100,
        type: 4
        // format: 1,//图片
      }
    });
  };
  render() {
    const info = store.tourisms.ownPicturePage;
    return (
      <Card title="图集" bordered={false}>
        <Table
          columns={this.state.columns}
          bordered={false}
          dataSource={info.records}
          pagination={false}
        />
      </Card>
    );
  }
}

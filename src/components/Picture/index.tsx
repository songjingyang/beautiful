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
  Drawer
} from 'antd';
import { ColumnProps, TableRowSelection, TableProps } from 'antd/es/table';
import { SorterResult } from 'antd/es/table';
import { FormComponentProps } from 'antd/es/form';
import Resource from '../../models/Resource';
import PreviewImg from '../../components/PreviewImg';
import store from '../../models/index';
import {
  StandardTableColumnProps,
  TableListParams,
  TableListData,
  TableListPagination,
  TableListItem
} from '../../modules/Table';
import { inject, observer } from 'mobx-react';
const FormItem = Form.Item;
const Option = Select.Option;
interface PictureProps {
  form: FormComponentProps['form'];
  onChange: any;
  type: string;
  city?: any;
}
interface PictureState {
  columns: StandardTableColumnProps[];
  loading: boolean;
  visible: boolean;
  currItem: any;
  pagination: TableListPagination;
  type: {
    [index: string]: string;
  };
  selectedRowKeys: any[];
  selectedRows: any[];
}
@inject('resource', 'global')
@observer
class Picture extends React.Component<PictureProps, PictureState> {
  constructor(props: PictureProps) {
    super(props);
    this.state = {
      loading: true,
      visible: false,
      currItem: {},
      selectedRowKeys: [],
      selectedRows: [],
      pagination: {
        total: 20,
        pageSize: 10,
        current: 1
      },
      type: {
        2: '酒店',
        3: '城市',
        4: '景点',
        5: '餐厅'
      },
      columns: [
        {
          title: '图片',
          dataIndex: 'url',
          render: (text: string) => {
            return this.props.type === '1' ? (
              <PreviewImg alt={'img'} src={text} />
            ) : (
              <video style={{ width: 200 }} src={text}></video>
            );
          }
        },
        {
          title: '分类',
          dataIndex: 'type',
          render: (text: string, record: any) => (
            <span>{this.state.type[text]}</span>
          )
        },
        {
          title: '城市',
          dataIndex: 'city'
        },
        {
          title: '景点/酒店/餐厅',
          dataIndex: 'itemId'
        }
      ]
    };
  }
  componentDidMount() {
    this.props.city && this.getPicturePage();
  }
  getPicturePage = (params: any = {}) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let payload = {
          ...values
        };
        if (!params.page) {
          params.page = 1;
        }
        if (params.page === 1) {
          params.ts = new Date().valueOf();
        }
        // else {
        //   params.ts = this.props.message.messagePage.ts;
        // }
        if (!params.page_size) {
          params.page_size = 20;
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
        this.props.type === '1'
          ? store.resource.getPicturePage({
              data: {
                ...payload,
                city: this.props.city,
                size: 10000,
                current: 1
              },

              callback: res => {
                if (res.code === 0) {
                  this.setState({
                    loading: false
                  });
                }
              }
            })
          : store.resource.getVideoPage({
              data: {
                ...payload,
                city: this.props.city,
                size: 10000,
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
      } else {
        console.log('getPicturePage error');
      }
    });
  };
  showDrawer = () => {
    this.getPicturePage();
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };
  onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
    console.log('selectedRowKeys changed: ', selectedRows);
    this.setState({ selectedRowKeys, selectedRows });
  };
  handleChange = () => {
    this.setState(
      {
        visible: false
      },
      () => {
        this.props.onChange && this.props.onChange(this.state.selectedRows);
      }
    );
  };
  render() {
    console.log('TCL: render -> this.props.city', this.props.city);
    const selectedRows = this.state;
    const rowSelection = {
      selectedRows,
      onChange: this.onSelectChange
    };
    const info =
      this.props.type === '1'
        ? store.resource.picturePage
        : store.resource.videoPage;
    const hasSelected = this.state.selectedRows.length > 0;
    return (
      <div style={{ marginTop: '4px' }}>
        <Button onClick={this.showDrawer}>选择资源</Button>
        <Drawer
          title={this.props.type === '1' ? '图片资源' : '视频资源'}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          width={700}
        >
          <Button
            type="primary"
            onClick={this.handleChange}
            disabled={!hasSelected}
          >
            {this.props.type === '1' ? '添加图片' : '添加资源 '}
          </Button>
          <Table
            columns={this.state.columns}
            rowKey={'id' || 'key'}
            dataSource={info.records}
            pagination={false}
            rowSelection={rowSelection}
          />
        </Drawer>
      </div>
    );
  }
}
export default Form.create<PictureProps>()(Picture);

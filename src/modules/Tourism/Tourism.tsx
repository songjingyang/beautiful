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
import Tourisms from '../../models/Tourism';
import Global from '../../models/Global';
import {
  StandardTableColumnProps,
  TableListParams,
  TableListData,
  TableListPagination,
  TableListItem
} from '../Table';
import CreateTourism from './CreateTourism';
import CalendarPrice from './CalendarPrice';
import { inject, observer } from 'mobx-react';
import ShowPicture from './CreatePicture';
const FormItem = Form.Item;
const Option = Select.Option;
interface TourismProps {
  form: FormComponentProps['form'];
  tourisms: Tourisms;
  global: Global;
}
interface TourismState {
  columns: StandardTableColumnProps[];
  loading: boolean;
  visible: boolean;
  currItem: any;
  pagination: TableListPagination;
  recommendMaps: any;
  statusMaps: any;
  isShow: boolean;
  dataShow: any;
  calendarData: any;
  showCalendar: boolean;
}
@inject('tourisms', 'global')
@observer
class Tourism extends React.Component<TourismProps, TourismState> {
  constructor(props: TourismProps) {
    super(props);
    this.state = {
      loading: true,
      visible: false,
      currItem: {},
      isShow: false,
      dataShow: {},
      calendarData: {},
      showCalendar: false,
      statusMaps: {
        1: '上架',
        2: '下架'
      },
      recommendMaps: {
        0: '不推荐',
        1: '推荐'
      },
      pagination: {
        total: 20,
        pageSize: 20,
        current: 1
      },
      columns: [
        {
          title: '产品名称',
          dataIndex: 'title'
        },
        {
          title: '所属标签',
          dataIndex: 'tagId'
        },
        {
          title: '图片',
          dataIndex: 'star',
          render: (text: string, record: any) => (
            <span>
              {record.bmMaterialCount}个
              <a
                href="javascript:void(0);"
                onClick={() => this.ShowPicture(record)}
              >
                查看
              </a>
            </span>
          )
        },
        {
          title: '出团日期/价格',
          dataIndex: 'start',
          render: (text: string, record: any) => (
            <a
              href="javascript:void(0);"
              onClick={() => this.CalendarPrice(record)}
            >
              查看
            </a>
          )
        },
        {
          title: '上架时间',
          dataIndex: 'startTime'
        },
        {
          title: '下架时间',
          dataIndex: 'endTime'
        },
        {
          title: '推荐',
          dataIndex: 'recommend',
          render: (text: string, record: any) => (
            <span>{this.state.recommendMaps[text]}</span>
          )
        },
        {
          title: '状态',
          dataIndex: 'state',
          render: (text: string, record: any) => (
            <span>{this.state.statusMaps[text]}</span>
          )
        },
        {
          title: '操作',
          dataIndex: 'play',
          render: (text: string, record: any) => (
            <span>
              {/* <Popconfirm
                title="你确定启用吗？"
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                okText="确认"
                cancelText="取消"
                onConfirm={() => this.EnableShutdown(record)}
              >
                <a href="#" onClick={(e) => { e.preventDefault() }}>启用</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title="你确定停用吗？"
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                okText="确认"
                cancelText="取消"
                onConfirm={() => this.EnableShutdown(record)}
              >
                <a href="#" onClick={(e) => { e.preventDefault() }}>停用</a>
              </Popconfirm>
              <Divider type="vertical" /> */}
              <a
                href="javascript:void(0);"
                onClick={() => this.CreateHotel(record)}
              >
                编辑
              </a>
              <Divider type="vertical" />
              {/* <Popconfirm
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
              <Divider type="vertical" /> */}
              <Popconfirm
                title={`设置为热门推荐？`}
                icon={
                  <Icon type="question-circle-o" style={{ color: 'red' }} />
                }
                okText="确认"
                cancelText="取消"
                onConfirm={() =>
                  this.SetRecommend(record, record.recommend === 0 ? 1 : 0)
                }
              >
                <a href="#" onClick={(e) => { e.preventDefault() }}>
                  {record.recommend === 0 ? '设为推荐' : '取消推荐'}
                </a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title={`设置上/下架？`}
                icon={
                  <Icon type="question-circle-o" style={{ color: 'red' }} />
                }
                okText="确认"
                cancelText="取消"
                onConfirm={() => this.isUp(record, record.state === 2 ? 1 : 2)}
              >
                <a href="#" onClick={(e) => { e.preventDefault() }}>
                  {record.state === 2 ? '上架' : '下架'}
                </a>
              </Popconfirm>
            </span>
          )
        }
      ]
    };
  }
  componentDidMount() {
    this.getTourismPage();
  }
  SetRecommend = (record: any, state: number) => {
    this.props.tourisms.EditRecommend({
      data: {
        id: record.id,
        recommend: state
      },
      callback: res => {
        if (res.code === 0) {
          message.success('操作成功');
          this.getTourismPage();
        }
      }
    });
  };
  isUp = (record: any, state: number) => {
    this.props.tourisms.EditUpDown({
      data: {
        id: record.id,
        state: state
      },
      callback: res => {
        if (res.code === 0) {
          this.getTourismPage();
        }
      }
    });
  };
  getTourismPage = (params: any = {}) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let payload = {
          ...values
        };
        if (!params.current) {
          params.current = 1;
        }
        // if (params.current === 1) {
        //   params.ts = new Date().valueOf();
        // }
        // else {
        //   params.ts = this.props.message.messagePage.ts;
        // }
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
        this.props.tourisms.getTourismPage({
          data: {
            ...payload
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
        console.log('getTourismPage error');
      }
    });
  };
  DeleteSingle = (record: { id: string }) => {
    this.props.tourisms.DeleteTourism({
      data: {
        id: record.id
      },
      callback: res => {
        if (res.code === 0) {
          message.success(res.msg || '操作成功');
          this.getTourismPage();
        } else {
          message.error(res.msg || '操作失败');
        }
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
  CalendarPrice = (item?: any) => {
    this.isCalendarPrice(true);
    this.setState({
      calendarData: item
    });
  };
  isCalendarPrice = (bool: boolean) => {
    this.setState({
      showCalendar: bool
    });
  };
  ShowPicture = (item?: any) => {
    this.isShowPicture(true);
    this.setState({
      dataShow: item
    });
  };
  isShowPicture = (bool: boolean) => {
    this.setState({
      isShow: bool
    });
  };
  isCreateHotel = (bool: boolean) => {
    this.setState({
      visible: bool
    });
  };
  CreateHotel = (item?: any) => {
    this.isCreateHotel(true);
    this.setState({
      currItem: item
    });
  };
  PropsInfo = (bool: boolean) => {
    this.isCreateHotel(false);
    this.isShowPicture(false);
    this.isCalendarPrice(false);
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
    this.getTourismPage({
      size: pagination.pageSize,
      current: pagination.current
    });
    window.scroll(0, 0);
  };
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getTourismPage(values);
      }
    });
  };
  render() {
    const info = this.props.tourisms.tourismPage;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const { getFieldDecorator } = this.props.form;
    const CityList = this.props.global.cityList;
    return (
      <Card title="旅游产品管理" bordered={false} loading={this.state.loading}>
        {this.state.visible && (
          <Modal
            visible={this.state.visible}
            width={1300}
            onCancel={() => this.isCreateHotel(false)}
            footer={null}
          >
            <CreateTourism
              data={this.state.currItem}
              onClose={() => {
                this.PropsInfo(false);
                this.getTourismPage({
                  size: this.state.pagination.pageSize,
                  current: this.state.pagination.current
                });
              }}
            />
          </Modal>
        )}
        {this.state.isShow && (
          <Modal
            visible={this.state.isShow}
            width={1300}
            onCancel={() => this.isShowPicture(false)}
            footer={null}
          >
            <ShowPicture
              data={this.state.dataShow}
              onClose={() => {
                this.PropsInfo(false);
                this.getTourismPage({
                  size: this.state.pagination.pageSize,
                  current: this.state.pagination.current
                });
              }}
            />
          </Modal>
        )}
        {this.state.showCalendar && (
          <Modal
            visible={this.state.showCalendar}
            width={1300}
            onCancel={() => this.isCalendarPrice(false)}
            footer={null}
          >
            <CalendarPrice
              data={this.state.calendarData}
              onClose={() => {
                this.PropsInfo(false);
                this.getTourismPage({
                  size: this.state.pagination.pageSize,
                  current: this.state.pagination.current
                });
              }}
            />
          </Modal>
        )}
        <div className="tableList">
          <BackTop className="ant-back-top-inner" />
          <Form onSubmit={this.handleSubmit}>
            <Row
              gutter={{ md: 8, lg: 24, xl: 48 }}
              style={{ marginTop: '20px' }}
            >
              <Col xl={10} md={24} sm={24}>
                <FormItem
                  label="旅游产品名称"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('title')(
                    <Input placeholder="旅游产品名称" />
                  )}
                </FormItem>
              </Col>
              <Col xl={10} md={24} sm={24}>
                <FormItem
                  label="搜索状态"
                  {...formItemLayout}
                  className="form-inline-item"
                >
                  {getFieldDecorator('state')(
                    <Select style={{ width: 200 }} placeholder="请选择搜索状态">
                      <Option value={1}>上架</Option>
                      <Option value={2}>下架</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col
                xl={10}
                md={24}
                sm={24}
                offset={2}
                style={{ marginBottom: '10px' }}
              >
                <div className="submitButtons">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="listsearch"
                  >
                    查询
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
          <Col xl={12} md={24} sm={24} style={{ marginBottom: '10px' }}>
            <Button
              type="primary"
              htmlType="submit"
              className="listsearch"
              onClick={() => {
                this.CreateHotel();
              }}
            >
              添加旅游产品
            </Button>
          </Col>
          <Col span={24}>
            <Table
              columns={this.state.columns}
              rowKey={'id' || 'key'}
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
          </Col>
        </div>
      </Card>
    );
  }
}
export default Form.create<TourismProps>()(Tourism);

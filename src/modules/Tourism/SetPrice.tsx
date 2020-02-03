import React, { KeyboardEvent, ReactElement, Component } from 'react';
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
  Drawer,
  Calendar,
  Badge
} from 'antd';
import moment, { localeData } from 'moment';
import urlMaps from '../../common/urlMaps';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { FormComponentProps } from 'antd/es/form';
import NewBraft from '../../components/BraftEditor';
import store from '../../models/index';
import BraftEditor, { EditorState } from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import '../../components/BraftEditor/index.less';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const RadioButton = Radio.Button;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const { Dragger } = Upload;
interface Props {
  form: FormComponentProps['form'];
  // changeList?(url: any): void,
  value?: any;
  data: any;
  content: any;
}
interface State {
  status: boolean;
  visible: boolean;
  localDate: string;
  CalendarDate: any;
  listData: any[];
}
@inject('tourisms')
// @observer
class SetPrice extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      status: true,
      visible: false,
      localDate: '',
      CalendarDate: {},
      listData: []
    };
  }
  componentDidMount() {}
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        store.tourisms.EditPrice(
          { ...values, data: this.state.localDate },
          this.props.content
        );
        this.props.form.resetFields();
        this.setState({
          visible: false
        });
      }
    });
  };
  dateCellRender = (value: any) => {
    const type = this.props.content.type;
    const period = this.props.content.period;
    const dataPicker = moment(value.valueOf()).day();
    const dataShow =
      moment(value.valueOf()).format('YYYY-MM-DD') >=
        this.props.content.startTime &&
      moment(value.valueOf()).format('YYYY-MM-DD') <=
        this.props.content.endTime;
    const num = moment(value.valueOf()).get('D');
    let target: any;
    let isShow: boolean;
    if (type === '1') {
      target = store.tourisms.tourismSingle.bmTourProductDaysList[0];
    } else if (type === '2' && period === 1) {
      target = store.tourisms.tourismSingle.bmTourProductDaysList.find(
        item => moment(item.data).day() === dataPicker
      );
    } else if (type === '2' && period === 2) {
      target = store.tourisms.tourismSingle.bmTourProductDaysList.find(
        item => moment(item.data).get('D') === num
      );
    } else if (type === '3') {
      target = store.tourisms.tourismSingle.bmTourProductDaysList.find(
        item => moment(value.valueOf()).format('YYYY-MM-DD') === item.data
      );
    }
    if (this.props.content.startTime && this.props.content.endTime) {
      if (
        moment(value).format('YYYY-MM-DD') >=
          moment(this.props.content.startTime).format('YYYY-MM-DD') &&
        moment(value).format('YYYY-MM-DD') <=
          moment(this.props.content.endTime).format('YYYY-MM-DD')
      ) {
        isShow = true;
      } else {
        isShow = false;
      }
    } else {
      isShow = true;
    }
    // console.log("TCL: SetPrice -> dateCellRender -> target", target)
    // console.log("TCL: SetPrice -> dateCellRender -> isShow", isShow)
    return target && isShow ? (
      <ul className="events">
        <li key={target.data}>
          <div style={{ fontSize: '12px' }}>
            <div>
              <span>成人价:</span>
              <span>{target.price}元</span>
            </div>
            <div>
              <span>儿童价:</span>
              <span>{target.childrenPrice}元</span>
            </div>
            <div>
              <span>婴儿价:</span>
              <span>{target.babyPrice}元</span>
            </div>
          </div>
        </li>
      </ul>
    ) : null;
  };
  onSelect = (value: any) => {
    this.setState(
      {
        localDate: moment(value.valueOf()).format('YYYY-MM-DD')
      },
      () => {
        let target;
        const type = store.tourisms.tourismSingle.type;
        const period = store.tourisms.tourismSingle.period;
        const dataPicker = moment(value.valueOf()).day();
        const num = moment(value.valueOf()).get('D');
        if (type === '1') {
          target = store.tourisms.tourismSingle.bmTourProductDaysList[0];
        } else if (type === '2' && period === 1) {
          target = store.tourisms.tourismSingle.bmTourProductDaysList.find(
            item => moment(item.data).day() === dataPicker
          );
        } else if (type === '2' && period === 2) {
          target = store.tourisms.tourismSingle.bmTourProductDaysList.find(
            item => moment(item.data).get('D') === num
          );
        } else if (type === '3') {
          target = store.tourisms.tourismSingle.bmTourProductDaysList.find(
            item => moment(value.valueOf()).format('YYYY-MM-DD') === item.data
          );
        }

        this.props.form.setFieldsValue({
          data: this.state.localDate === target ? target.data : 0,
          price: this.state.localDate === target ? target.price : 0,
          childrenPrice:
            this.state.localDate === target ? target.childrenPrice : 0,
          babyPrice: this.state.localDate === target ? target.babyPrice : 0
        });
      }
    );
    this.showDrawer();
  };
  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };
  handleDate = (current: any) => {
    if (this.props.content.startTime && this.props.content.endTime) {
      if (
        moment(current).format('YYYY-MM-DD') >=
          moment(this.props.content.startTime).format('YYYY-MM-DD') &&
        moment(current).format('YYYY-MM-DD') <=
          moment(this.props.content.endTime).format('YYYY-MM-DD')
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    return (
      <div style={{ width: 800, border: '1px solid #d9d9d9', borderRadius: 4 }}>
        <Calendar
          dateCellRender={this.dateCellRender}
          onSelect={this.onSelect}
          disabledDate={this.handleDate}
        />
        <Drawer
          title="设置价格"
          placement="right"
          closable={false}
          onClose={this.onClose}
          width={500}
          visible={this.state.visible}
        >
          <Form onSubmit={this.handleSubmit}>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="成人价格"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('price', {
                  initialValue: 0,
                  rules: [
                    {
                      required: true,
                      message: '成人价格'
                    }
                  ]
                })(
                  <InputNumber
                    style={{ width: 150 }}
                    placeholder="请输入成人价格"
                  />
                )}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="儿童价格"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('childrenPrice', {
                  initialValue: 0,
                  rules: [
                    {
                      required: true,
                      message: '儿童价格'
                    }
                  ]
                })(
                  <InputNumber
                    style={{ width: 150 }}
                    placeholder="请输入儿童价格"
                  />
                )}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="婴儿价格"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('babyPrice', {
                  initialValue: 0,
                  rules: [
                    {
                      required: true,
                      message: '婴儿价格'
                    }
                  ]
                })(
                  <InputNumber
                    style={{ width: 150 }}
                    placeholder="请输入婴儿价格"
                  />
                )}
              </FormItem>
            </Col>
            <Col xl={12} md={24} sm={24} offset={6}>
              <div className="submButtons">
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
              </div>
            </Col>
          </Form>
        </Drawer>
      </div>
    );
  }
}
export default Form.create<Props>()(SetPrice);

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
import moment from 'moment';
interface Props {
  onClose: any;
  data: any;
}
interface State {
  dataSource: any;
}
@inject('tourisms')
@observer
class CalendarPrice extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      dataSource: []
    };
  }
  componentDidMount() {
    this.getCalendarPrice();
  }
  getCalendarPrice = () => {
    store.tourisms.getCalendarPrice({
      data: {
        tourProductId: this.props.data.id,
        current: 1,
        size: 1000

        // format: 1,//图片
      },
      callback: res => {
        this.setState({
          dataSource: res.data.records
        });
      }
    });
  };
  dateCellRender = (value: any) => {
    const dataPicker = moment(value.valueOf()).format('YYYY-MM-DD');
    const dataShow = this.state.dataSource.find(
      (item: any) => item.data === dataPicker
    );
    return dataShow ? (
      <ul className="events">
        <li key={dataShow.data}>
          <div style={{ fontSize: '12px' }}>
            <div>
              <span>成人价:</span>
              <span>{dataShow.price}元</span>
            </div>
            <div>
              <span>儿童价:</span>
              <span>{dataShow.childrenPrice}元</span>
            </div>
            <div>
              <span>婴儿价:</span>
              <span>{dataShow.babyPrice}元</span>
            </div>
          </div>
        </li>
      </ul>
    ) : null;
  };
  render() {
    return (
      <Card title="出团日期/价格" bordered={false}>
        <Calendar dateCellRender={this.dateCellRender} />
      </Card>
    );
  }
}
export default CalendarPrice;

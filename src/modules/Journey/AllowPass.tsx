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
  Carousel,
  Typography
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
import { previewImage } from 'antd/lib/upload/utils';
const Option = Select.Option;
const FormItem = Form.Item;
const { Title } = Typography;
const { Text } = Typography;
interface Props {
  data: any;
  onClose: any;
}
interface State {
  loading: boolean;
}
@inject('global')
@observer
class AllowPass extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true
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
  ChangeAllow = (id: any, state: any) => {
    store.travels.EditTravelsState({
      data: {
        id: id,
        state: state
      },
      callback: res => {
        if (res.code === 0) {
          message.success('操作成功!');
          this.props.onClose();
        } else {
          message.error('操作失败!');
          this.props.onClose();
        }
      }
    });
  };
  render() {
    const info = store.travels.travelsSingle;
    return (
      <Card title={'审核内容'} bordered={false}>
        <Row gutter={16}>
          {info.userMaterialList.map((item: any) => (
            <Col className="gutter-row" span={6}>
              {item.format === 1 && (
                <PreviewImg
                  src={item.url}
                  alt="img"
                  styleType={['200px', '200px']}
                />
              )}
              {item.format === 2 && (
                <video
                  style={{ height: '200px', width: '200px' }}
                  src={item.url}
                  controls
                ></video>
              )}
            </Col>
          ))}
        </Row>
        <Title level={2}>游记内容</Title>
        <div style={{ marginBottom: 40 }}>
          <Text>{info.content}</Text>
        </div>
        {(info.state === 2 || info.state === 0) && (
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: 850 }}
            onClick={() => this.ChangeAllow(this.props.data.id, 1)}
          >
            通过
          </Button>
        )}
        {info.state === 0 && (
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => this.ChangeAllow(this.props.data.id, 2)}
          >
            拒绝
          </Button>
        )}
      </Card>
    );
  }
}
export default AllowPass;

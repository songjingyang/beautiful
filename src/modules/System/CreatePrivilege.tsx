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
  Tree
} from 'antd';
import moment from 'moment';
import urlMaps from '../../common/urlMaps';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { FormComponentProps } from 'antd/es/form';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const RadioButton = Radio.Button;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const { Dragger } = Upload;
const { TreeNode } = Tree;
const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' }
        ]
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' }
        ]
      },
      {
        title: '0-0-2',
        key: '0-0-2'
      }
    ]
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' }
    ]
  },
  {
    title: '0-2',
    key: '0-2'
  }
];
interface PrivilegeProps {
  form: FormComponentProps['form'];
  // onClose: any;
  data: any;
}
interface State {
  status: boolean;
  fileList: any;
  expandedKeys: any;
  autoExpandParent: boolean;
  checkedKeys: any;
  selectedKeys: any;
}
// @Form.create()
// @inject('mito')
// @observer
class CreatePrivilege extends Component<PrivilegeProps, State> {
  constructor(props: PrivilegeProps) {
    super(props);
    this.state = {
      status: true,
      fileList: [],
      expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: true,
      checkedKeys: ['0-0-0'],
      selectedKeys: []
    };
  }
  componentDidMount() {}
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     const { cover_http, imgs_http, ...data_list } = values
    //     this.props.data.id ?
    //       this.props.mito.EditMito({
    //         data: {
    //           ...data_list,
    //           id: this.props.data.id,
    //           imgs: values.imgs.split("\n").filter((item: any) => item !== "")
    //         },
    //         callback: res => {
    //           if (res.code === 200) {
    //             message.success('保存成功');
    //             if (this.props.onClose) {
    //               this.props.onClose();
    //             }
    //           }
    //         },
    //       }) :
    //       this.props.mito.CreateMito({
    //         data: {
    //           ...data_list,
    //           imgs: values.imgs.split("\n").filter((item: any) => item !== "")
    //         },
    //         callback: res => {
    //           if (res.code === 200) {
    //             message.success('保存成功');
    //             if (this.props.onClose) {
    //               this.props.onClose();
    //             }
    //           }
    //         },
    //       })
    //   }
    // });
  };
  onExpand = (expandedKeys: any) => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  };

  onCheck = (checkedKeys: any) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys: any, info: any) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  };

  renderTreeNodes = (data: any) =>
    data.map((item: any) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });
  render() {
    const { getFieldDecorator } = this.props.form;
    const isEdit = this.props.data;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    let baseUrl =
      window.location.protocol +
      '//' +
      document.domain +
      ':' +
      window.location.port +
      '/api';
    return (
      <Card
        bordered={false}
        title={isEdit ? '编辑权限' : '添加权限'}
        className="CreateMito"
      >
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="权限名称"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('title', {
                  // initialValue: isEdit ? info_default.title : "",
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '权限名称'
                    }
                  ]
                })(<Input placeholder="请输入权限名称" />)}
              </FormItem>
            </Col>
            <Col xl={24} md={24} sm={24}>
              <FormItem
                label="权限设置"
                {...formItemLayout}
                className="form-inline-item"
              >
                {getFieldDecorator('title', {
                  // initialValue: isEdit ? info_default.title : "",
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '权限设置'
                    }
                  ]
                })(
                  <Tree
                    checkable
                    onExpand={this.onExpand}
                    expandedKeys={this.state.expandedKeys}
                    autoExpandParent={this.state.autoExpandParent}
                    onCheck={this.onCheck}
                    checkedKeys={this.state.checkedKeys}
                    onSelect={this.onSelect}
                    selectedKeys={this.state.selectedKeys}
                  >
                    {this.renderTreeNodes(treeData)}
                  </Tree>
                )}
              </FormItem>
            </Col>

            <Col xl={12} md={24} sm={24} offset={6}>
              <div className="submitButtons">
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

export default Form.create<PrivilegeProps>()(CreatePrivilege);

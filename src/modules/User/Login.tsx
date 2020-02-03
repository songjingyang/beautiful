import React, { KeyboardEvent, ReactElement } from 'react';
import { Form, Icon, Input, Button, Checkbox, Row, Col, message } from 'antd';
import {
  WrappedFormUtils,
  FormComponentProps,
  RcBaseFormProps
} from 'antd/lib/form/Form';
var urlencode = require('urlencode');
import { Encrypt } from '../../utils/utils';
import urlMaps, { baseUrl } from '../../common/urlMaps';
import { inject, observer } from 'mobx-react';
import { match } from 'react-router';
import { Link } from 'react-router-dom';
import { History } from 'history';
import User from '../../models/User';
import './UserLogin.less';
const FormItem = Form.Item;
interface LoginProps extends FormComponentProps {
  form: WrappedFormUtils;
  history: History;
  user: User;
}
interface State {
  status: boolean;
  code: string;
}
@inject('user')
@observer
class Login extends React.Component<LoginProps, State> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      status: true,
      code: new Date().getTime().toString()
    };
  }
  componentDidMount() {
    // localStorage.getItem('user_cloud') ? setTimeout(() => {
    //   localStorage.removeItem('user_cloud')
    //   window.location.reload()
    // }, 0) : null
    setTimeout(() => {
      this.changeCode();
    }, 500);
  }
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.user.login({
          data: {
            randomStr: this.state.code,
            grant_type: 'password',
            scope: 'server',
            type: '2',
            ...values,
            password: values.password
            // Encrypt(values.password)
          },
          callback: res => {
            console.log('TCL: Login -> handleSubmit -> res', res);
            if (res.code === '0' || res.code === 0) {
              // this.props.history.push('/admin/client');
              this.props.history.push('/resources/basehotel');
            } else {
              this.changeCode();
            }
          }
        });
      }
    });
  };
  handleChange = () => {
    this.setState({
      status: false
    });
  };

  changeCode = () => {
    this.setState({
      code: new Date().getTime().toString()
    });
  };
  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col xl={24} md={24} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('username', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '用户名格式不正确'
                    // pattern: /^1[34578]\d{9}$/,
                  }
                ]
              })(
                <Input
                  size="large"
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="请输入用户名"
                  readOnly={this.state.status}
                  onFocus={this.handleChange}
                />
              )}
            </FormItem>
          </Col>
          <Col xl={24} md={24} sm={24}>
            <FormItem label="密码">
              {getFieldDecorator('password', {
                initialValue: '',
                rules: [{ required: true, message: '请输入密码' }]
              })(
                <Input.Password
                  size="large"
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="请输入密码"
                  readOnly={this.state.status}
                  onFocus={this.handleChange}
                />
              )}
            </FormItem>
          </Col>
          <Col xl={24} md={24} sm={24}>
            <FormItem label="验证码">
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '请输入验证码' }]
              })(
                <Input
                  size="large"
                  prefix={
                    <Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="verification"
                  placeholder="请输入验证码"
                />
              )}
            </FormItem>
          </Col>
          <Col xl={24} md={24} sm={24}>
            <FormItem>
              <img
                src={
                  baseUrl + urlMaps.getCode + '?randomStr=' + this.state.code
                }
                style={{ width: '150px', height: '60px' }}
                title="点击刷新"
                onClick={this.changeCode}
                alt=""
              />
            </FormItem>
          </Col>
          <Col xl={24} md={24} sm={24}>
            <FormItem>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create<LoginProps>()(Login);

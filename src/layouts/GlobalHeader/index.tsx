import React, { Fragment } from 'react';
import {
  Form,
  Menu,
  Icon,
  Spin,
  Tag,
  Dropdown,
  Avatar,
  Divider,
  Tooltip
} from 'antd';
import { Link, withRouter } from 'react-router-dom';
import './index.less';
import { ClickParam } from 'antd/lib/menu';
import { inject, observer } from 'mobx-react';
import User from '../../models/User';
interface Props {
  user: User;
}

interface State {}

@inject('user')
@observer
export default class GlobalHeader extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  onMenuClick = (params: ClickParam) => {
    const key = params.key;
    if (key === 'triggerError') {
      return;
    }
    if (key === 'logout') {
      this.props.user.logout({
        data: {},
        callback: res => {
          if (res.code === 0) {
            window.location.href = '/user/login';
          }
        }
      });
    }
    if (key === 'editpass') {
    }
  };
  render() {
    const currentUser = JSON.parse(localStorage.getItem('user_cloud') || '');
    const menu = (
      <Menu className="menu" selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item disabled>
          <Icon type="user" />
          个人中心
        </Menu.Item>
        {/* <Menu.Item key="editpass">
          <Link to={`/user/edit`}>
            <Icon type="edit" />
            修改密码
          </Link>
        </Menu.Item>
        <Menu.Item key="download">
          <Link to={`/user/download`}>
            <Icon type="download" />
            APP下载
          </Link>
        </Menu.Item> */}
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );

    return (
      <div styleName="header">
        {this.props.children}

        <div className="right">
          {/* <Link to={`/user/edit`} style={{ marginRight: '100px' }}>
            <Icon type="edit" />
            修改密码
          </Link>
          <Link to={`/user/download`} style={{ marginRight: '100px' }}>
            <Icon type="download" />
            APP下载
          </Link> */}
          {currentUser ? (
            <Dropdown overlay={menu}>
              <span className={`account`}>
                {/* <Avatar
                  size="small"
                  className="avatar"
                  src={
                    currentUser.avatar ||
                    'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
                  }
                /> */}

                <Icon type="smile" theme="twoTone" />
                <span className="name">{currentUser.username}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}
// @inject('user')
// @Form.create()
// export default class xx extends React.Component<any, any> {
//   render() {
//     return <AddUser form={this.props.form} user={this.props.user}/>;
//   }
// }

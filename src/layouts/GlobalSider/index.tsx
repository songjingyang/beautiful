import React from 'react';
import { Menu, Icon, Layout } from 'antd';
import { Link } from 'react-router-dom';
import { getMenuData } from '../../common/menu';
import './index.less';
import store from '../../models/index';
import { observer } from 'mobx-react';
const SubMenu = Menu.SubMenu;
// const menuData = getMenuData()
const { Sider } = Layout;
interface Props {
  collapsed: boolean;
}
interface State {
  pathName: string;
}
@observer
class GlobalSider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pathName: window.location.pathname
    };
  }

  componentDidMount() {
    store.global.getMenuData({
      data: {}
    });
    // store
  }
  // componentWillReceiveProps(nextProps: Props) {
  //   // const { location } = this.props;
  //   // if (nextProps.location.pathname !== location.pathname) {
  //   //   this.setState({
  //   //     openKeys: this.getDefaultCollapsedSubMenus(nextProps)
  //   //   });
  //   // }
  // }
  // handleClick=(e:any)=>{
  //   console.log('e :', e);
  // }

  render() {
    const collapsed = this.props.collapsed;
    const menu = '/' + this.state.pathName.split('/')[1];
    const menuData = store.global.menuInfo;

    return (
      <Sider
        trigger={null}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0
        }}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        className="sider"
      >
        <div styleName="logo">
          <Icon type="wallet" className="logo-img" />
          {!collapsed && <h1>后台管理系统</h1>}
        </div>
        <Menu
          mode="inline"
          theme="dark"
          defaultSelectedKeys={[
            // this.state.pathName?this.state.pathName.substring(0,this.state.pathName.length-1): '/menu/home',  //生产环境
            this.state.pathName
              ? this.state.pathName.split('/')[2]
              : 'basescenery'
          ]}
          defaultOpenKeys={[this.state.pathName ? menu : '/resources']}
          inlineCollapsed={collapsed}
          // onClick={this.handleClick}
        >
          {menuData.data.map(item => {
            if (item.children) {
              return (
                <SubMenu
                  key={item.path}
                  title={
                    <span>
                      <Icon type={item.icon} />
                      <span>{item.name}</span>
                    </span>
                  }
                >
                  {item.children.map((subItem: any) => (
                    <Menu.Item key={subItem.path}>
                      <Link to={item.path + '/' + subItem.path}>
                        <span>{subItem.name}</span>
                      </Link>
                    </Menu.Item>
                  ))}
                </SubMenu>
              );
            } else {
              return (
                <Menu.Item key={item.path}>
                  <span>
                    <Link styleName="nav-link" to={item.path}>
                      <Icon type={item.icon} />
                      <span>{item.name}</span>
                    </Link>
                  </span>
                </Menu.Item>
              );
            }
          })}
        </Menu>
      </Sider>
    );
  }
}
export default GlobalSider;

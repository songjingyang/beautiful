import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import BasicLayout from './BasicLayout';
import UserLayout from './UserLayout';
import Login from '../modules/User/Login';
// import UserRegister from '../modules/User/UserRegister'
import { getRouterData } from '../common/router';
import User from '../models/User';

interface Props {
  user: User;
}

interface State {}

const routerData = getRouterData();

export default class Layout extends React.Component<Props, State> {
  render() {
    const userInfo = this.props.user.userInfo;
    const isLogin = !!userInfo.username || !!localStorage.getItem('user_cloud');
    return isLogin ? (
      <BasicLayout {...this.props}>
        {routerData
          .filter(item => item.path !== '/user/login')
          .map(item => (
            <Route
              key={item.path}
              path={item.path}
              component={item.component}
            />
          ))}
        {/* <Route exact component={NoMatch} /> */}
        <Redirect
          //  to={{ pathname: '/menu/home' }}
          to={{ pathname: '/resources/basehotel' }}
        />
      </BasicLayout>
    ) : (
      <UserLayout {...this.props}>
        <Route path="/user/login" component={Login} />
        {/* {routerData.map(item => (
            <Route key={item.path} path={item.path} component={item.component} />
          ))} */}
        {/* {routerData.filter(item => item.path !== '/user/login').map(item => (
              <Route key={item.path} path={item.path} component={item.component} />
            ))} */}
        <Redirect
          to={{
            pathname: '/user/login'
          }}
        />
      </UserLayout>
    );
  }
}

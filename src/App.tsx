import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import './App.css';
import zhCN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';
import store from './models/index';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
  withRouter
} from 'react-router-dom';
import Layout from './layouts/Layout';
import getRouterData from './common/router';
import moment from 'moment';
import { ConfigProvider } from 'antd';
moment.locale('en');
const routerData = getRouterData();
// 使用React.FC泛型类型
const App: React.FC = () => {
  const userStr = localStorage.getItem('user_cloud');
  if (userStr) {
    try {
      const user = JSON.parse(localStorage.getItem('user_cloud') || '{}');
      store.user.userInfo = user;
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <div>
      <ConfigProvider locale={zhCN}>
        <Provider {...store}>
          <Router>
            <Switch>
              <Layout user={store.user} />
            </Switch>
          </Router>
        </Provider>
      </ConfigProvider>
      {/* <DevTools /> */}
      {/* mobx调试工具 */}
    </div>
  );
};
export default App;

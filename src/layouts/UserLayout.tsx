import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from './GlobalFooter';
import './UserLayout.less';
// import logo from '../assets/logo.svg'

export default class UserLayout extends React.PureComponent {
  getPageTitle() {
    return '';
  }

  render() {
    // const { routerData, match } = this.props
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div styleName={'user-layout-container '}>
          <div styleName={'user-layout-content'}>
            <div styleName={'user-layout-top'}>
              <div styleName={'user-layout-header'}>
                <Link to="/">
                  <span styleName={'user-layout-title'}>后台管理系统</span>
                </Link>
              </div>
              <div styleName={'user-layout-desc'} />
            </div>
            <Switch>{this.props.children}</Switch>
          </div>
          <GlobalFooter />
        </div>
      </DocumentTitle>
    );
  }
}

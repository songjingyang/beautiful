import React from 'react';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import classnames from 'classnames';
import { Layout, Icon } from 'antd';
import { Switch } from 'react-router-dom';
import GlobalFooter from './GlobalFooter';
import GlobalHeader from './GlobalHeader';
import GlobalSider from './GlobalSider';
import User from '../models/User';
import './BasicLayout.less';

interface Props {
  user: User;
}

interface State {
  isMobile: boolean;
  collapsed: boolean;
}

const query = {
  'screen-xs': {
    maxWidth: 575
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599
  },
  'screen-xxl': {
    minWidth: 1600
  }
};

let isMobile;
enquireScreen((b: any) => {
  isMobile = b;
}, undefined);

export default class BasicLayout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isMobile: false,
      collapsed: false
    };
  }

  componentDidMount() {}

  toggle = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  render() {
    const layout = (
      <Layout>
        <GlobalSider collapsed={this.state.collapsed} />
        <Layout>
          <Layout.Header style={{ background: '#fff', padding: 0 }}>
            <GlobalHeader user={this.props.user}>
              {!this.state.isMobile && (
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
              )}
            </GlobalHeader>
          </Layout.Header>
          <Layout.Content>
            <Switch>{this.props.children}</Switch>
          </Layout.Content>
          <Layout.Footer>
            <GlobalFooter />
          </Layout.Footer>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title="">
        <ContainerQuery query={query}>
          {params => <div className={classnames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

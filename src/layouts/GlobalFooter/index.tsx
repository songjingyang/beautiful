import React, { ReactHTMLElement, ReactHTML, Fragment } from 'react';
import './index.less';
import { Typography } from 'antd';

interface Props {}

interface State {}
const { Text } = Typography;
export default class GlobalFooter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <Text type="secondary"> 2019-2021</Text>
        <Text type="secondary">
          版权所有 @ 2019-2021
          {/* <a href="http://www.mtdyw.co/" target="_blank" rel="noopener noreferrer"> 
          神马电影网</a> */}
        </Text>
      </div>
    );
  }
}

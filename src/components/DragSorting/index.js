import { Table, Popconfirm, Icon } from 'antd';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PreviewImg from '../PreviewImg';
import update from 'immutability-helper';
import React from 'react';
let dragingIndex = -1;
class BodyRow extends React.Component {
  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      ...restProps
    } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(
        <tr {...restProps} className={className} style={style} />
      )
    );
  }
}
const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index
    };
  }
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }
    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};
const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource()
  }))(BodyRow)
);
class DragSortingTable extends React.Component {
  state = {
    data: [],
    columns: [
      {
        title: '序号',
        dataIndex: 'sort'
      },
      {
        title: '内容',
        dataIndex: 'content',
        render: (text, record) => (
          <div>
            {record.type === 1 && <span>{text}</span>}
            {record.type === 2 && <PreviewImg src={text} alt={'img'} />}
            {record.type === 3 && (
              <video src={text} controls style={{ width: '100px' }}></video>
            )}
          </div>
        )
      },
      {
        title: '操作',
        dataIndex: 'play',
        render: (text, record) => (
          <Popconfirm
            title="你确定删除吗？"
            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
            okText="确认"
            cancelText="取消"
            onConfirm={() => this.DeleteSingle(record)}
          >
            <a href="#" onClick={(e) => { e.preventDefault() }}>删除</a>
          </Popconfirm>
        )
      }
    ]
  };
  componentWillReceiveProps(nextProps, preState) {
    this.setState({
      data: nextProps.data
    });
  }
  components = {
    body: {
      row: DragableBodyRow
    }
  };
  DeleteSingle = record => {
    this.setState(
      {
        data: this.state.data.filter(item => {
          return item !== record;
        })
      },
      () => {
        this.props.onChange(this.state.data);
        this.setState({
          data: this.state.data.map((item, index) => {
            return {
              ...item,
              sort: index + 1
            };
          })
        });
      }
    );
  };
  moveRow = (dragIndex, hoverIndex) => {
    const dragRow = this.state.data[dragIndex];
    this.setState(
      update(this.state, {
        data: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow]
          ]
        }
      }),
      () => {
        this.setState({
          data: this.state.data.map((item, index) => {
            return {
              ...item,
              sort: index + 1
            };
          })
        });
      }
    );
  };
  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <Table
          columns={this.state.columns}
          dataSource={this.state.data}
          rowKey={'key' || 'sort'}
          components={this.components}
          pagination={false}
          onRow={(record, index) => ({
            index,
            moveRow: this.moveRow
          })}
        />
      </DndProvider>
    );
  }
}
export default DragSortingTable;

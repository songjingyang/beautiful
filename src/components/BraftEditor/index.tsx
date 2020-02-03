import React from 'react';
import BraftEditor, { EditorState } from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import './index.less';
interface Props {
  onChange?(url: string): void;
  value?: string;
}
interface State {
  editorState: EditorState;
}
export default class NewBraft extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // this.editorState = BraftEditor.createEditorState(null);
    this.state = {
      editorState: BraftEditor.createEditorState(null)
    };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    console.log(
      'TCL: NewBraft -> getDerivedStateFromProps -> nextProps',
      '====>',
      nextProps.value !== prevState.editorState.toHTML()
    );
    if (nextProps.value !== prevState.editorState.toHTML()) {
      return {
        ...prevState,
        editorState: BraftEditor.createEditorState(nextProps.value)
      };
    }
    return null;
  }
  shouldComponentUpdate(nextProps: Props, nextState: State, nextContext: any) {
    if (nextProps.value !== this.state.editorState.toHTML()) {
      console.log(
        'TCL: NewBraft -> shouldComponentUpdate ->  this.state.editorState.toHTML()',
        this.state.editorState.toHTML()
      );
      return true;
    }
    return false;
  }
  handleChange = (editorState: any) => {
    // console.log("TCL: NewBraft -> handleChange -> editorState", editorState.toHTML())
    // console.log("TCL: NewBraft -> handleChange ->this.editorState",this.editorState.toHTML())
    // setTimeout(() => {
    // const htmlString = this.editorState.toHTML()
    console.log(
      'TCL: NewBraft -> handleChange -> htmlString',
      editorState.toHTML()
    );
    // if (editorState.toHTML() !== this.editorState.toHTML()) {
    // this.editorState = editorState;
    this.setState(
      {
        editorState
      },
      () => {
        this.props.onChange && this.props.onChange(editorState.toHTML());
      }
    );
    // }
    // }, 10);
  };
  render() {
    return (
      <BraftEditor
        className="my-editor"
        style={{ width: '750px' }}
        onChange={this.handleChange}
        value={this.state.editorState}
        excludeControls={['link', 'code', 'media', 'clear', 'blockquote']}
        placeholder="请输入正文内容"
      />
    );
  }
}

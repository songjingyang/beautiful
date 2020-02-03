import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Upload, message, Button, Icon, Modal, Progress } from 'antd';
import store from '../../models/index';
import { observer, inject } from 'mobx-react';
import { UploadFile } from 'antd/lib/upload/interface';
import './index.less';
interface Props {
  isShowUploadList: boolean;
  onChange?: any;
  type: string;
  data?: any;
  uploadNumber?: number;
  disabled?: boolean;
}
interface State {
  fileList: any;
  OSSData: any;
  loading: boolean;
  height: string;
  width: string;
  previewImage: string;
  previewVisible: boolean;
  file: {
    uid: string;
    url: string;
    lastModified: string;
    lastModifiedDate: string;
    name: string;
    size: number;
    type: string;
    percent: number;
    originFileObj: {
      uid: string;
      url: string;
    };
    status: string;
    response: {
      code: number;
      msg: any;
      data: {
        filename: string;
        size: string;
        mimeType: string;
        width: string;
        height: string;
      };
    };
    xhr: any;
  };
}
@inject('global')
@observer
export default class OssUpload extends React.Component<Props, State> {
  state = {
    fileList: [],
    previewImage: '',
    previewVisible: false,
    OSSData: {
      accessKeyId: '',
      policy: '',
      signature: '',
      key: '',
      host: '',
      callback: '',
      dir: ''
    },
    loading: false,
    height: '',
    width: '',
    file: {
      uid: '',
      url: '',
      lastModified: '',
      lastModifiedDate: '',
      name: '',
      size: 0,
      type: '',
      percent: 0,
      originFileObj: {
        uid: '',
        url: ''
      },
      status: '',
      response: {
        code: 0,
        msg: null,
        data: {
          filename: '',
          size: '',
          mimeType: '',
          width: '',
          height: ''
        }
      },
      xhr: null
    }
  };

  async componentDidMount() {
    await store.global.getPolicy({
      data: {
        type: this.props.type
      },
      callback: (res: any) => {
        if (res.code === 0) {
          this.setState({
            OSSData: res.data
          });
        }
      }
    });
  }
  componentWillReceiveProps(nextProps: any, preState: any) {
    console.log(
      'TCL: OssUpload -> componentWillReceiveProps -> nextProps',
      nextProps
    );
    if (nextProps.value !== this.state.fileList) {
      this.setState({
        fileList: nextProps.value
      });
    }
  }
  handleChange = (info: any) => {
    let fileList = [...info.fileList];
    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    if (this.props.uploadNumber) {
      fileList = fileList.slice(Number('-' + this.props.uploadNumber));
    }
    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    const isChange = fileList.find(item => item.status === 'uploading'); //非formitem情况下多个上传
    if (info.file.status === 'uploading') {
      this.setState({
        fileList,
        file: info.file,
        loading: true
      });
    } else if (info.file.status === 'done') {
      this.props.type === '2' &&
        store.global.getVideoStyle({
          data: {
            url: info.file.response && info.file.response.data.filename
          },
          callback: res => {
            if (res.code === 200) {
              const infoStyle = store.global.videoStyle;
              this.setState(
                {
                  file: {
                    ...this.state.file,
                    ...info.file,
                    response: {
                      ...info.file.response,
                      data: {
                        ...info.file.response.data,
                        height: infoStyle.data.ImageHeight.value,
                        width: infoStyle.data.ImageWidth.value,
                        filename:
                          info.file.response.data.filename +
                          '?width=' +
                          infoStyle.data.ImageWidth.value +
                          '&height=' +
                          infoStyle.data.ImageHeight.value
                      }
                    }
                  }
                },
                () => {
                  this.setState(
                    {
                      fileList: [
                        this.state.file,
                        ...fileList.filter(
                          (item: any) => item.uid !== this.state.file.uid
                        )
                      ],
                      loading: false
                    },
                    () => {
                      !isChange &&
                        this.props.onChange &&
                        this.props.onChange(this.state.fileList);
                    }
                  );
                }
              );
            }
          }
        });
      this.props.type !== '2' &&
        this.setState(
          {
            fileList,
            loading: false
          },
          () => {
            !isChange &&
              this.props.onChange &&
              this.props.onChange(
                this.state.fileList.map((item: any) => {
                  return {
                    ...item,
                    response: {
                      code: item.response.code,
                      msg: item.response.msg,
                      data: {
                        ...item.response.data,
                        filename:
                          item.response.data.filename +
                          '?width=' +
                          item.response.data.width +
                          '&height=' +
                          item.response.data.height
                      }
                    }
                  };
                })
              );
          }
        );
    } else if (info.file.status === 'err') {
      message.error('网络错误!');
      this.setState({
        fileList: [],
        loading: false
      });
    }
  };
  transformFile = (file: any) => {
    const { OSSData } = this.state;
    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = Date.now() + suffix;
    file.url = OSSData.dir + filename;
    return file;
  };
  getExtraData = (file: any) => {
    const { OSSData } = this.state;
    return {
      key: file.url,
      OSSAccessKeyId: OSSData.accessKeyId,
      policy: OSSData.policy,
      Signature: OSSData.signature,
      callback: OSSData.callback,
      host: OSSData.host
    };
  };
  removeListItem = (file: any) => {
    this.setState(
      {
        fileList: this.state.fileList.filter(item => {
          return item !== file;
        })
      },
      () => {
        this.props.onChange && this.props.onChange(this.state.fileList);
      }
    );
  };
  // downLoadFile = (value: any) => {
  //   window.open(value.response.data.filename)
  // }
  handleCancel = () => this.setState({ previewVisible: false });
  beforeUpload = (file: any) => {
    const isPass =
      (this.props.type === '1' &&
        (file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/gif')) ||
      (this.props.type === '2' &&
        (file.type === 'video/mp4' ||
          file.type === 'video/webm' ||
          file.type === 'video/ogg')) ||
      (this.props.type === '3' && file.type === 'application/pdf');

    if (!isPass) {
      message.error('上传文件格式错误!');
    }
    return isPass;
  };
  handlePreview = async (file: any) => {
    console.log('TCL: handlePreview -> file', file);
    this.setState({
      previewImage: file.response.data.filename,
      previewVisible: true,
      file: file
    });
  };
  render() {
    const props = {
      name: 'file',
      fileList: this.state.fileList,
      action: this.state.OSSData.host,
      onChange: this.handleChange,
      multiple: true,
      transformFile: this.transformFile,
      data: this.getExtraData,
      onPreview: this.handlePreview,
      onRemove: this.removeListItem,
      beforeUpload: this.beforeUpload
      // onDownload: this.downLoadFile
    };
    return (
      <div>
        <Upload {...props} fileList={this.state.fileList} showUploadList={true}>
          <Button
            disabled={this.props.disabled ? this.props.disabled : false}
            loading={this.state.loading}
            style={{ marginTop: 5 }}
          >
            {this.props.type === '1'
              ? '上传图片'
              : this.props.type === '2'
              ? '上传视频'
              : '上传PDF'}
          </Button>
        </Upload>
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={this.handleCancel}
          width={800}
        >
          {this.props.type === '1' && (
            <img
              alt="example"
              style={{ width: '100%' }}
              src={this.state.previewImage}
            />
          )}
          {this.props.type === '2' && (
            <video
              style={{ width: '100%' }}
              src={this.state.previewImage}
              controls
            />
          )}
          {this.props.type === '3' &&
            this.state.previewVisible &&
            (window.location.href = this.state.previewImage)}
        </Modal>
      </div>
    );
  }
}

// import React, { KeyboardEvent, ReactElement, Component } from 'react';
// import {
//   Form,
//   Select,
//   InputNumber,
//   Switch,
//   Radio,
//   Slider,
//   Row,
//   Col,
//   Button,
//   Upload,
//   Icon,
//   Rate,
//   Tooltip,
//   Input,
//   Card,
//   DatePicker,
//   message,
//   notification,
//   Tree
// } from 'antd';
// import urlMaps from '../../common/urlMaps'
// import { inject, observer } from 'mobx-react';
// import { withRouter } from 'react-router';
// import { FormComponentProps } from 'antd/es/form';
// import store from '../../models/index';
// // 引入编辑器样式
// import 'braft-editor/dist/index.css'
// import '../../components/BraftEditor/index.less'
// const FormItem = Form.Item;
// const RangePicker = DatePicker.RangePicker;
// const Option = Select.Option;
// const RadioButton = Radio.Button;
// const { TextArea } = Input;
// const RadioGroup = Radio.Group;
// const { Dragger } = Upload;
// interface PictureProps {
//   form: FormComponentProps['form'];
//   onClose: any;
//   data: any;
// }
// interface State {
//   status: boolean;
//   type: number
// }
// @inject('resource')
// @observer
// class CreatePicture extends Component<PictureProps, State> {
//   constructor(props: PictureProps) {
//     super(props);
//     this.state = {
//       status: true,
//       type: 0
//     };
//   }
//   componentDidMount() {

//   }
//   handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     this.props.form.validateFields((err, values) => {
//       if (!err) {
//         this.props.data ?
//           store.resource.EditPicture({
//             data: {
//               id: this.props.data.id,
//               ...values,
//               url: values.url[0].response.data.filename,
//               wide: values.url[0].response.data.width,
//               height: values.url[0].response.data.height
//             },
//             callback: res => {
//               if (res.code === 0) {
//                 message.success('保存成功');
//                 if (this.props.onClose) {
//                   this.props.onClose();
//                 }
//               }
//             },
//           }) :
//           store.resource.CreatePicture({
//             data: {
//               ...data_send,
//               urls: arr,
//             }
//             ,
//             callback: res => {
//               if (res.code === 0) {
//                 message.success('保存成功');
//                 if (this.props.onClose) {
//                   this.props.onClose();
//                 }
//               }
//             },
//           })
//       }
//     });
//   };
//   render() {
//     const { getFieldDecorator } = this.props.form;
//     const formItemLayout = {
//       labelCol: { span: 6 },
//       wrapperCol: { span: 14 },
//     };
//     const singleInfo = store.resource.pictureSingle
//     const isEdit = this.props.data !== undefined
//     console.log("**********", this.state.type)
//     let url = singleInfo.url
//     const json_img = [
//       {
//         "uid": "rc-upload-1574925611551-2",
//         "url": "img/15749256138437071375449767021574925617190.jpg",
//         "lastModified": 1574400765576,
//         "lastModifiedDate": "2019-11-22T05:32:45.576Z",
//         "name": "b17123b76cb838e9cc2d291f5bf62ba8.jpg",
//         "size": 1411649,
//         "type": "image/jpeg",
//         "percent": 100,
//         "originFileObj": {
//           "uid": "rc-upload-1574925611551-2",
//           "url": "img/15749256138437071375449767021574925617190.jpg"
//         },
//         "status": "done",
//         "thumbUrl": "",
//         "response": {
//           "code": 0,
//           "msg": null,
//           "data": {
//             "filename": "http://miramartravel.oss-cn-shenzhen.aliyuncs.com/img/15749256138437071375449767021574925617190.jpg",
//             "size": "1411649",
//             "mimeType": "image/jpeg",
//             "width": "1920",
//             "height": "1080"
//           }
//         },
//         "xhr": {}
//       }]
//     json_img.map((item: any, index: number) => {
//       if (url) {
//         item.uid = "16549861321684"
//         item.url = url
//         console.log("TCL: CreateVideo -> render ->  url.split", url.split("com/")[1])
//         item.type = "img/" + url.split("com/")[1].split(".")[1]
//         item.originFileObj.uid = "16549861321684"
//         item.originFileObj.url = url
//         item.response.data.filename = url
//         item.response.data.mimeType = "img/" + url.split("com/")[1].split(".")[1]
//       }
//     })
//     return (
//       <Card bordered={false}
//         title={isEdit ? "编辑图片" : "添加图片"}
//         className="CreateMito">
//         <Form onSubmit={this.handleSubmit}>
//           <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
//             <Col xl={24} md={24} sm={24}>
//               <FormItem
//                 label="分类"
//                 {...formItemLayout}
//                 className="form-inline-item"
//               >
//                 {getFieldDecorator('type', {
//                   initialValue: isEdit ? Number(singleInfo.type) : undefined,
//                   rules: [
//                     {
//                       required: true,
//                       message: '选择分类',
//                     },
//                   ],
//                 })(
//                   <Select style={{ width: 300 }} placeholder="请选择分类" onChange={this.handleChange}>
//                     <Option value={2}>酒店</Option>
//                     <Option value={3}>城市</Option>
//                     <Option value={4}>景点</Option>
//                     <Option value={5}>餐厅</Option>
//                   </Select>
//                 )}
//               </FormItem>
//             </Col>
//             {(this.state.type === 2) && <Col xl={24} md={24} sm={24}>
//               <FormItem
//                 label={"请选择酒店"}
//                 {...formItemLayout}
//                 className="form-inline-item"
//               >
//                 {getFieldDecorator("itemId", {
//                   initialValue: isEdit ? singleInfo.itemId : undefined,
//                   rules: [
//                     {
//                       required: true,
//                       whitespace: true,
//                       message: "请选择酒店",
//                     },
//                   ],
//                 })(
//                   <Select style={{ width: 300 }} placeholder={"请选择酒店"} >
//                     {
//                       store.resource.hotelPage.records.map((item: any, index: number) =>
//                         (
//                           <Option key={item.id} value={item.id}>{item.name}</Option>
//                         )
//                       )
//                     }
//                   </Select>
//                 )}
//               </FormItem>
//             </Col>}
//             {(this.state.type === 3) && <Col xl={24} md={24} sm={24}>
//               <FormItem
//                 label={"请选择城市"}
//                 {...formItemLayout}
//                 className="form-inline-item"
//               >
//                 {getFieldDecorator("city", {
//                   initialValue: isEdit ? singleInfo.city : undefined,
//                   rules: [
//                     {
//                       required: true,
//                       whitespace: true,
//                       message: "请选择城市",
//                     },
//                   ],
//                 })(
//                   <Select style={{ width: 300 }} placeholder={"请选择城市"} >
//                     {
//                       store.global.cityList.map((item: any, index: number) => (
//                         <Option key={item.id} value={item.id}>{item.name}</Option>
//                       ))
//                     }
//                   </Select>
//                 )}
//               </FormItem>
//             </Col>}
//             {(this.state.type === 4) && <Col xl={24} md={24} sm={24}>
//               <FormItem
//                 label={"请选择景点"}
//                 {...formItemLayout}
//                 className="form-inline-item"
//               >
//                 {getFieldDecorator("itemId", {
//                   initialValue: isEdit ? singleInfo.itemId : undefined,
//                   rules: [
//                     {
//                       required: true,
//                       whitespace: true,
//                       message: "请选择景点",
//                     },
//                   ],
//                 })(
//                   <Select style={{ width: 300 }} placeholder={"请选择景点"} >
//                     {
//                       store.resource.hotelPage.records.map((item: any, index: number) => (
//                         <Option key={item.id} value={item.id}>{item.name}</Option>
//                       ))
//                     }
//                   </Select>
//                 )}
//               </FormItem>
//             </Col>}
//             {(this.state.type === 5) && <Col xl={24} md={24} sm={24}>
//               <FormItem
//                 label={"请选择餐厅"}
//                 {...formItemLayout}
//                 className="form-inline-item"
//               >
//                 {getFieldDecorator("itemId", {
//                   initialValue: isEdit ? singleInfo.itemId : undefined,
//                   rules: [
//                     {
//                       required: true,
//                       whitespace: true,
//                       message: "请选择餐厅",
//                     },
//                   ],
//                 })(
//                   <Select style={{ width: 300 }} placeholder={"请选择餐厅"} >
//                     {
//                       store.resource.hotelPage.records.map((item: any, index: number) => (
//                         <Option key={item.id} value={item.id}>{item.name}</Option>
//                       ))
//                     }
//                   </Select>
//                 )}
//               </FormItem>
//             </Col>}
//             <Col xl={24} md={24} sm={24}>
//               <FormItem
//                 label="上传视频"
//                 {...formItemLayout}
//                 className="form-inline-item"
//               >
//                 {getFieldDecorator('url', {
//                   initialValue: isEdit ? json_img : [],
//                   rules: [
//                     {
//                       required: true,
//                       message: '选择图片',
//                     },
//                   ],
//                 })(
//                   <OssUpload type={"1"} />
//                 )}
//               </FormItem>
//             </Col>
//             <Col xl={12} md={24} sm={24} offset={6}>
//               <div className="submitButtons">
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                 >
//                   确定
//                 </Button>
//               </div>
//             </Col>
//           </Row>
//         </Form>
//       </Card >
//     );
//   }
// }

// export default Form.create<PictureProps>()(CreatePicture);

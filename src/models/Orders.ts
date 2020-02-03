import { observable, action } from 'mobx';
import request, { urlMaps, ResData, ReqData } from '../common/request';

export interface OrderPage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface SearchOrder {
  id: string;
  runningNumber: string;
  type: number;
  goodsId: string;
  subClass: number;
  price: string;
  num: string;
  name: string;
  img: string;
  businessId: string;
  createTime: string;
  shoppingOrderId: string;
  userId: string;
  nickName: string;
  state: number;
  shoppingOrderDetails: any;
  shoppingParticipants: any;
  userContacts: any;
}
export interface AfterSales {
  id: string;
  runningNumber: string;
  createTime: string;
  reason: string;
  phone: string;
}
export class Orders {
  @observable
  afterSales: AfterSales = {
    id: '',
    runningNumber: '',
    createTime: '',
    reason: '',
    phone: ''
  };
  @observable
  orderPage: OrderPage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  searchOrder: SearchOrder = {
    id: '',
    runningNumber: '',
    type: 0,
    goodsId: '',
    subClass: 0,
    price: '',
    num: '',
    name: '',
    img: '',
    businessId: '',
    createTime: '',
    shoppingOrderId: '',
    userId: '',
    nickName: '',
    state: 0,
    shoppingOrderDetails: [],
    shoppingParticipants: [],
    userContacts: []
  };
  @action
  async getOrderPage({ data, callback }: ReqData) {
    const res = await request<OrderPage>(urlMaps.getOrderPage, data, {
      method: 'GET'
    });
    if (res.code === 0) {
      this.orderPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async getSearchOrder({ data, callback }: ReqData) {
    const res = await request<SearchOrder>(urlMaps.getSearchOrder, data, {
      method: 'GET'
    });
    if (res.code === 0) {
      this.searchOrder = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getAfterSales({ data, callback }: ReqData) {
    const res = await request<AfterSales>(urlMaps.getAfterSales, data, {
      method: 'GET'
    });
    if (res.code === 0) {
      this.afterSales = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
}
export default Orders;

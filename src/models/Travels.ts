import { observable, action } from 'mobx';
import request, { urlMaps, ResData, ReqData } from '../common/request';

export interface TravelsPage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface TravelsState {}
export interface TravelsupOrDown {}
export interface TravelstravelsCommend {}
export interface TravelsSingle {
  id: string;
  userId: string;
  createTime: string;
  title: string;
  content: string;
  startTime: string;
  state: number;
  cityId: string;
  city: number;
  headUrl: string;
  nickName: string;
  shelf: number;
  recommend: number;
  materialType: number;
  materialCount: number;
  composeCount: number;
  productCount: number;
  userMaterialList: any;
}
export class Travels {
  @observable
  travelsPage: TravelsPage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  travelsState: TravelsState = {};
  @observable
  travelsupOrDown: TravelsupOrDown = {};
  @observable
  travelstravelsCommend: TravelstravelsCommend = {};
  @observable
  travelsSingle: TravelsSingle = {
    id: '',
    userId: '',
    createTime: '',
    title: '',
    content: '',
    startTime: '',
    state: 0,
    cityId: '',
    city: 0,
    headUrl: '',
    nickName: '',
    shelf: 0,
    recommend: 0,
    materialType: 0,
    materialCount: 0,
    composeCount: 0,
    productCount: 0,
    userMaterialList: []
  };

  @action
  async getTravelsPage({ data, callback }: ReqData) {
    const res = await request<TravelsPage>(urlMaps.travelsPage, data, {
      method: 'GET'
    });
    if (res.code === 0) {
      this.travelsPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  async getTravelsSingle({ data, callback }: ReqData) {
    const res = await request<TravelsSingle>(urlMaps.baseTravels, data, {
      method: 'GET'
    });
    if (res.code === 0) {
      this.travelsSingle = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  async EditTravelsState({ data, callback }: ReqData) {
    const res = await request<TravelsState>(urlMaps.travelsPass, data, {
      method: 'PUT'
    });
    if (res.code === 0) {
      this.travelsState = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  async EditTravelsupOrDown({ data, callback }: ReqData) {
    const res = await request<TravelsupOrDown>(urlMaps.travelsUpOrDown, data, {
      method: 'PUT'
    });
    if (res.code === 0) {
      this.travelsupOrDown = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  async EditTravelstravelsCommend({ data, callback }: ReqData) {
    const res = await request<TravelstravelsCommend>(
      urlMaps.travelsCommend,
      data,
      {
        method: 'PUT'
      }
    );
    if (res.code === 0) {
      this.travelstravelsCommend = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
}
export default Travels;

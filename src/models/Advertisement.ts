import { observable, action } from 'mobx';
import request, { urlMaps, ResData, ReqData } from '../common/request';
export interface AdvertisementPage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface AdvertisementDelete {}
export interface CreateAdvertisement {}
export interface AdvertisementSingle {
  id: string;
  title: string;
  url: string;
  position: number;
  startTime: string;
  endTime: string;
  jump: number;
  jumpUrl: string;
  state: number;
  itemId: null;
  tourTagId: string;
  cityId: string;
  createTime: string;
}
export class Advertisement {
  @observable
  advertisementPage: AdvertisementPage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  advertisementDelete: AdvertisementDelete = {};
  @observable
  createAdvertisement: CreateAdvertisement = {};
  @observable
  advertisementSingle: AdvertisementSingle = {
    id: '',
    title: '',
    url: '',
    position: 0,
    startTime: '',
    endTime: '',
    jump: 0,
    jumpUrl: '',
    state: 0,
    itemId: null,
    tourTagId: '',
    cityId: '',
    createTime: ''
  };
  @action
  async getAdvertisementPage({ data, callback }: ReqData) {
    const res = await request<AdvertisementPage>(
      urlMaps.baseAdvertisement,
      data,
      {
        method: 'GET'
      }
    );

    if (res.code === 0) {
      this.advertisementPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async DeleteAdvertisement({ data, callback }: ReqData) {
    const res = await request<AdvertisementDelete>(
      urlMaps.AdvertisementUrl + '?id=' + data.id,
      data,
      {
        method: 'DELETE'
      }
    );

    if (res.code === 0) {
      this.advertisementDelete = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async CreateAdvert({ data, callback }: ReqData) {
    const res = await request<CreateAdvertisement>(
      urlMaps.AdvertisementUrl,
      data,
      {
        method: 'POST'
      }
    );

    if (res.code === 0) {
      this.createAdvertisement = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async EditAdvert({ data, callback }: ReqData) {
    const res = await request<CreateAdvertisement>(
      urlMaps.AdvertisementUrl,
      data,
      {
        method: 'PUT'
      }
    );

    if (res.code === 0) {
      this.createAdvertisement = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getAdvertisementSingle({ data, callback }: ReqData) {
    const res = await request<AdvertisementSingle>(
      urlMaps.AdvertisementUrl,
      data,
      {
        method: 'GET'
      }
    );

    if (res.code === 0) {
      this.advertisementSingle = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
}
export default Advertisement;

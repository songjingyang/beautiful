import { observable, action } from 'mobx';
import request, { urlMaps, ResData, ReqData } from '../common/request';
export interface BroadcastPage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface CastDelete {}
export interface CreateBroadcast {}
export interface BroadcastSingle {
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
export class Broadcast {
  @observable
  broadcastPage: BroadcastPage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  castDelete: CastDelete = {};
  @observable
  createBroadcast: CreateBroadcast = {};
  @observable
  broadcastSingle: BroadcastSingle = {
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
  async getBroadcastPage({ data, callback }: ReqData) {
    const res = await request<BroadcastPage>(urlMaps.baseBroadcast, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.broadcastPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async DeleteCast({ data, callback }: ReqData) {
    const res = await request<CastDelete>(
      urlMaps.BroadcastUrl + '?id=' + data.id,
      data,
      {
        method: 'DELETE'
      }
    );

    if (res.code === 0) {
      this.castDelete = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async CreateBroadcast({ data, callback }: ReqData) {
    const res = await request<CreateBroadcast>(urlMaps.BroadcastUrl, data, {
      method: 'POST'
    });

    if (res.code === 0) {
      this.createBroadcast = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async EditBroadcast({ data, callback }: ReqData) {
    const res = await request<CreateBroadcast>(urlMaps.BroadcastUrl, data, {
      method: 'PUT'
    });

    if (res.code === 0) {
      this.createBroadcast = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getBroadcastSingle({ data, callback }: ReqData) {
    const res = await request<BroadcastSingle>(urlMaps.BroadcastUrl, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.broadcastSingle = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
}
export default Broadcast;

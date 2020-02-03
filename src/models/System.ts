import { observable, action } from 'mobx';
import request, { urlMaps, ResData, ReqData } from '../common/request';
export interface PrevilePage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}

export class System {
  @observable
  previlePage: PrevilePage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };

  @action
  async getPrevilePage({ data, callback }: ReqData) {
    const res = await request<PrevilePage>(urlMaps.baseRoleUrl, data, {
      method: 'GET'
    });
    console.log('TCL: System -> getPrevilePage -> res', res);

    if (res.code === 0) {
      this.previlePage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
}
export default System;

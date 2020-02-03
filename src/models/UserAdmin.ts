import { observable, action } from 'mobx';
import request, { urlMaps, ResData, ReqData } from '../common/request';
export interface UserList {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface Status {}
export class UserAdmin {
  @observable
  userList: UserList = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  status: Status = {};
  @action
  async getUserList({ data, callback }: ReqData) {
    const res = await request<UserList>(urlMaps.getUserList, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.userList = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async EnableShutdown({ data, callback }: ReqData) {
    const res = await request<Status>(urlMaps.getUserList, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.status = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
}

export default UserAdmin;

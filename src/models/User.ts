import { observable, action } from 'mobx';
import request, { urlMaps, ResData, ReqData } from '../common/request';
var urlencode = require('urlencode');
export interface UserInfo {
  access_token: string;
  dept_id: number;
  expires_in: number;
  license: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  user_id: number;
  username: string;
}
export interface EditInfo {}
export interface ForgetPassInfo {}
export interface CodeBack {
  code: number;
}
export class User {
  @observable
  userInfo: UserInfo = {
    access_token: '',
    dept_id: 0,
    expires_in: 0,
    license: '',
    refresh_token: '',
    scope: '',
    token_type: '',
    user_id: 0,
    username: ''
  };
  @observable
  editInfo: EditInfo = {};
  @observable
  forgetPassInfo: ForgetPassInfo = {};
  @observable
  codeBack: CodeBack = {
    code: 0
  };

  @action
  async login({ data, callback }: ReqData) {
    let npassword = urlencode(data.password);
    const res = await request<UserInfo>(
      urlMaps.login +
        '?randomStr=' +
        data.randomStr +
        '&grant_type=password' +
        '&scope=server' +
        '&type=2' +
        '&username=' +
        data.username +
        // + "&password=" + npassword
        '&password=' +
        data.password +
        '&code=' +
        data.code,
      data,
      {
        method: 'POST'
      }
    );
    console.log('TCL: User -> login -> res', res);
    if (res.code === '0' || res.code === 0) {
      const data: any = res.data;
      const user_cloud = data as UserInfo;
      this.userInfo = data;
      localStorage.setItem('user_cloud', JSON.stringify(user_cloud));
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async logout({ data, callback }: ReqData) {
    const res = await request<UserInfo>(urlMaps.logout, data, {
      method: 'DELETE'
    });
    if (res.code === 200) {
      localStorage.removeItem('user_cloud');
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async editPass({ data, callback }: ReqData) {
    const res = await request<EditInfo>(urlMaps.editPass, data, {
      method: 'POST'
    });

    if (res.data === 200) {
      const data: any = res.data;
      const user = data as EditInfo;
      this.editInfo = user;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async forgetPass({ data, callback }: ReqData) {
    const res = await request<ForgetPassInfo>(urlMaps.forgetPass, data, {
      method: 'POST'
    });

    if (res.data === 200) {
      this.forgetPassInfo = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async sendPhoneCode({ data, callback }: ReqData) {
    const res = await request<CodeBack>(urlMaps.sendCode, data, {
      method: 'POST'
    });

    if (res.code === 200) {
      this.codeBack = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
}

export default User;

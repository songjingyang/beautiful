import { observable, action } from 'mobx';
import request, { urlMaps, ResData, ReqData } from '../common/request';
import { generatePath } from 'react-router';
export interface MenuInfo {
  code: number;
  data: any[];
  msg: any;
}
export interface VideoStyle {
  data: {
    FileSize: { value: string };
    Format: { value: string };
    ImageHeight: { value: string };
    ImageWidth: { value: string };
    ResolutionUnit: { value: string };
    XResolution: { value: string };
    YResolution: { value: string };
  };
}
export interface Products {}
export interface RelationPage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface City {}
export interface PictureCity {}
export interface Policy {
  accessKeyId: string;
  policy: string;
  signature: string;
  dir: string;
  host: string;
  callback: string;
}
export class Global {
  @observable
  videoStyle: VideoStyle = {
    data: {
      FileSize: { value: '' },
      Format: { value: '' },
      ImageHeight: { value: '' },
      ImageWidth: { value: '' },
      ResolutionUnit: { value: '' },
      XResolution: { value: '' },
      YResolution: { value: '' }
    }
  };
  @observable
  products: Products = {};
  @observable
  relationPage: RelationPage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  menuInfo: MenuInfo = {
    code: -1,
    data: [
      {
        authority: '',
        children: [],
        code: '',
        component: null,
        icon: '',
        id: '',
        keepAlive: '',
        label: '',
        name: '',
        parentId: '',
        path: null,
        redirect: null,
        sort: null,
        spread: false,
        type: null
      }
    ],
    msg: ''
  };
  @observable
  cityList: City[] = [
    {
      name: '',
      id: ''
    }
  ];
  @observable
  pictureCity: PictureCity[] = [
    {
      name: '',
      id: ''
    }
  ];
  @observable
  policy: Policy = {
    accessKeyId: '',
    policy: '',
    signature: '',
    dir: '',
    host: '',
    callback: ''
  };
  @action
  async getRelationPage({ data, callback }: ReqData) {
    const res = await request<RelationPage>(urlMaps.baseRelation, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.relationPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getMenuData({ data, callback }: ReqData) {
    const res = await request<MenuInfo[]>(urlMaps.getMenuInfo, data, {
      method: 'GET'
    });
    if (res.code === 0) {
      this.menuInfo.data = res.data;
    } else if (res.code !== 0) {
      window.location.href = generatePath('/user/login');
      localStorage.removeItem('user_cloud');
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getCityList({ data, callback }: ReqData) {
    const res = await request<City[]>(urlMaps.getCityList, data, {
      method: 'GET'
    });
    if (res.code === 0) {
      this.cityList = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async getPictureCity({ data, callback }: ReqData) {
    const res = await request<PictureCity[]>(urlMaps.getPictureCity, data, {
      method: 'GET'
    });
    if (res.code === 0) {
      this.pictureCity = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getPolicy({ data, callback }: ReqData) {
    const res = await request<Policy>(urlMaps.getPolicy, data, {
      method: 'GET'
    });
    if (res.code === 0) {
      this.policy = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async getVideoStyle({ data, callback }: ReqData) {
    const type = data && data.url.split('/video/admin')[1].split('.')[1];
    const url = data && data.url.replace(type, 'jpg').replace('admin', 'cover');
    const res = await request<VideoStyle>(
      url,
      {
        'x-oss-process': 'image/info'
      },
      {
        method: 'GET',
        url: url
      }
    );
    if (res.code === 200) {
      this.videoStyle.data = res.data.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async EditProducts({ data, callback }: ReqData) {
    const res = await request<Products>(urlMaps.EditProducts, data, {
      method: 'PUT'
    });

    if (res.code === 0) {
      this.products = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
}

export default Global;

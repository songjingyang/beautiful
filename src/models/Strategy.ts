import { observable, action } from 'mobx';
import request, { urlMaps, ResData, ReqData } from '../common/request';

export interface SelectInfo {
  selectedRow: any[];
}

export interface VideoStraegyPage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}

export interface CityStraegyPage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface PictureStraegyPage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface VideoStraegyPageDelete {}
export interface CreatePictureStraegy {}
export interface CreateVideoStraegy {}
export interface CreateCityStraegy {}

export interface UpDownVideoStraegy {}
export interface UpDownImageStraegy {}
export interface CityRecommend {}
export interface CityState {}
export interface PictureSingle {
  bmMaterialList: any[];
  bmTourProductDaysList: any[];
  city: string;
  content: string;
  createTime: string;
  id: string;
  recommend: number;
  state: number;
  title: string;
  type: number;
  userId: string;
}

export interface VideoSingle {
  bmMaterialList: any[];
  bmTourProductDaysList: any[];
  city: string;
  content: string;
  createTime: string;
  id: string;
  recommend: number;
  state: number;
  title: string;
  type: number;
  userId: string;
}
export interface CitySingle {
  bmMaterialList: any[];
  bmTourProductDaysList: any[];
  city: string;
  composeCount: number;
  createTime: string;
  id: string;
  imgUrl: string;
  information: string;
  name: string;
  recommend: number;
  state: number;
  strategyCityIntroduceList: any[];
  userId: string;
}
export class Strategy {
  @observable
  selectInfo: SelectInfo = {
    selectedRow: []
  };
  @observable
  cityRecommend: CityRecommend = {};
  @observable
  cityState: CityState = {};

  @observable
  videoStraegyPage: VideoStraegyPage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  cityStraegyPage: CityStraegyPage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  pictureStraegyPage: PictureStraegyPage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  videoStraegyPageDelete: VideoStraegyPageDelete = {};
  @observable
  createPictureStraegy: CreatePictureStraegy = {};
  @observable
  upDownVideoStraegy: UpDownVideoStraegy = {};
  @observable
  upDownImageStraegy: UpDownImageStraegy = {};
  @observable
  createVideoStraegy: CreateVideoStraegy = {};
  @observable
  createCityStraegy: CreateCityStraegy = {};

  @observable
  pictureSingle: PictureSingle = {
    bmMaterialList: [],
    bmTourProductDaysList: [],
    city: '',
    content: '',
    createTime: '',
    id: '',
    recommend: 0,
    state: 0,
    title: '',
    type: 0,
    userId: ''
  };
  @observable
  videoSingle: VideoSingle = {
    bmMaterialList: [],
    bmTourProductDaysList: [],
    city: '',
    content: '',
    createTime: '',
    id: '',
    recommend: 0,
    state: 0,
    title: '',
    type: 0,
    userId: ''
  };
  @observable
  citySingle: CitySingle = {
    bmMaterialList: [],
    bmTourProductDaysList: [],
    city: '',
    composeCount: 0,
    createTime: '',
    id: '',
    imgUrl: '',
    information: '',
    name: '',
    recommend: 1,
    state: 1,
    strategyCityIntroduceList: [],
    userId: ''
  };
  @action
  async getPictureStrategyPage({ data, callback }: ReqData) {
    const res = await request<PictureStraegyPage>(
      urlMaps.basePictuerStrategy,
      data,
      {
        method: 'GET'
      }
    );

    if (res.code === 0) {
      this.pictureStraegyPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getVideoStrategyPage({ data, callback }: ReqData) {
    const res = await request<VideoStraegyPage>(
      urlMaps.baseVideoStrategy,
      data,
      {
        method: 'GET'
      }
    );

    if (res.code === 0) {
      this.videoStraegyPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getCityStrategyPage({ data, callback }: ReqData) {
    const res = await request<CityStraegyPage>(
      urlMaps.baseCityStraegyPage,
      data,
      {
        method: 'GET'
      }
    );

    if (res.code === 0) {
      this.cityStraegyPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async DeletePictureStrategyPage({ data, callback }: ReqData) {
    const res = await request<PictureStraegyPage>(
      urlMaps.PictuerStrategyUrl + '?id=' + data.id,
      data,
      {
        method: 'DELETE'
      }
    );

    if (res.code === 0) {
      this.pictureStraegyPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async DeleteVideoStrategyPage({ data, callback }: ReqData) {
    const res = await request<VideoStraegyPage>(
      urlMaps.VideoStrategyUrl + '?id=' + data.id,
      data,
      {
        method: 'DELETE'
      }
    );

    if (res.code === 0) {
      this.videoStraegyPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async CreatePictureStraegy({ data, callback }: ReqData) {
    const res = await request<CreatePictureStraegy>(
      urlMaps.PictuerStrategyUrl,
      data,
      {
        method: 'POST'
      }
    );

    if (res.code === 0) {
      this.createPictureStraegy = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async EditPictureStraegy({ data, callback }: ReqData) {
    const res = await request<CreatePictureStraegy>(
      urlMaps.PictuerStrategyUrl,
      data,
      {
        method: 'PUT'
      }
    );

    if (res.code === 0) {
      this.createPictureStraegy = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async CreateVideoStraegy({ data, callback }: ReqData) {
    const res = await request<CreateVideoStraegy>(
      urlMaps.VideoStrategyUrl,
      data,
      {
        method: 'POST'
      }
    );

    if (res.code === 0) {
      this.createVideoStraegy = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async AddCityStraegy({ data, callback }: ReqData) {
    console.log(
      'TCL: CreateCityStraegy -> urlMaps.CityStraegyUrl',
      urlMaps.CityStraegyUrl
    );
    const res = await request<CreateCityStraegy>(urlMaps.CityStraegyUrl, data, {
      method: 'POST'
    });
    console.log('TCL: CreateCityStraegy -> res', res);

    if (res.code === 0) {
      this.createCityStraegy = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async EditCityStraegy({ data, callback }: ReqData) {
    const res = await request<CreatePictureStraegy>(
      urlMaps.CityStraegyUrl,
      data,
      {
        method: 'PUT'
      }
    );

    if (res.code === 0) {
      this.createVideoStraegy = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async EditVideoStraegy({ data, callback }: ReqData) {
    const res = await request<CreatePictureStraegy>(
      urlMaps.VideoStrategyUrl,
      data,
      {
        method: 'PUT'
      }
    );

    if (res.code === 0) {
      this.createVideoStraegy = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async SetRecommend({ data, callback }: ReqData) {
    const res = await request<CityRecommend>(urlMaps.CityRecommend, data, {
      method: 'PUT'
    });

    if (res.code === 0) {
      this.cityRecommend = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async SetCityState({ data, callback }: ReqData) {
    const res = await request<CityState>(urlMaps.CityState, data, {
      method: 'PUT'
    });

    if (res.code === 0) {
      this.cityState = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async EditVideoUpOrDown({ data, callback }: ReqData) {
    const res = await request<UpDownVideoStraegy>(urlMaps.videoUp, data, {
      method: 'PUT'
    });

    if (res.code === 0) {
      this.upDownVideoStraegy = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async EditImageUpOrDown({ data, callback }: ReqData) {
    const res = await request<UpDownImageStraegy>(urlMaps.imageUp, data, {
      method: 'PUT'
    });

    if (res.code === 0) {
      this.upDownImageStraegy = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getPictureSingle({ data, callback }: ReqData) {
    const res = await request<PictureSingle>(urlMaps.PictuerStrategyUrl, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.pictureSingle = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getVideoSingle({ data, callback }: ReqData) {
    const res = await request<VideoSingle>(urlMaps.VideoStrategyUrl, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.videoSingle = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getCitySingle({ data, callback }: ReqData) {
    const res = await request<CitySingle>(urlMaps.CityStraegyUrl, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.citySingle = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  AddSelectInfo = (value: any) => {
    this.selectInfo.selectedRow = value;
  };
  @action
  DeleteSelectInfo = (value: any) => {
    this.selectInfo.selectedRow = this.selectInfo.selectedRow.filter(
      (item: any) => {
        return item !== value;
      }
    );
  };
  @action
  getSelectInfo = () => {
    this.selectInfo.selectedRow = this.selectInfo.selectedRow;
  };
}
export default Strategy;

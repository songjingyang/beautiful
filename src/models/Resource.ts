import { observable, action } from 'mobx';
import request, { urlMaps, ResData, ReqData } from '../common/request';
export interface ScenicPage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface HotelPage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface RestaurantPage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface TripModePage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface PicturePage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface VideoPage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface BasicProductsPage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface ScenicCreate {}
export interface HotelCreate {}

export interface RestaurantCreate {}
export interface TripModeCreate {}
export interface PictureCreate {}
export interface VideoCreate {}
export interface BasicProductsCreate {}
export interface ScenicDelete {}
export interface HotelDelete {}
export interface RestaurantDelete {}
export interface TripModeDelete {}
export interface PictureDelete {}
export interface VideoDelete {}
export interface BasicProductsDelete {}
export interface ScenicCreateSingle {
  id: string;
  name: string;
  city: string;
  introduce: string;
  createTime: string;
  userId: string;
  convenient: string;
}
export interface HotelSingle {
  id: string;
  name: string;
  city: string;
  introduce: string;
  createTime: string;
  address: string;
  telephone: string;
  traffic: string;
  userId: string;
  star: string;
}
export interface RestaurantSingle {
  id: string;
  name: string;
  city: string;
  introduce: string;
  createTime: string;
  address: string;
  telephone: string;
  traffic: string;
  userId: string;
  star: string;
}
export interface TripModeSingle {
  id: string;
  tirpMode: string;
  subordinate: string;
  start: string;
  end: string;
  number: string;
  startHour: string;
  startMin: string;
  createTime: string;
  transfer: string;
  userId: string;
}
export interface PictureSingle {
  id: string;
  type: string;
  city: string;
  itemId: string;
  url: string;
  wide: string;
  high: string;
  createTime: string;
  userId: string;
  urls: string;
}
export interface VideoSingle {
  id: string;
  name: string;
  city: string;
  url: string;
  wide: string;
  high: string;
  duration: string;
  createTime: string;
  userId: string;
}
export interface ProductSingle {
  id: string;
  name: string;
  copywriting: string;
  days: string;
  createTime: string;
  brightSpot: string;
  pdfUrl: string;
  userId: string;
  state: number;
  type: number;
  baseProductDaysList: any[];
}
export class Resource {
  @observable
  scenicPage: ScenicPage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  hotelPage: HotelPage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  restaurantPage: RestaurantPage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  tripModePage: TripModePage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  picturePage: PicturePage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  videoPage: VideoPage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  basicProductsPage: BasicProductsPage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };

  @observable
  scenicCreate: ScenicCreate = {};
  @observable
  basicProductsCreate: BasicProductsCreate = {};
  @observable
  hotelCreate: HotelCreate = {};
  @observable
  restaurantCreate: RestaurantCreate = {};
  @observable
  tripModeCreate: TripModeCreate = {};
  @observable
  pictureCreate: PictureCreate = {};
  @observable
  videoCreate: VideoCreate = {};
  @observable
  hotelDelete: HotelDelete = {};
  @observable
  restaurantDelete: RestaurantDelete = {};

  @observable
  scenicDelete: ScenicDelete = {};
  @observable
  tripModeDelete: TripModeDelete = {};
  @observable
  pictureDelete: PictureDelete = {};
  @observable
  videoDelete: VideoDelete = {};
  @observable
  basicProductsDelete: BasicProductsDelete = {};
  @observable
  scenicCreateSingle: ScenicCreateSingle = {
    id: '',
    name: '',
    city: '',
    introduce: '',
    createTime: '',
    userId: '',
    convenient: ''
  };
  @observable
  hotelSingle: HotelSingle = {
    id: '',
    name: '',
    city: '',
    introduce: '',
    createTime: '',
    address: '',
    telephone: '',
    traffic: '',
    userId: '',
    star: ''
  };
  @observable
  restaurantSingle: RestaurantSingle = {
    id: '',
    name: '',
    city: '',
    introduce: '',
    createTime: '',
    address: '',
    telephone: '',
    traffic: '',
    userId: '',
    star: ''
  };
  @observable
  tripModeSingle: TripModeSingle = {
    id: '',
    tirpMode: '',
    subordinate: '',
    start: '',
    end: '',
    number: '',
    startHour: '',
    startMin: '',
    createTime: '',
    transfer: '',
    userId: ''
  };
  @observable
  pictureSingle: PictureSingle = {
    id: '',
    type: '',
    city: '',
    itemId: '',
    url: '',
    wide: '',
    high: '',
    createTime: '',
    userId: '',
    urls: ''
  };
  @observable
  videoSingle: VideoSingle = {
    id: '',
    name: '',
    city: '',
    url: '',
    wide: '',
    high: '',
    duration: '',
    createTime: '',
    userId: ''
  };
  @observable
  productSingle: ProductSingle = {
    id: '',
    name: '',
    copywriting: '',
    days: '',
    createTime: '',
    brightSpot: '',
    pdfUrl: '',
    userId: '',
    state: 0,
    type: 0,
    baseProductDaysList: []
  };
  @action
  async getScenicSpot({ data, callback }: ReqData) {
    const res = await request<ScenicPage>(urlMaps.getScenicSpotPage, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.scenicPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getHotelPage({ data, callback }: ReqData) {
    const res = await request<HotelPage>(urlMaps.baseHotelUrl, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.hotelPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getRestaurantPage({ data, callback }: ReqData) {
    const res = await request<RestaurantPage>(urlMaps.baseRestaurantUrl, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.restaurantPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async getTripModePage({ data, callback }: ReqData) {
    const res = await request<TripModePage>(urlMaps.baseTripModeUrl, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.tripModePage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getPicturePage({ data, callback }: ReqData) {
    const res = await request<PicturePage>(urlMaps.basePictureUrl, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.picturePage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getVideoPage({ data, callback }: ReqData) {
    const res = await request<VideoPage>(urlMaps.baseVideoUrl, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.videoPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getBasicProductsPage({ data, callback }: ReqData) {
    const res = await request<VideoPage>(urlMaps.baseBasicProductsUrl, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.basicProductsPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async CreateScenicSpot({ data, callback }: ReqData) {
    const res = await request<ScenicCreate>(urlMaps.CreateScenicSpot, data, {
      method: 'POST'
    });

    if (res.code === 0) {
      this.scenicCreate = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async CreateHotel({ data, callback }: ReqData) {
    const res = await request<HotelCreate>(urlMaps.HotelUrl, data, {
      method: 'POST'
    });

    if (res.code === 0) {
      this.hotelCreate = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async CreateRestaurant({ data, callback }: ReqData) {
    const res = await request<RestaurantCreate>(urlMaps.RestaurantUrl, data, {
      method: 'POST'
    });

    if (res.code === 0) {
      this.restaurantCreate = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async CreateTripMode({ data, callback }: ReqData) {
    const res = await request<TripModeCreate>(urlMaps.TripModeUrl, data, {
      method: 'POST'
    });

    if (res.code === 0) {
      this.tripModeCreate = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async CreatePicture({ data, callback }: ReqData) {
    const res = await request<PictureCreate>(urlMaps.PictureUrl, data, {
      method: 'POST'
    });

    if (res.code === 0) {
      this.pictureCreate = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async CreateVideo({ data, callback }: ReqData) {
    const res = await request<VideoCreate>(urlMaps.VideoUrl, data, {
      method: 'POST'
    });

    if (res.code === 0) {
      this.videoCreate = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async CreateBasicProducts({ data, callback }: ReqData) {
    const res = await request<BasicProductsCreate>(
      urlMaps.BasicProductsUrl,
      data,
      {
        method: 'POST'
      }
    );

    if (res.code === 0) {
      this.basicProductsCreate = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async EditScenicSpot({ data, callback }: ReqData) {
    const res = await request<ScenicPage>(urlMaps.CreateScenicSpot, data, {
      method: 'PUT'
    });

    if (res.code === 0) {
      this.scenicPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async EditHotel({ data, callback }: ReqData) {
    const res = await request<HotelPage>(urlMaps.HotelUrl, data, {
      method: 'PUT'
    });

    if (res.code === 0) {
      this.hotelPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async EditRestaurant({ data, callback }: ReqData) {
    const res = await request<RestaurantPage>(urlMaps.RestaurantUrl, data, {
      method: 'PUT'
    });

    if (res.code === 0) {
      this.restaurantPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async EditTripMode({ data, callback }: ReqData) {
    const res = await request<TripModePage>(urlMaps.TripModeUrl, data, {
      method: 'PUT'
    });

    if (res.code === 0) {
      this.tripModePage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async EditPicture({ data, callback }: ReqData) {
    const res = await request<PicturePage>(urlMaps.PictureUrl, data, {
      method: 'PUT'
    });

    if (res.code === 0) {
      this.picturePage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async EditVideo({ data, callback }: ReqData) {
    const res = await request<VideoPage>(urlMaps.VideoUrl, data, {
      method: 'PUT'
    });

    if (res.code === 0) {
      this.videoPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async EditBasicProducts({ data, callback }: ReqData) {
    const res = await request<BasicProductsPage>(
      urlMaps.BasicProductsUrl,
      data,
      {
        method: 'PUT'
      }
    );

    if (res.code === 0) {
      this.basicProductsPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getScenicSpotSingle({ data, callback }: ReqData) {
    const res = await request<ScenicCreateSingle>(
      urlMaps.getScenicSpotSingle,
      data,
      {
        method: 'GET'
      }
    );

    if (res.code === 0) {
      this.scenicCreateSingle = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getHotelSingle({ data, callback }: ReqData) {
    const res = await request<HotelSingle>(urlMaps.HotelUrl, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.hotelSingle = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getRestaurantSingle({ data, callback }: ReqData) {
    const res = await request<RestaurantSingle>(urlMaps.RestaurantUrl, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.restaurantSingle = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getTripModeSingle({ data, callback }: ReqData) {
    const res = await request<TripModeSingle>(urlMaps.TripModeUrl, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.tripModeSingle = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getPictureSingle({ data, callback }: ReqData) {
    const res = await request<PictureSingle>(urlMaps.PictureUrl, data, {
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
    const res = await request<VideoSingle>(urlMaps.VideoUrl, data, {
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
  async getProductSingle({ data, callback }: ReqData) {
    const res = await request<ProductSingle>(urlMaps.BasicProductsUrl, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.productSingle = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async DeleteScenic({ data, callback }: ReqData) {
    const res = await request<ScenicDelete>(
      urlMaps.DeleteScenic + '?id=' + data.id,
      data,
      {
        method: 'DELETE'
      }
    );

    if (res.code === 0) {
      this.scenicDelete = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async DeleteHotel({ data, callback }: ReqData) {
    const res = await request<HotelDelete>(
      urlMaps.HotelUrl + '?id=' + data.id,
      data,
      {
        method: 'DELETE'
      }
    );

    if (res.code === 0) {
      this.hotelDelete = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async DeleteRestaurant({ data, callback }: ReqData) {
    const res = await request<RestaurantDelete>(
      urlMaps.RestaurantUrl + '?id=' + data.id,
      data,
      {
        method: 'DELETE'
      }
    );

    if (res.code === 0) {
      this.restaurantDelete = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async DeleteTripMode({ data, callback }: ReqData) {
    const res = await request<TripModeDelete>(
      urlMaps.TripModeUrl + '?id=' + data.id,
      data,
      {
        method: 'DELETE'
      }
    );

    if (res.code === 0) {
      this.tripModeDelete = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async DeletePicture({ data, callback }: ReqData) {
    const res = await request<PictureDelete>(
      urlMaps.PictureUrl + '?id=' + data.id,
      data,
      {
        method: 'DELETE'
      }
    );

    if (res.code === 0) {
      this.pictureDelete = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async DeleteVideo({ data, callback }: ReqData) {
    const res = await request<VideoDelete>(
      urlMaps.VideoUrl + '?id=' + data.id,
      data,
      {
        method: 'DELETE'
      }
    );

    if (res.code === 0) {
      this.videoDelete = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async DeleteBasicProducts({ data, callback }: ReqData) {
    const res = await request<BasicProductsDelete>(
      urlMaps.BasicProductsUrl + '?id=' + data.id,
      data,
      {
        method: 'DELETE'
      }
    );

    if (res.code === 0) {
      this.basicProductsDelete = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
}

export default Resource;

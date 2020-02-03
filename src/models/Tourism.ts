import { observable, action, values } from 'mobx';
import request, { urlMaps, ResData, ReqData } from '../common/request';
import moment from 'moment';
export interface TourismPage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface OwnPicturePage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface CalendarPrice {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}

export interface TourismCreate {}
export interface TourismDelete {}
export interface ImageDelete {}
export interface Recommend {}
export interface UpDown {}
export interface TourismSingle {
  id: string;
  title: string;
  baseProductId: string;
  type: string;
  holiday: number;
  weekend: number;
  state: number;
  period: number;
  startTime: string;
  endTime: string;
  createTime: string;
  coverUrl: string;
  tagId: string;
  userId: string;
  recommend: number;
  bmMaterialList: any[];
  bmTourProductDaysList: any[];
  howDays: number;
}
export class Tourisms {
  @observable
  tourismPage: TourismPage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  ownPicturePage: OwnPicturePage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  calendarPrice: CalendarPrice = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };

  @observable
  tourismCreate: TourismCreate = {};
  @observable
  tourismDelete: TourismDelete = {};
  @observable
  imageDelete: ImageDelete = {};
  @observable
  recommend: Recommend = {};
  @observable
  upDown: UpDown = {};
  @observable
  tourismSingle: TourismSingle = {
    id: '',
    title: '',
    baseProductId: '',
    type: '',
    holiday: 0,
    weekend: 0,
    state: 0,
    period: 0,
    startTime: '',
    endTime: '',
    createTime: '',
    coverUrl: '',
    tagId: '',
    userId: '',
    recommend: 0,
    bmMaterialList: [],
    bmTourProductDaysList: [],
    howDays: 0
  };
  @action
  async getTourismPage({ data, callback }: ReqData) {
    const res = await request<TourismPage>(urlMaps.baseTouris, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.tourismPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getOwnPictures({ data, callback }: ReqData) {
    const res = await request<OwnPicturePage>(urlMaps.baseOwnPicture, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.ownPicturePage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getCalendarPrice({ data, callback }: ReqData) {
    const res = await request<CalendarPrice>(urlMaps.baseCalendarPrice, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.calendarPrice = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async CreateTourism({ data, callback }: ReqData) {
    const res = await request<TourismCreate>(urlMaps.baseTourisUrl, data, {
      method: 'POST'
    });

    if (res.code === 0) {
      this.tourismCreate = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async EditRecommend({ data, callback }: ReqData) {
    const res = await request<Recommend>(urlMaps.EditTourRecommoned, data, {
      method: 'PUT'
    });

    if (res.code === 0) {
      this.recommend = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async EditUpDown({ data, callback }: ReqData) {
    const res = await request<UpDown>(urlMaps.baseUp, data, {
      method: 'PUT'
    });

    if (res.code === 0) {
      this.upDown = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async EditTourism({ data, callback }: ReqData) {
    const res = await request<TourismPage>(urlMaps.baseTourisUrl, data, {
      method: 'PUT'
    });

    if (res.code === 0) {
      this.tourismPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async DeleteTourism({ data, callback }: ReqData) {
    const res = await request<TourismDelete>(
      urlMaps.baseTourisUrl + '?id=' + data.id,
      data,
      {
        method: 'DELETE'
      }
    );

    if (res.code === 0) {
      this.tourismDelete = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async DeleteImage({ data, callback }: ReqData) {
    const res = await request<ImageDelete>(
      urlMaps.deleteImg + '?id=' + data.id,
      data,
      {
        method: 'DELETE'
      }
    );

    if (res.code === 0) {
      this.imageDelete = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getTourismSingle({ data, callback }: ReqData) {
    const res = await request<TourismSingle>(urlMaps.baseTourisUrl, data, {
      method: 'GET'
    });
    // [0, 1, 2, 3, 4, 5, 6].map(num => res.data.bmTourProductDaysList.find(item => item.data.day() == num)).filter(item => typeof item == 'object');
    if (res.code === 0) {
      if (res.data.type === '1') {
        this.tourismSingle.bmTourProductDaysList = [
          res.data.bmTourProductDaysList[0]
        ];
      } else if (res.data.type === '2' && res.data.period === 1) {
        [0, 1, 2, 3, 4, 5, 6].forEach(num => {
          const target = res.data.bmTourProductDaysList.find(
            item => moment(item.data).day() == num
          );
          if (target) {
            this.tourismSingle.bmTourProductDaysList.push(target);
          }
        });
      } else if (res.data.type === '2' && res.data.period === 2) {
        [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          26,
          27,
          28,
          29,
          30,
          31
        ].forEach(num => {
          const target = res.data.bmTourProductDaysList.find(
            item => moment(item.data).get('D') == num
          );
          if (target) {
            this.tourismSingle.bmTourProductDaysList.push(target);
          }
        });
      } else if (res.data.type === '3') {
        this.tourismSingle.bmTourProductDaysList = res.data.bmTourProductDaysList.filter(
          item =>
            moment(item.data).get('D') <= 31 || moment(item.data).get('D') >= 1
        );
      }
      this.tourismSingle = {
        ...res.data,
        bmTourProductDaysList: this.tourismSingle.bmTourProductDaysList
      };
    }
    if (callback) {
      callback(res);
    }
  }
  @action EditPrice = (value: any, content: any) => {
    let target: any;
    let typeCycle = content.type;
    let periodCycle = content.period;
    const dataPicker = moment(value.data.valueOf()).day();
    const num = moment(value.data.valueOf()).get('D');
    if (typeCycle === '1') {
      target = this.tourismSingle.bmTourProductDaysList[0];
    } else if (typeCycle === '2' && periodCycle === 1) {
      target = this.tourismSingle.bmTourProductDaysList.find(
        item => moment(item.data).day() === dataPicker
      );
    } else if (typeCycle === '2' && periodCycle === 2) {
      target = this.tourismSingle.bmTourProductDaysList.find(
        item => moment(item.data).get('D') === num
      );
    } else if (typeCycle === '3') {
      target = this.tourismSingle.bmTourProductDaysList.find(
        item => value.data === item.data
      );
    }
    if (target) {
      target.price = value.price;
      target.childrenPrice = value.childrenPrice;
      target.babyPrice = value.babyPrice;
      console.log('编辑start');
    } else {
      console.log('添加start');
      this.tourismSingle.bmTourProductDaysList.push(value);
      console.log('添加end');
    }
  };
  @action ClearPrice = () => {
    this.tourismSingle.bmTourProductDaysList = [];
  };
  @action EditStartTime = (value: any) => {
    console.log('TCL: @actionEditStartTime -> value', value);
  };
  @action EditEndTime = (value: any) => {
    console.log('TCL: @actionEditEndTime -> value', value);
  };
}
export default Tourisms;

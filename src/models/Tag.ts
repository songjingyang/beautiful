import { observable, action } from 'mobx';
import request, { urlMaps, ResData, ReqData } from '../common/request';
export interface TagPage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface TagDelete {}
export interface CreateTag {}
export interface StateTag {}
export interface TagSingle {
  id: string;
  title: string;
  subtitle: string;
  state: number;
  startTime: string;
  endTime: string;
  sort: number;
}
export class Tag {
  @observable
  tagPage: TagPage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  tagDelete: TagDelete = {};
  @observable
  createTag: CreateTag = {};
  @observable
  stateTag: StateTag = {};

  @observable
  tagSingle: TagSingle = {
    id: '',
    title: '',
    subtitle: '',
    state: 2,
    startTime: '',
    endTime: '',
    sort: 0
  };
  @action
  async getTagPage({ data, callback }: ReqData) {
    const res = await request<TagPage>(urlMaps.baseTag, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.tagPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async DeleteTag({ data, callback }: ReqData) {
    const res = await request<TagPage>(
      urlMaps.baseTagUrl + '?id=' + data.id,
      data,
      {
        method: 'DELETE'
      }
    );

    if (res.code === 0) {
      this.tagPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async CreateTag({ data, callback }: ReqData) {
    const res = await request<CreateTag>(urlMaps.baseTagUrl, data, {
      method: 'POST'
    });

    if (res.code === 0) {
      this.createTag = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async EditTag({ data, callback }: ReqData) {
    const res = await request<CreateTag>(urlMaps.baseTagUrl, data, {
      method: 'PUT'
    });

    if (res.code === 0) {
      this.createTag = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async getTagSingle({ data, callback }: ReqData) {
    const res = await request<TagSingle>(urlMaps.baseTagUrl, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.tagSingle = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async EditState({ data, callback }: ReqData) {
    const res = await request<StateTag>(urlMaps.editTag, data, {
      method: 'PUT'
    });

    if (res.code === 0) {
      this.stateTag = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
}
export default Tag;

import { observable, action } from 'mobx';
import request, { urlMaps, ResData, ReqData } from '../common/request';
export interface AnswerPage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface UserAnswerPage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface UserAnswerDelete {}
export interface AnswerShelf {}
export interface AnswerState {}
export interface UserAnswer {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}

export interface AnswerSingle {
  id: string;
  title: string;
  subtitle: string;
  state: number;
  startTime: string;
  endTime: string;
  sort: number;
}
export class Answer {
  @observable
  answerPage: AnswerPage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  userAnswer: UserAnswer = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };

  @observable
  userAnswerPage: UserAnswerPage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };

  @observable
  userAnswerDelete: UserAnswerDelete = {};
  @observable
  answerShelf: AnswerShelf = {};
  @observable
  answerState: AnswerState = {};

  @action
  async getAnswerPage({ data, callback }: ReqData) {
    const res = await request<AnswerPage>(urlMaps.baseAnswer, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.answerPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async getUserAnswer({ data, callback }: ReqData) {
    const res = await request<UserAnswer>(urlMaps.baseUserAnswer, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.userAnswer = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async getUserAnswerPage({ data, callback }: ReqData) {
    const res = await request<UserAnswerPage>(urlMaps.userAnswer, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.userAnswerPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async DeleteUserAnswer({ data, callback }: ReqData) {
    const res = await request<UserAnswer>(
      urlMaps.baseAnswerUrl + '?id=' + data.id,
      data,
      {
        method: 'DELETE'
      }
    );

    if (res.code === 0) {
      this.userAnswerDelete = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async EnableShutDown({ data, callback }: ReqData) {
    const res = await request<AnswerShelf>(urlMaps.upOrDown, data, {
      method: 'PUT'
    });
    if (res.code === 0) {
      this.answerShelf = res.data;
    }
    if (callback) {
      callback(res);
    }
  }

  @action
  async EnableState({ data, callback }: ReqData) {
    const res = await request<AnswerState>(urlMaps.editState, data, {
      method: 'PUT'
    });
    if (res.code === 0) {
      this.answerState = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
}
export default Answer;

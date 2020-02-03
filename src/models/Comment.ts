import { observable, action } from 'mobx';
import request, { urlMaps, ResData, ReqData } from '../common/request';
export interface CommentPage {
  records: any[];
  pages: number;
  searchCount: boolean;
  size: number;
  total: number;
  current: number;
}
export interface CommentDelete {}

export interface CommentSingle {
  id: string;
  title: string;
  subtitle: string;
  state: number;
  startTime: string;
  endTime: string;
  sort: number;
}
export class Comment {
  @observable
  commentPage: CommentPage = {
    records: [],
    pages: 1,
    searchCount: true,
    size: 10,
    total: 0,
    current: 1
  };
  @observable
  commentDelete: CommentDelete = {};
  @action
  async getCommentPage({ data, callback }: ReqData) {
    const res = await request<CommentPage>(urlMaps.baseComment, data, {
      method: 'GET'
    });

    if (res.code === 0) {
      this.commentPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
  @action
  async DeleteComment({ data, callback }: ReqData) {
    const res = await request<CommentPage>(
      urlMaps.baseCommentUrl + '?id=' + data.id,
      data,
      {
        method: 'DELETE'
      }
    );

    if (res.code === 0) {
      this.commentPage = res.data;
    }
    if (callback) {
      callback(res);
    }
  }
}
export default Comment;

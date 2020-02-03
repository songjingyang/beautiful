import { notification, message } from 'antd';
import axios from 'axios';
import { generatePath } from 'react-router-dom';
import urlMaps, { baseUrl } from './urlMaps';
import { getQueryString } from '../utils/utils';

export { urlMaps };

export interface ReqData {
  data?: any;
  callback?(res: any): void;
}

export interface ResData<T> {
  code: string | number;
  msg: string;
  ts: number;
  data: T;
}
declare global {
  interface Window {
    timeDiff: number;
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request<T>(
  url: string,
  data: any,
  options: any = { method: 'GET' }
): Promise<ResData<T>> {
  options.originUrl = url;
  url = baseUrl + url;
  data = data || {};
  let newOptions = { ...options, data: data };
  let user =
    JSON.parse(window.localStorage.getItem('user_cloud') as string) || {};
  newOptions.headers = newOptions.headers || {};
  if (user) {
    // newOptions.headers.uid = user.data.id;
    // newOptions.headers.sign = '123456';
    newOptions.headers.Authorization = localStorage.getItem('user_cloud')
      ? 'Bearer ' + user.accessToken
      : 'Basic cGlnOnBpZw==';
  }

  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.data instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers
      };
      console.log('TCL:   newOptions.data', newOptions.data);
      newOptions.data = JSON.stringify(newOptions.data);
    } else {
      // newOptions.data is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers
      };
    }
  } else if (newOptions.method === 'GET') {
    newOptions.params = newOptions.data;
    newOptions.headers = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      ...newOptions.headers
    };
  }
  newOptions.url = newOptions.url || url;
  return axios(newOptions)
    .then(
      (response: any) => {
        if (!('code' in response.data)) {
          const resData = response;
          return {
            code: 200,
            msg: '',
            data: resData,
            ts: new Date().getTime(),
            loading: false
          } as ResData<T>;
        }
        if (response.data.code === 1000) {
          window.location.href = generatePath('/user/login');
          localStorage.removeItem('user_cloud');
        } else if (response.data.code !== 0 && response.data.code !== '0') {
          notification.error({
            message: `请求错误 ${response.status}: ${response.url}`,
            description: response.data.msg
          });
        } else if (response.data.ts) {
          window.timeDiff = new Date().getTime() - response.data.ts * 1000;
        }
        return { ...response.data, loading: false };
      },
      (res: any) => {
        const response = res.response;
        if (response && response.data) {
          if (response.data.code === '-800') {
            window.location.href = generatePath('/user/login');
            localStorage.removeItem('user_cloud');
          } else if (response.data.code !== '1') {
            notification.error({
              message: `请求错误 ${response.status}: ${response.url}`,
              description: response.data.msg
            });
          } else if (response.data.code !== 200) {
            notification.error({
              message: `请求错误 ${response.status}: ${response.url}`,
              description: response.data.msg
            });
          }
        }
        return response;
      }
    )
    .catch(e => {
      console.log('e :', e);
    });
}

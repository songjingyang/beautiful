import { parse, stringify } from 'qs';
import { Form, InputNumber, Modal, Spin, Icon } from 'antd';
import moment from 'moment';
import React from 'react';
import math from 'mathjs';
import './utils.less';
export function createForm() {
  return function(componentClass: any) {
    return Form.create()(componentClass) as any;
  };
}
export function getQueryString(name: string, url = ''): string | null {
  url = url || window.location.search;
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = url.substr(1).match(reg);
  if (r != null) {
    console.log('TCL: unescape(r[2])', unescape(r[2]));
    return unescape(r[2]);
  }
  return null;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path: string) {
  return reg.test(path);
}

export function dateFormater(time: string) {
  if (time && time.length !== 0) {
    let timer = Number(time);
    return moment(timer).format('YYYY-MM-DD HH:mm:ss');
  } else {
    return '- - - - - - - - - - - - -';
  }
}
export function MoneyFormatter(money: number) {
  if (money) {
    return Number(
      math.divide(math.bignumber(money), math.bignumber(100)).valueOf()
    );
  } else {
    return 0;
  }
}
export function Rgb() {
  //rgb颜色随机
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  return 'rgb(' + r + ',' + g + ',' + b + ')'; //所有方法的拼接都可以用ES6新特性`其他字符串{$变量名}`替换
}
export function countDown(DoSomething: any) {
  let secondsToGo = 20;
  const modal = Modal.info({
    title: (
      <span style={{ textAlign: 'center', color: '#d00' }}>数据响应中...</span>
    ),
    content: `Loading...`,
    icon: '',
    className: 'ShowOrHide'
  });
  const timer = setInterval(() => {
    secondsToGo -= 1;
    modal.update({
      content: (
        <div>
          <Spin
            style={{ marginLeft: '120px', marginTop: '20px' }}
            size="large"
          />
        </div>
      )
    });
  }, 1000);
  setTimeout(() => {
    clearInterval(timer);
    modal.destroy();
    DoSomething();
  }, secondsToGo * 1000);
}

export function setTimes(value: number) {
  var secondTime = parseInt(value + ''); // 秒
  var minuteTime = 0; // 分
  var hourTime = 0; // 小时
  if (secondTime > 60) {
    //如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60 + '');
    //获取秒数，秒数取佘，得到整数秒数
    secondTime = parseInt((secondTime % 60) + '');
    //如果分钟大于60，将分钟转换成小时
    if (minuteTime > 59) {
      //获取小时，获取分钟除以60，得到整数小时
      hourTime = parseInt(minuteTime / 60 + '');
      //获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = parseInt((minuteTime % 60) + '');
    }
  }
  var result = '' + parseInt(secondTime + '') + '秒';

  if (minuteTime > 0 || minuteTime === 0) {
    result = '' + parseInt(minuteTime + '') + '分' + result;
  }
  if (hourTime > 0) {
    result = '' + parseInt(hourTime + '') + '小时' + result;
  }
  return result;
}
export function Biography(data: any) {
  const array = Object.keys(data);
  const array_bio: any = [];
  array.map((item: any, index: number) => {
    array_bio.push(data[item] ? '&' + item + '=' + data[item] : '');
  });
  return array_bio
    .filter(Boolean)
    .toString()
    .replace(/,/g, '')
    .replace('&', '?');
}

const CryptoJS = require('crypto-js'); //引用AES源码js
const key = CryptoJS.enc.Utf8.parse('2zxmiramartravel'); //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('2zxmiramartravel'); //十六位十六进制数作为密钥偏移量

//加密方法
export function Encrypt(word: string) {
  let srcs = CryptoJS.enc.Utf8.parse(word);
  console.log('TCL: Encrypt -> srcs', srcs);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  console.log('TCL: Encrypt -> encrypted', encrypted);
  var hexStr = encrypted.ciphertext.toString().toUpperCase();
  var oldHexStr = CryptoJS.enc.Hex.parse(hexStr);
  var base64Str = CryptoJS.enc.Base64.stringify(oldHexStr);
  return base64Str;
}
export function IndexOfHttp(url: string) {
  let isIndexOf = url.includes('http' || 'https');
  if (isIndexOf) {
    return url;
  } else {
    return 'https://' + url;
  }
}
//节假日

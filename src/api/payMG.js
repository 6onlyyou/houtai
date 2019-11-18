import axios from 'axios';
import { req } from './axiosFun';

/**
 * 公告栏
 **/


export const MachineConfigList = (params) => { return req("post", "/api/mngservice/api/banner/query", params) };
  //  req("post", "/api/mngservice/api/banner/query", params)

  // return axios({
  //   method: method,
  //   url: url,
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //     //token: localStorage.getItem('logintoken')
  //   },
  //   data: params,
  //   dataType: 'jsoup',
  //   traditional: true
  // })

export const MachineConfigset = (params) => { return req("post", "/api/mngservice/api/banner/edit", params) };
export const MachineConfigSave = (params) => { return req("post", "/api/mngservice/api/banner/add", params) };
export const MachineConfigDelete = (params) => { return req("post","/api/mngservice/api/banner/delete" , params )};
export const OrderList = (params) => { return req("post","/api/mngservice/api/bill/query" , params )};

import axios from 'axios';
import { req } from './axiosFun';

/**
 * 公告栏
 *
 * */
export const MachineConfigList = (params) => { return req("post", "/api/banner/query", params) };
export const MachineConfigset = (params) => { return req("post", "/api/banner/edit", params) };
export const MachineConfigSave = (params) => { return req("post", "/api/banner/add", params) };
export const MachineConfigDelete = (params) => { return req("post","/api/banner/delete" , params )};
export const OrderList = (params) => { return req("post","/api/bill/query" , params )};

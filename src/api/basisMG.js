import {req} from './axiosFun';

/**
 * 商品管理
 **/
// 商品管理-获取商品管理列表
export const GoodsList = (params) => { return req("post", "/api/Goods/list", params) };
// 商品管理-保存商品管理
export const GoodsSave = (params) => { return req("post", "/api/Goods/save", params) };


/**
 * 货道信息管理
 **/
// 货道信息管理-保存货道信息管理
export const MachineAisleRsave = (params) => { return req("post", "/api/MachineAisle/save", params) };

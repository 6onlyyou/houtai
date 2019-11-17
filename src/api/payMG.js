import axios from 'axios';
import { req } from './axiosFun';

/**
 * 公告栏
 **/
export const MachineConfigList = (params) => {/* return axios.post( "http://localhost:8080/mngservice/api/banner/query")*/
   req("post", "/api/mngservice/api/banner/query", params)

  return axios({
    method: method,
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      //token: localStorage.getItem('logintoken')
    },
    data: params,
    dataType: 'jsoup',
    traditional: true
  })

 };
export const MachineConfigSave = (params) => { return req("post", "/api/MachineConfig/save", params) };
export const MachineConfigDelete = (params) => { return axios.delete("/api/MachineConfig/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };



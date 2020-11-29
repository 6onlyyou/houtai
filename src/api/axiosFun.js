import axios from 'axios';

// 通用公用方法
const req = (method, url, params) => {
    return axios({
        method: method,
        url: (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi' : '/mngservice')+url,
        data: params,
        dataType: "JSONP",
        transformRequest: [
            function(data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }
        ]
    }).then(
    res =>res.data
    );
};

export {
    req
}

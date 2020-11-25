import axios from 'axios';


// 通用公用方法
const req = (method, url, params) => {
    return axios({
        method: method,
        // url: "/proxyApi"+url, //本地
        url: "/mngservice"+url, //线上
        data: params,
        dataType: "JSONP",

        transformRequest: [
            function(data) {

                let ret = ''
                for (let it in data) {
                    ret +=
                        encodeURIComponent(it) +
                        '=' +
                        encodeURIComponent(data[it]) +
                        '&'
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

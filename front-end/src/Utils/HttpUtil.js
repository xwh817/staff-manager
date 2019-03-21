
/**
 * 对fetch方法进行基础封装，统一请求参数，使直接返回Json格式。
 */
export default class HttpUtil {

    /**
     * http get请求
     */
    static get(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
            .then(response => response.json())  // 将文本结果转成json对象
            .then(result => resolve(result))
            .catch(error => {
                reject(error.message);
            })
        });
    }


    /**
     * http post请求
     */
    static post(url, data) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                header: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)  // 将json对象转成文本
            })
            .then(response => response.json())
            .then(result => resolve(result))
            .catch(error => {
                reject(error.message);
            })
        });
    }


}
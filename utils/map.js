// request的promise封装
const myRequest = require('./request.js')

// key为开通位置服务所获取的查询值
let key = ''

/*
 * 搜索地区...  
 * 搜索地区的商圈， 如搜索 kfc 广州市
 * key {String} 搜索内容  
 * region {String} 搜索区域  
 */
export function searchRegion(kw, region) {
    let opts = {
        keyword: encodeURI(kw),
        boundary: region ? `region(${encodeURI(region)}, 0)` : '', // 0 为限定范围搜搜索，1为开放范围搜素偶
        page_size: 10, // 搜索结果分页最大条数
        page_index: 1, // 指定分页
        key
    }

    return new Promise((resolve, rej) => {
        myRequest.fnGet(
            {
                url: 'https://apis.map.qq.com/ws/place/v1/search',
                data: opts
            }).then(res => {
            resolve(res.data)
        })
    })
}

/*
 * 搜索附近的...  
 * 以当前位置的经纬度搜索附近商圈，如附近的酒店，快餐等等
 * key {String} 搜索内容  
 * params {Object} 搜索参数 包含三个参数 lat纬度，lng经度，distance范围(单位米)  
 */
export function searchCircle(kw, params = {}) {
    let {
        lat,
        lng,
        distance
    } = params
    if (!lat && !lng) return
    if (!distance) distance = 1000 // 搜索范围默认1000米
    let opts = {
        keyword: encodeURI(kw),
        boundary: `nearby(${lat},${lng},${distance})`,
        orderby: '_distance', // 范围搜索支持排序，由近及远  
        page_size: 20, // 搜索结果分页最大条数  
        page_index: 1, // 指定分页  
        key
    }

    return new Promise((resolve, rej) => {
        myRequest.fnGet(
            {
                url: 'https://apis.map.qq.com/ws/place/v1/search',
                data: opts
            }).then(res => {
            resolve(res.data)
        })
    })
}

// 所在地的城市，省份等区域信息
/*
 * 所在地的城市，省份等区域信息  
 * 如当前地址所在省份、城市  
 * lat {Number} 纬度
 * lng {Number} 经度  
 */
export function myCity(lat, lng) {
    return new Promise((resolve, rej) => {
        let opts = {
            location: `${lat},${lng}`,
            key
        }

        myRequest.fnGet(
            {
                url: 'https://apis.map.qq.com/ws/geocoder/v1/',
                data: opts
            }).then(res => {
            resolve(res.result)
        })
    })
}

/**
 * let endPoint = JSON.stringify({ //终点
    'name': lastAddrItem.shortAddress,
    'latitude': parseFloat(lastAddrItem.latitude),
    'longitude': parseFloat(lastAddrItem.longitude)
});
 * @param {*} param0 
 */
export function routePlan(options) {
    //let plugin = requirePlugin('routePlan');
    console.log(options)
    let referer = '找专线'
    wx.navigateTo({
        url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + JSON.stringify(options) + '&navigation=1'
    })
}

import { $confirm } from './dialog.js'
function fetch(params) {
    const token = wx.getStorageSync('token') || ''
    if (params.loadingText) {
        wx.showLoading({
          title: params.loadingText,
        })
    }
    return new Promise((resolve, reject) => {
        // 域名处理
        let sendUrl = params.url
        wx.request({
            url: sendUrl,
            data: params.data || {},
            method: params.method || 'POST',
            timeout: 12000,
            responseType: params.responseType || 'text',
            header: {
                'token': token,
                "Content-Type": params.contentType || "application/json",
            },
            success: async function (ret) {
                wx.hideLoading()
                console.log(ret)
                if (params.responseType) {
                    return resolve(ret)
                }
                if (ret.data.code == 0 || ret.data.status == 0 || ret.data.success) {
                    return resolve(ret.data)
                } else if (ret.data && ret.data.data && ret.data.data.code == '99902000') {
                    // token过期
                    wx.hideLoading()
                    $confirm('未登录或登录过期，请登录', false).then(res => {
                        if (res) {
                            wx.redirectTo({
                                url: '/pages/login/login',
                              })
                        } else {
                            wx.navigateBack()
                        }
                    })
                } else {
                    wx.showToast({
                        title: ret.data.msg || ret.data.message || '系统出了点小差错，请联系管理员。',
                        icon: 'none',
                        duration: 4000,
                    }) 
                    return reject(ret)
                }
            },
            fail: function (err) {
                console.warn(JSON.stringify(err))
                console.warn('地址', sendUrl)
                wx.hideLoading()
                wx.showToast({
                    title: '系统出了点小差错，请联系管理员。',
                    icon: 'none',
                    duration: 2000,
                })
                return reject(err)
            }
        });
    })
    
}
function fnGet(config) {
    return fetch({
        method: 'GET',
        ...config
    })
}

function fnPost(config) {
    return fetch({
        method: 'POST',
        ...config
    })
}

function fnDelete(config) {
    return fetch({
        method: 'DELETE',
        ...config
    })
}

function fnPut(config) {
    return fetch({
        method: 'PUT',
        ...config
    })
}

/**
 * 
 * @param {图片递归压缩}}
 */
function checkImgSize({path, compressSize=100, quality=90}) {
    return new Promise(async (resolve, reject) => {
        const imgSize = await getFileInfo(path)
        const sizekb = Math.floor(imgSize/1024 * 100 ) / 100
        
        if (sizekb < compressSize) {
            return resolve([path])
        }

        // if(!/(.png|.jpeg|.jpg)$/.test(path)) {
        //     reject(`${'图片类型必须为jpg: ' + path}`)
        // }

        handleCompress({quality, resolve, reject})

        async function handleCompress({quality, resolve, reject}) {
            let curQuality = quality

            if (curQuality == 0) {
                return reject(`无能为力了~`)
            }

            const compressResult = await compressImage({path, quality: curQuality})
            const imgSize = await getFileInfo(compressResult)
            const imgSizeKb =  Math.floor(imgSize/1024 * 100 ) / 100
            console.log('压缩后的图片大小', imgSizeKb , `原大小：${sizekb}`)
            if (imgSizeKb < compressSize) {
                return resolve([compressResult])
            } else {
                handleCompress({
                    quality: quality-10,
                    resolve,
                    reject
                })
            }
            
        }

        function compressImage({path, quality}) {
            return new Promise((resolve, reject) => {
                wx.compressImage({
                    src: path,
                    quality: quality,
                    success: res => {
                        resolve(res.tempFilePath)
                    }
                })
            })
        }

        function getFileInfo(path) {
            return new Promise((resolve, reject) => {
                wx.getFileInfo({
                    filePath: path,
                    success: res => {
                        resolve(res.size)
                    },
                    fail: error => {
                        reject(error)
                    }
                })
            })
        }
    })

}

function handleParams(params) {
    if (!params) {
        return  {};
    }

    for (let i in params) {
        if (Object.prototype.toString.call(params[i]) === '[object Object]') {
            params[i] = handleParams(params[i])
        }

        if (Object.prototype.toString.call(params[i]) === '[object Array]') {
            
        }
    }
    return params
}

function upLoadFile(upLoadConfig, upLoadValue) {
    return new Promise((resolve, reject) => {
        let config = Object.assign({}, {
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            key: ''
        }, upLoadConfig)
        wx.chooseImage({
            count: config.count,
            sizeType: config.sizeType,
            sourceType: config.sourceType,
            success(res) {
                wx.showToast({
                    title: '正在上传...',
                    icon: 'loading',
                    mask: true,
                    duration: 10000
                })
                const tempFilePaths = res.tempFilePaths
                let data = handleParams(upLoadValue)
                let app = getApp();
                const token = wx.getStorageSync('token') || ''
                wx.uploadFile({
                    url: app.config.urlConfig.url + 'sf/customerOrder/uploadImg',
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: data,
                    header: {
                        "Content-Type": "multipart/form-data",
                        token: token
                    },
                    success(res) {
                        console.log('上传图片结果', res)
                        try {
                            res.data = JSON.parse(res.data)
                            if (res.data.success) {
                                wx.showToast({
                                    title: '上传成功',
                                    icon: 'none',
                                })
                                resolve(res.data, null);
                            } else {
                                wx.showToast({
                                    title: res.data.message || '上传失败',
                                    icon: 'none',
                                    duration: 2000,
                                })
                                reject(res)
                            }
                        } catch (error) {
                            wx.showToast({
                                title: '上传失败',
                                icon: 'none',
                                duration: 2000,
                            })
                            reject(res)
                        }
                    }
                })
            }
        })
    })
}

function getIfAuth() {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: res => {
                if (!res.authSetting['scope.userInfo']) {
                    // 用户没授权
                    resolve(true)
                } else {
                    resolve(false)
                }
            }
        })
    })
}

module.exports = {
    fnGet,
    fnPost,
    fnDelete,
    upLoadFile,
    fnPut,
    getIfAuth
}

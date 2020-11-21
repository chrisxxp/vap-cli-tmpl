
/**
 * 获取用户是否对某一操作进行了授权
 * @param {*} value 授权的scope name 比如 scope.userInfo
 */
import { $confirm } from './dialog.js'

export const checkPermission = function (value) {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success(res) {
                if (res.authSetting[value]) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }
        })
    })
}

export const getLocation = function () {
    return new Promise((resolve, reject) => {
        wx.getLocation({
            type: 'wgs84',
            success: res => {
                resolve(res)
            },
            fail: err => {
                if (err.errMsg === 'getLocation:fail auth deny') {
                    // 用户拒绝了获取地理位置 弹窗告知用户重新设置
                    $confirm('需要重新打开获取位置设置')
                        .then(res => {
                            if (res) {
                                wx.openSetting({
                                    success: res => {
                                        wx.getLocation({
                                            type: 'wgs84',
                                            success: res => {
                                                resolve(res)
                                            },
                                        })
                                    },
                                    fail(err) {
                                        resolve(false)
                                    }
                                })
                            } else {
                                resolve(false)
                            }
                        })
                }
            }
        })
    })
}
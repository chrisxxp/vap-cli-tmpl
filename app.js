//app.js
require('./utils/page_extension.js');
const config = require('config');
import { fnPost } from './utils/request'

App({
    config,
    onLaunch: function () {
        // 检测版本更新
        this.handleUpdate()
        this.getUserInfo()
        // wx登录获取code
        this.wxlogin()
    },

    getUserInfo() {
        let userInfo = wx.getStorageSync('userInfo')
        this.globalData.userInfo = userInfo || ''
    },

    wxlogin() {
        return new Promise((resolve, reject) => {
            wx.login({
                success: (res) => {
                    if (res.code) {
                        this.globalData.code = res.code || ''
                        console.log(`code: ${res.code}`)
                        resolve(res.code)
                    }
                }
            })
        })
    },

    getCode() {
        return new Promise((resolve, reject) => {
            wx.checkSession({
                success: () => {
                    console.log('有效')
                    //session_key 未过期，并且在本生命周期一直有效
                    resolve(this.globalData.code)
                },
                fail:() => {
                    console.log('code失效，重新获取')
                    // session_key 已经失效，需要重新执行登录流程
                    this.wxlogin().then(res => {
                        resolve(res)
                    })
                }
            })
        })
    },

    handleUpdate: function () {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(res => {

        })

        updateManager.onUpdateReady(() => {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否马上重启小程序？',
                success: res => {
                    if (res.confirm) {
                        updateManager.applyUpdate()
                    }
                }
            })
        })
    },
    globalData: {
        userInfo: null,
        appid: wx.getAccountInfoSync().miniProgram.appId
    },
})
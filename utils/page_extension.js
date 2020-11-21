/**
 * @method 扩展 Page 对象
 * 
 * @param Page {Object} 系统原始的Page对象
 * @return {function} 返回新的Page构造器
 */
import http from "./request.js";
import util from "./util.js";
import dialog from "./dialog.js";

function initPageExtension(Page) {
    // 返回一个新的 Page 构造器
    return function (page) {

        const app = getApp()
        for (let i in dialog) {
            page[i] = dialog[i]
        }

        for (let i in http) {
            page[i] = http[i]
        }

        page.$app = app
        page.$util = util

        // 打电话
        page.phone = function (e) {
            const phone = e.currentTarget.dataset.phone
            wx.makePhoneCall({
                phoneNumber: phone,
            })
        }

        // 调用原来的构造方法
        return Page(page);
    };
}

// 扩展 Page 对象
const originalPage = Page;
Page = initPageExtension(originalPage);
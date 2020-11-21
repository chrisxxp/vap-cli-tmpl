// toast
exports.$toast = function (title, type, duration) {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: title || '成功',
            icon: type || 'none',
            duration: duration || 1000,
            mask: true,
        })

        setTimeout(() => {
            wx.hideToast()
            resolve()
        }, duration || 1000)
    })
}


// confirm 确认对话框
exports.$confirm = function (content, showCancel = true) {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: '提示',
            content: content,
            showCancel: showCancel,
            success: (res) => {
                if (res.confirm) {
                    resolve(true)
                } else if (res.cancel) {
                    resolve(false)
                }
            }
        })
    })
}

// showLoading loading 提示框
exports.$showLoading = function (title, mask = true) {
    return new Promise((resolve) => {
        wx.showLoading({
            title: title || '',
            mask: mask,
            success() {
                resolve(true)
            }
        })
    })
}

// showLoading loading 提示框
exports.$hideLoading = function () {
    return new Promise((resolve) => {
        wx.hideLoading({
            success() {
                resolve(true)
            }
        })
    })
}
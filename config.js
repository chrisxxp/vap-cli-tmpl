
// 生产环境地址
const proUrl = {
    url: '',
}

// 测试环境地址 
const testUrl = {
    url: '',
}


// 本地环境地质
const localUrl = {
    url: '',
}

const evn = 0// 0 生产； 1 测试；2 本地

const config = {
    imgUrl: '',
    urlConfig: evn===0?proUrl:(evn===1?testUrl:localUrl),
};
module.exports = config; 
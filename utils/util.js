

const dateUtil = (function () {
  //数据转化  
  function formatNumber(n) {
      n = n.toString()
      return n[1] ? n : '0' + n
  }

  /** 
   * 时间戳转化为年 月 日 时 分 秒 
   * number: 传入时间戳 
   * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
   */
  function formatTime(number, format = 'Y-M-D') {
      if (!number) {
        return ''
      }
      var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
      var returnArr = [];

      var date = new Date(Number(number));
      returnArr.push(date.getFullYear());
      returnArr.push(formatNumber(date.getMonth() + 1));
      returnArr.push(formatNumber(date.getDate()));

      returnArr.push(formatNumber(date.getHours()));
      returnArr.push(formatNumber(date.getMinutes()));
      returnArr.push(formatNumber(date.getSeconds()));

      for (var i in returnArr) {
          format = format.replace(formateArr[i], returnArr[i]);
      }
      return format;
  }


  /**
   * 日期获取
   */

  function getBeforeDate(day) {
      var dd = new Date();
      dd.setDate(dd.getDate() + day);
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
      var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
      return y + "-" + m + "-" + d;
  };


  /**
   * 获取某年某月有多少天
   */
  function mGetDate(year, month) {
      var d = new Date(year, month, 0);
      return d.getDate();
  }

  /**
   * 获取本月日期 2019-12-01  2019-12-31
   * 1.要获取当前月份
   * 2.获取当前月份有多少天
   */
  function getCurMonthDate() {
      const curDate = new Date()
      const curYear = curDate.getFullYear()
      const curMonth = (curDate.getMonth() + 1) < 10 ? "0" + (curDate.getMonth() + 1) : curDate.getMonth() + 1
      const curMonthDay = mGetDate(curYear, curMonth) < 10 ? "0" + mGetDate(curYear, curMonth) : mGetDate(curYear, curMonth)

      return [`${curYear}-${curMonth}-01`, `${curYear}-${curMonth}-${curMonthDay}`]
  }

  function getCurYearDate() {
      const curDate = new Date()
      const curYear = curDate.getFullYear()
      const endrMonth = 12
      const endMonthDay = mGetDate(curYear, endrMonth) < 10 ? "0" + mGetDate(curYear, endrMonth) : mGetDate(curYear, endrMonth)

      return [`${curYear}-01-01`, `${curYear}-12-${endMonthDay}`]
  }

  //获取最近一月的时间
  function getPassFormatDate() {
      var nowDate = new Date();
      var date = new Date(nowDate);
      var curentData = formatDate(date);
      date.setDate(date.getDate() - 30);
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
      }
      var currentdate = [year + seperator1 + month + seperator1 + strDate, curentData];
      return currentdate;
  }

  //获取最近一年的时间
  function getPassYearFormatDate() {
      var nowDate = new Date();
      var date = new Date(nowDate);
      date.setDate(date.getDate() - 365);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
      }
      var currentdate = [`${year}-${month}-${strDate}`, `${year + 1}-${month}-${strDate}`]
      return currentdate;
  }
  return {
      getBeforeDate,
      getCurMonthDate,
      getCurYearDate,
      getPassYearFormatDate,
      getPassFormatDate,
      formatTime
  }
})()

const checkUtil = (function() {
  function isPhone(phone) {
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(phone)) {
          return false;
      } else {
          return true;
      }
  }

  function isIdCard() {
      // 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。

      // 加权因子
      var weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      // 校验码
      var check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

      var code = idcode + "";
      var last = idcode[17]; //最后一位

      var seventeen = code.substring(0, 17);

      // ISO 7064:1983.MOD 11-2
      // 判断最后一位校验码是否正确
      var arr = seventeen.split("");
      var len = arr.length;
      var num = 0;
      for (var i = 0; i < len; i++) {
          num = num + arr[i] * weight_factor[i];
      }

      // 获取余数
      var resisue = num % 11;
      var last_no = check_code[resisue];

      // 格式的正则
      // 正则思路
      /*
      第一位不可能是0
      第二位到第六位可以是0-9
      第七位到第十位是年份，所以七八位为19或者20
      十一位和十二位是月份，这两位是01-12之间的数值
      十三位和十四位是日期，是从01-31之间的数值
      十五，十六，十七都是数字0-9
      十八位可能是数字0-9，也可能是X
      */
      var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

      // 判断格式是否正确
      var format = idcard_patter.test(idcode);

      // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
      return last === last_no && format ? true : false;
  }

  return {
      isIdCard,
      isPhone
  }
})()

const calculateUtil = (function() {

  /*
   * 判断obj是否为一个整数
   */
  function isInteger(obj) {
      return Math.floor(obj) === obj
  }

  /*
   * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
   * @param floatNum {number} 小数
   * @return {object}
   *   {times:100, num: 314}
   */
  function toInteger(floatNum) {
      var ret = {
          times: 1,
          num: 0
      }
      var isNegative = floatNum < 0
      if (isInteger(floatNum)) {
          ret.num = floatNum
          return ret
      }
      var strfi = floatNum + ''
      var dotPos = strfi.indexOf('.')
      var len = strfi.substr(dotPos + 1).length
      var times = Math.pow(10, len)
      var intNum = parseInt(Math.abs(floatNum) * times + 0.5, 10)
      ret.times = times
      if (isNegative) {
          intNum = -intNum
      }
      ret.num = intNum
      return ret
  }

  /*
   * 核心方法，实现加减乘除运算，确保不丢失精度
   * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
   *
   * @param a {number} 运算数1
   * @param b {number} 运算数2
   * @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
   * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
   *
   */
  function operation(a, b, digits = 0, op) {
      var o1 = toInteger(a || 0)
      var o2 = toInteger(b || 0)
      var n1 = o1.num
      var n2 = o2.num
      var t1 = o1.times
      var t2 = o2.times
      var max = t1 > t2 ? t1 : t2
      var result = null
      switch (op) {
          case 'add':
              if (t1 === t2) { // 两个小数位数相同
                  result = n1 + n2
              } else if (t1 > t2) { // o1 小数位 大于 o2
                  result = n1 + n2 * (t1 / t2)
              } else { // o1 小数位 小于 o2
                  result = n1 * (t2 / t1) + n2
              }
              return (result / max).toFixed(digits)
          case 'subtract':
              if (t1 === t2) {
                  result = n1 - n2
              } else if (t1 > t2) {
                  result = n1 - n2 * (t1 / t2)
              } else {
                  result = n1 * (t2 / t1) - n2
              }
              return (result / max).toFixed(digits)
          case 'multiply':
              result = (n1 * n2) / (t1 * t2)
              return result
          case 'divide':
              result = (n1 / n2) * (t2 / t1)
              return result
      }
  }

  // 加减乘除的四个接口
  function add(a, b, digits) {
      return operation(a, b, digits, 'add')
  }

  function subtract(a, b, digits) {
      return operation(a, b, digits, 'subtract')
  }

  function multiply(a, b, digits) {
      return operation(a, b, digits, 'multiply')
  }

  function divide(a, b, digits) {
      return operation(a, b, digits, 'divide')
  }

  // exports
  return {
      add: add,
      subtract: subtract,
      multiply: multiply,
      divide: divide
  }
})()

const normalUtil = (function() {
  function formatPhone(tel) {
      tel = "" + tel;
      return tel.substr(0, 3) + "****" + tel.substr(7)
  }

  return {
      formatPhone
  }
})()

/**
 * 本地记录搜索历史
 * @param name {string} 历史记录名称
 * @param value {any} 需要添加的值
 * @param maxLength {number} 最大保存记录的个数
 * @param valueFlag {string} 辨别历史记录是否存在相同的item的key
 */
const historyUtil = {
    getHistory(name, length) {
        const result = wx.getStorageSync(name)
        if (length && result.length>length) {
            result.length = length
        }
        return result
    },
    removeHistory(name) {
        return wx.removeStorageSync(name)
    },
    setHistory(name, value, maxLength = 10, key) {
        const histroyCityList = this.getHistory(name) || []
        const sameIndex = this.getSameIndex(histroyCityList, value, key)
        if (sameIndex > -1) {
            // 剔除相同的
            histroyCityList.splice(sameIndex, 1)
        }

        if (histroyCityList.length >= maxLength) {
            histroyCityList.splice(histroyCityList.length-1, 1)
        }

        histroyCityList.unshift(value)
        return wx.setStorageSync(name, histroyCityList)
    },
    // 获取相同数据的index 为了剔除存在的
    getSameIndex(historyList, value, key) {
        const myValue = key ? value[key] : value
        return historyList.findIndex(item => {
            const myItem = key ? item[key] : item
            return myValue == myItem
        })
    }
}

// 防抖
function debounce(fn, wait) {    
    var timeout = null;    
    return function(e) {        
        if(timeout !== null)   clearTimeout(timeout);        
        timeout = setTimeout(fn, wait, e);    
    }
}
/*
* 判断非空串
* */
function isNotEmptyStr(str) {
    return str != undefined && str != null && ((str + "").replace(/(^\s+)|(\s+$)/g, "")) != "";
};
/*
* 判断非空对象
* */
function isNotEmptyObj(obj) {
    if (isNotEmptyStr(obj)) {
        var t;
        for (t in obj)
            return true;
    }
    return false;
};
module.exports = {
  dateUtil,
  checkUtil,
  calculateUtil,
  normalUtil,
  historyUtil,
  debounce,
  isNotEmptyObj
}

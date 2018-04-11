var common = {};

/************************************************************
 * 日期处理
 ************************************************************/
common.date = {
  /* 格式转换 */
  formatTime: function(format, time) {
    // format：需要转化的格式，例如（yyyy-MM-dd hh:mm:ss）
    // time: 传入的日期对象，例如（new Date())
    var o = {
      "M+": time.getMonth()+1,
      "d+": time.getDate(),
      "h+": time.getHours(),
      "m+": time.getMinutes(),
      "s+": time.getSeconds(),
      "q+": Math.floor((time.getMonth()+3)/3),
      "S" : time.getMilliseconds()
    }
    if(/(y+)/.test(format)) {
      format = format.replace(RegExp.$1,(time.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
      if(new RegExp("("+ k +")").test(format)) {
        format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
      }
    }
    return format;
  },
  /* 获取n天之前的日期 */
  getRecentDay: function(days) {
    var todayDate = new Date();
    var demandDate = new Date(todayDate.getTime() - (days * 24 * 60 * 60 * 1000));
    return demandDate;
  },
  /* 获取两个日期之间的日期 */
  getBetweenDayList: function(beginTime, endTime) {
    var endDate = new Date(endTime);
    var modifyDate = new Date(beginTime);
    var dateArr = [];
    while(endDate.getTime() >= modifyDate.getTime()) {
      dateArr.push(common.date.formatTime("yyyyMMdd", modifyDate));
      modifyDate.setDate(modifyDate.getDate() + 1);
    }
    return dateArr;
  }
}

/************************************************************
 * 本地cookie
 ************************************************************/
common.cookies = {
  set: function(key, value, days) {
    var todayDate = new Date();
    todayDate.setTime(todayDate.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = key + "=" + escape(value) + ((days == null) ? "" : ";expires=" + todayDate.toUTCString()) + ";path=/";
  },
  get: function(key) {
    if (document.cookie.length > 0) {
      start = document.cookie.indexOf(key + "=")
      if (start != -1) {
        start = start + key.length + 1
        end = document.cookie.indexOf(";", start)
        if (end == -1) end = document.cookie.length
        return unescape(document.cookie.substring(start, end))
      }
    }
    return ""
  },
  del: function(key) {
    var cookies = this;
    var todayDate = new Date();
    todayDate.setTime(todayDate.getTime() - 1);
    var cval = cookies.get(key);
    if(cval!=null) {
      document.cookie = key + "="+cval+";expires="+todayDate.toGMTString();
    }
  }
}

/************************************************************
 * 数据校验
 ************************************************************/
common.verify = {
  /* 手机号码校验 */
  cellPhone: function(phone) {
    var reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    return reg.test(phone);
  },
  /* 身份证校验 */
  idCard: function(card) {
    var cardNum = card.toString().toUpperCase();
    // 验证是否为18位或者15位
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(cardNum))) {
      return false;
    }
    var cityNum={
      11: "北京",
      12: "天津",
      13: "河北",
      14: "山西",
      15: "内蒙古",
      21: "辽宁",
      22: "吉林",
      23: "黑龙江",
      31: "上海",
      32: "江苏",
      33: "浙江",
      34: "安徽",
      35: "福建",
      36: "江西",
      37: "山东",
      41: "河南",
      42: "湖北",
      43: "湖南",
      44: "广东",
      45: "广西",
      46: "海南",
      50: "重庆",
      51: "四川",
      52: "贵州",
      53: "云南",
      54: "西藏",
      61: "陕西",
      62: "甘肃",
      63: "青海",
      64: "宁夏",
      65: "新疆",
      71: "台湾",
      81: "香港",
      82: "澳门",
      91: "国外"
    };
    // 验证省份是否正确
    if(cityNum[parseInt(cardNum.substr(0,2))]==null){
      return false;
    }
    var cardNumLen, reg;
    cardNumLen = cardNum.length;
    if (cardNumLen == 15) {
      reg = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
      var arrSplit = cardNum.match(reg);
      var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
      var bGoodDay;
      bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
      if (!bGoodDay) {
        return false;
      } else {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var nTemp = 0, i;
        cardNum = cardNum.substr(0, 6) + '19' + cardNum.substr(6, cardNum.length - 6);
        for(i = 0; i < 17; i ++) {
          nTemp += cardNum.substr(i, 1) * arrInt[i];
        }
        cardNum += arrCh[nTemp % 11];
        return true;
      }
    }
    if (cardNumLen == 18) {
      reg = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
      var arrSplit = cardNum.match(reg);
      var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
      var bGoodDay; bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
      if (!bGoodDay) {
        return false;
      } else {
        var valnum;
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var nTemp = 0, i;
        for(i = 0; i < 17; i ++) {
          nTemp += cardNum.substr(i, 1) * arrInt[i];
        }
        valnum = arrCh[nTemp % 11];
        if (valnum != cardNum.substr(17, 1)) {
          return false;
        }
        return true;
      }
    }
    return false;
  }
}

/************************************************************
 * 数据处理
 ************************************************************/
common.data = {
  /* 克隆对象 */
  clone: function(obj) {
    var cloneFunc = this.clone;
    var str, newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
      return;
    }else if(window.JSON){
      str = JSON.stringify(obj),
      newobj = JSON.parse(str);
    }else {
      for(var i in obj){
        newobj[i] = typeof obj[i] === 'object' ? cloneFunc(obj[i]) : obj[i]; 
      }
    }
    return newobj;
  }
}

/************************************************************
 * 订阅者模式
 ************************************************************/
common.topic = {
  init: function(name) {
    var container = this.container;
    if(container[name] == undefined) {
      container[name] = {
        subscribers: {},
        subscribe: function(callback, topics) {
          var tmpl = this;
          for(var i in topics) {
            var topic = topics[i];
            if(tmpl.subscribers[topic] == undefined) {
              tmpl.subscribers[topic] = [];
            }
            for(var j = tmpl.subscribers[topic].length - 1; j >= 0; j--) {
              if(tmpl.subscribers[topic][j] == callback) {
                return;
              }
            }
            tmpl.subscribers[topic][tmpl.subscribers[topic].length] = callback;
          }
        },
        publish: function(topic) {
          var tmpl = this;
          if(tmpl.subscribers[topic] != undefined) {
            for(var i = 0; i < tmpl.subscribers[topic].length; i++) {
              if(typeof tmpl.subscribers[topic][i] === 'function') {
                try {
                  tmpl.subscribers[topic][i]();
                } catch (e) {}
              }
            }
          }
        }
      }
    }
    return container[name];
  },
  container: {}
}

/************************************************************
 * 网址
 ************************************************************/
common.url = {
  /* 获取网址参数 */
  getParams: function(key) {
    var reg = new RegExp("(^|&)"+ key +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null) return unescape(r[2]);
    return null;
  }
}
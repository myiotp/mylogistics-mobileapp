//app.js
App({
  onLaunch: function () {
    this.serviceurl ='http://localhost:8080/onemap';
    this.imagesurl = 'http://localhost/uploadimages';
    this.uid = 'wangxn';

    this.setCity();
    this.setCartype();
    this.setCarLength();

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  setCity: function () {
    var p = {

    }
    wx.request({
      url: this.serviceurl + "/api/province/cities",
      data: p,
      success: function (res) {
        wx.setStorage({
          key: 'chooseCity',
          data: res.data
        })
      }
    })
  },
  setCartype: function () {
    var p = {

    }
    wx.request({
      url: this.serviceurl + "/api/cartype",
      data: p,

      success: function (res) {
        var a = [{
          name: '选择类型',
          id: ''
        }];
        a = a.concat(res.data);
        wx.setStorage({
          key: 'chooseCartype',
          data: a
        })
      }
    })
  },
  setCarLength: function () {
    var p = {

    }
    wx.request({
      url: this.serviceurl + "/api/carlength",
      data: p,

      success: function (res) {
        var a = [{
          name: '选择长度',
          id: ''
        }];
        a = a.concat(res.data);
        wx.setStorage({
          key: 'chooseCarLength',
          data: a
        })
      }
    })
  },
  globalData: {
    userInfo: null
  }
})

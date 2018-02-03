var app = getApp();
Page({
  data: {
    list: ''
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      //url:app.ajaxurl,
      //url:'https://56-api.kcimg.cn',
      url: 'http://localhost:8080/onemap/api/truck',
      data: {
        c: 'cargood',
        m: 'getlist',
        category: 0,
        userid: 'o9WMY0XmtYJ7ssOQ71i5eh4xfCtw',
        page: 1,
        ts: 1484553182686
      },
      success: function (res) {
        that.setData({
          list: res.data.data
        })
      }
    })
  }
})

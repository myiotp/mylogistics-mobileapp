//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    //默认未获取地址
    hasLocation: false
  },

  /*//获取经纬度
  getLocation: function (e) {
    console.log(e)
    var that = this
    wx.getLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          hasLocation: true,
          location: {
            longitude: res.longitude,
            latitude: res.latitude
          }
        })
      }
    })
  },*/
  //根据经纬度在地图上显示
  openLocation: function (e) {
    var value = e.detail.value
    if(this.data.hasLocation) {
      if(this.data.longitude >0 && this.data.latitude >0) {
        wx.openLocation({
          latitude: Number(this.data.latitude),
          longitude: Number(this.data.longitude)
        })
      }
    }

  },
  onLoad: function (options) {
    var that = this;
    if (this.loaded) return;

    console.log('x:' + options['x'] + ',y:' + options['y'])
    if(options['x'] >0 && options['y'] > 0) {
      that.setData({
        hasLocation: true,
        longitude: options['x'],
        latitude: options['y']
      })
    }
  }

})

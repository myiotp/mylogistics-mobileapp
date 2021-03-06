//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    //默认未获取地址
    hasLocation: false,
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [{
      latitude: 23.099994,
      longitude: 113.324520,
      title: '位置',
      iconPath:'/images/truck-tracing.png',
      label: {
        content:'车辆跟踪',
        color:'#E64340'
      }
    }],
    controls: [{
      id: 1,
      iconPath: '/images/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }],
    covers: []
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
        longitude: options['y'],
        latitude: options['x']
      })
    }
    //console.log(this.data);
  }

})

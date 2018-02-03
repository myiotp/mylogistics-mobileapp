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
      iconPath:'/images/location.png',
      label: {
        content:'车辆跟踪',
        color:'#E64340'
      }
    }],
    covers: [{
      latitude: 23.099994,
      longitude: 113.344520,
      iconPath: '/images/location.png'
    }, {
      latitude: 23.099994,
      longitude: 113.304520,
      iconPath: '/images/location.png'
    }]
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
    // if(options['x'] >0 && options['y'] > 0) {
    //   that.setData({
    //     hasLocation: true,
    //     longitude: 23.099994,//options['x'],
    //     latitude: 113.324520//options['y']
    //   })
    // }
  }

})

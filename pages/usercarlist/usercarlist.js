var app = getApp();
Page({
  data: {
    list: ''
  },
  add: function () {
    wx.navigateTo({
      url: '/pages/vehicleinformation/vehicleinformation'
    })
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.serviceurl + '/api/uservehicle/username/'+app.uid,
      data: {

      },
      success: function (res) {
        let mylist = res.data.data;
        console.log(mylist)
        if(mylist != null) {
          that.setData({
            list: mylist
          })
        }

      }
    })
  }
})

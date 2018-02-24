var app = getApp();
Page({
  data: {
    list: '',
    size:0,
  },
  search: function () {
    wx.navigateTo({
      url: '/pages/searchcar/addcar'
    })
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.serviceurl + '/api/truck',
			data:{
      	username:app.uid
			},
      success: function (res) {
        that.setData({
          list: res.data.data,
          size:res.data.size
        })
      }
    })
  },

	onShow:function(options){
		var that = this;
		wx.request({
      url: app.serviceurl + '/api/truck',
			data:{
      	username:app.uid
			},
			success:function(res){
				that.setData({
          list:res.data.data,
          size:res.data.size
				})
			}
		})
	}
})

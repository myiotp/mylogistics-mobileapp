var app = getApp();
Page({
  data: {
    list: ''
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
          list: res.data.data
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
					list:res.data.data
				})
			}
		})
	}
})

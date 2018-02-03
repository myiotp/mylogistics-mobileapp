var app = getApp();
Page({
	data: {
	  	list:''
	},
	search: function () {
    wx.navigateTo({
      url: '/pages/searchcargoes/cargoes'
    })
  },
	onLoad:function(options){
		var that = this;
		console.log(options);
		wx.request({
      url: app.serviceurl + '/api/cargoes',
			data:{
      	username:app.uid
			},
			success:function(res){
				that.setData({
					list:res.data.data
				})
			}
		})
	},
	onShow:function(options){
		var that = this;
		console.log(options);
		wx.request({
      url: app.serviceurl + '/api/cargoes',
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

var app = getApp();
Page({
	data: {
	  	list:''
	},
	onLoad:function(options){
		var that = this;
		wx.request({
      url: app.serviceurl + '/api/cargoes/username/' + app.uid +'/status/confirmed',
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
		wx.request({
		url: app.serviceurl + '/api/cargoes/username/' + app.uid +'/status/confirmed',
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
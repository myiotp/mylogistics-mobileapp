var app = getApp();
Page({
	data: {
		  list:'',
		  size:0,
	},
	onLoad:function(options){
		var that = this;
		wx.request({
      url: app.serviceurl + '/api/cargoes/username/' + app.uid+ '/status/todo',
			data:{
        username:app.uid
			},
			success:function(res){
				that.setData({
					list:res.data.data,
					size:res.data.size,
				})
			}
		})
	},
	onShow:function(options){
		var that = this;
		wx.request({
		url: app.serviceurl + '/api/cargoes/username/' + app.uid+ '/status/todo',
				data:{
			username:app.uid
				},
				success:function(res){
					that.setData({
						list:res.data.data,
						size:res.data.size,
					})
				}
			})
	}
})

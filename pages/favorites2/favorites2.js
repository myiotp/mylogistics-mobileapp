var app = getApp();
Page({
	data: {
	  	list:''
	},
	onLoad:function(options){
		var that = this;
		wx.request({
      url: app.serviceurl + '/api/userfavorite/username/'+app.uid+'/cargo',
			data:{

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
      url: app.serviceurl + '/api/userfavorite/username/'+app.uid+'/cargo',
			data:{

			},
			success:function(res){
				that.setData({
					list:res.data.data
				})
			}
		})
	}
})

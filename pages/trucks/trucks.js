var app = getApp();
Page({
	data: {
	  	list:''
	},
	onLoad:function(options){
		var that = this;
		console.log(app.serviceurl + '/api/truck/username/'+app.uid+app.globalData.uid+'/');
		wx.request({
      url: app.serviceurl + '/api/truck/username/'+app.uid+app.globalData.uid+'/',
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
      url: app.serviceurl + '/api/truck/username/'+app.uid+app.globalData.uid+'/',
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

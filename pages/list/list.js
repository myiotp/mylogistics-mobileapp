var app = getApp();
Page({
	data: {
			list:'',
			size:0,
	},
	search: function () {
    wx.navigateTo({
      url: '/pages/searchcargoes/cargoes'
    })
  },
	onLoad:function(options){
		var that = this;
		//console.log(options);
		wx.request({
      url: app.serviceurl + '/api/cargoes',
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
	},
	onShow:function(options){
		var that = this;
		wx.request({
      url: app.serviceurl + '/api/cargoes',
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

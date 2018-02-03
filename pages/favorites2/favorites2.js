Page({
	data: {
	  	list:''
	},
	onLoad:function(options){
		var that = this;
		wx.request({
			url:app.ajaxurl,
			data:{
				c:'carlist',
				m:'ajaxGetShipList'
			},
			success:function(res){
				that.setData({
					list:res.data
				})
			}
		})
	}
})

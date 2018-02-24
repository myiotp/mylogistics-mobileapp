var app = getApp();
Page({
	data: {
		  list:'',
		  size:0,
		  cid:0,
		  truckowner:''
	},
	onLoad:function(options){
		var that = this;
		that.data.cid = options['cid'];
		that.data['truckowner'] = options['o'];
		console.log(that.data)
		wx.request({
      		url: app.serviceurl + '/api/cargoes/username/' + app.uid+ '/status/todo',
			data:{
        		username:app.uid
			},
			success:function(res){
				that.setData({
					list:res.data.data,
					size:res.data.size,
					cid:options['cid'],
					truckowner:options['o']
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
						size:res.data.size
					})
				}
			})
	}
})

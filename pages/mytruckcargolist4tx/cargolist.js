var app = getApp();
Page({
	data: {
		list:'',
		size:0,
		  cid:0,
		  cargoowner:''
	},
	onLoad:function(options){
		var that = this;
		that.data.cid = options['cid'];
		that.data['cargoowner'] = options['o'];
		console.log(that.data)
		wx.request({
      		url:app.serviceurl + '/api/usertransaction/username/'+app.uid + '/truck/' + options['cid'],
			data:{
        		username:app.uid
			},
			success:function(res){
				that.setData({
					list:res.data.data,
					size:res.data.size,
					cid:options['cid'],
					cargoowner:options['o']
				})
			}
		})
	},
	onShow:function(options){
		var that = this;
		wx.request({
		url: app.serviceurl + '/api/usertransaction/username/'+app.uid + '/truck/' + that.data.cid,
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

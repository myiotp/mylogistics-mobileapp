var app = getApp();
Page({
	data: {
		  list:'',
		  cid:0,
		  cargoowner:''
	},
	onLoad:function(options){
		var that = this;
		that.data.cid = options['cid'];
		that.data['cargoowner'] = options['o'];
		console.log(that.data)
		wx.request({
      		url: app.serviceurl + '/api/usertransaction/username/'+app.uid + '/cargo/' + options['cid'],
			data:{

			},
			success:function(res){
				that.setData({
					list:res.data.data,
					cid:options['cid'],
					cargoowner:options['o']
				})
			}
		})
	},
	onShow:function(options){
		var that = this;
		wx.request({
      		url: app.serviceurl + '/api/usertransaction/username/'+app.uid + '/cargo/' + that.data.cid,
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
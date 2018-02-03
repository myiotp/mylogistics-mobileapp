var app = getApp();
Page({
  data: {
    list: '',
    shipTimestamp:'',
    fromid:'',
    toid:'',
    carType:'',
    carLength:''
  },
  onLoad: function (options) {
    var that = this;
    console.log(options);
		that.setData({
			username:app.uid,
			shipTimestamp:options['s1'],
			fromid:options['s2'],
			toid:options['s3'],
			carType:options['s4'],
			carLength:options['s5']
		});
    wx.request({
      url: app.serviceurl + '/api/truck/q',
			data:{
        username:app.uid,
				shipTimestamp:options['s1'],
				fromid:options['s2'],
				toid:options['s3'],
				carType:options['s4'],
				carLength:options['s5']
			},
      success: function (res) {
        let dd=res.data.data;
				if(dd.length ==0) {
					wx.showToast({
            title: '没有查询到记录',
            icon: 'success',
            duration: 1e3
          });

          setTimeout(function () {
            app.submited = true;
            wx.hideToast();
            wx.switchTab({
              url: '../carlist/carlist'
            })
          }, 1e3);
				}else {
					that.setData({
						list:res.data.data
					})
				}
      }
    })
  },

	onShow:function(options){
		var that = this;
		wx.request({
      url: app.serviceurl + '/api/truck/q',
			data:{
        username:app.uid,
				shipTimestamp:that.data['shipTimestamp'],
				fromid:that.data['fromid'],
				toid:that.data['toid'],
				carType:that.data['carType'],
				carLength:that.data['carLength']
			},
			success:function(res){
        let dd=res.data.data;
				if(dd.length ==0) {
					wx.showToast({
            title: '没有查询到记录',
            icon: 'success',
            duration: 1e3
          });

          setTimeout(function () {
            app.submited = true;
            wx.hideToast();
            wx.switchTab({
              url: '../carlist/carlist'
            })
          }, 1e3);
				}else {
					that.setData({
						list:res.data.data
					})
				}
			}
		})
	}
})

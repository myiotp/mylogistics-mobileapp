var app = getApp();
var page =1;
var pageSize = app.pageSize;
var url=app.serviceurl + '/api/cargoes';
var GetList = function (that) { 
	that.setData({  
    hidden: false  
	});  
	wx.request({
		url: url,
		data:{
			username:app.uid,
			pageSize:pageSize,
			page: page
		},
		success:function(res){
			var mylist = that.data.list;
			var len = res.data.data.length;
			console.log("loaded result size:" + len);
			if(res.data.size == 0) {
				console.log("已加载全部");
				wx.showToast({
					title: '已加载全部',
					icon: 'success',
					duration: 1e3
				});
			} else {
				for (var i = 0; i < len; i++) {  
					mylist.unshift(res.data.data[i]);
				}
				that.setData({
					list:mylist,
					size:mylist.length
				});
				page++;
			}
      
			that.setData({  
        hidden: true  
      }); 
		},
		complete: function() {
			// complete
			wx.hideNavigationBarLoading(); //完成停止加载
			wx.stopPullDownRefresh(); //停止下拉刷新
		}
	})
}
Page({
	data: {
			list:[],
			size:0
	},
	search: function () {
    wx.navigateTo({
      url: '/pages/searchcargoes/cargoes'
    })
  },
	onLoad:function(options){
		// console.log("list/list page onLoad");
		// var that = this;
    // GetList(that);
	},
	onShow:function(options){
		console.log("list/list page onShow");
		wx.showNavigationBarLoading();
    page = 1;  
    this.setData({  
			list: [],  
			size:0
    });  
    var that = this;
    GetList(that);
	},
	onPullDownRefresh: function () {  
		console.log("下拉");
		wx.showNavigationBarLoading();
    // page = 1;  
    // this.setData({  
		// 	list: [],  
		// 	size:0
    // });  
    var that = this;
    GetList(that);
	}
	// onReachBottom: function () {  
  //   //上拉  
  //   console.log("上拉")  
  //   var that = this;  
  //   GetList(that); 
  // }
})

var app = getApp();
var page =1;
var pageSize = app.pageSize;
var GetList = function (that) { 
	that.setData({  
    hidden: false  
	});  
	var url=app.serviceurl + '/api/cargoes/q';

	wx.request({
		url: url,
		method: 'GET',
		data:{
			username:app.uid,
			shipTimestamp:that.data['shipTimestamp'],
			fromid:that.data['fromid'],
			toid:that.data['toid'],
			carType:that.data['carType'],
			carLength:that.data['carLength'],
			pageSize:pageSize,
			page: page
		},
		success:function(res){
			var mylist = that.data.list;
			var len = res.data.data.length;
			console.log("loaded result size:" + len);
			let dd=res.data.data;
			if(len ==0) {
				wx.showToast({
					title: '没有查询到记录',
					icon: 'success',
					duration: 1e3
				});

			}else {
				console.log("res.data.size:" + res.data.size);
				if(res.data.size == 0) {
					console.log("已加载全部");
					wx.showToast({
						title: '已加载全部',
						icon: 'success',
						duration: 1e3
					});
				} else {
					for (var i = 0; i < len; i++) {  
						mylist.push(res.data.data[i]);
					}
					that.setData({
						list:mylist,
						size:mylist.length
					});
					page++;
				}
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

/**
 * 旋转刷新图标
 */
function updateRefreshIcon() {
	var deg = 0;
	console.log('旋转开始了.....')
	var animation = wx.createAnimation({
	  duration: 1000
	});
  
	var timer = setInterval( ()=> {
	  if (!this.data.loading)
		clearInterval(timer);
	  animation.rotateZ(deg).step();//在Z轴旋转一个deg角度
	  deg += 360;
	  this.setData({
		refreshAnimation: animation.export()
	  })
	}, 2000);
  }
Page({
	data: {
		loading:false,
		refreshAnimation:{},
			list:[],
			shipTimestamp:'',
			fromid:'',
			toid:'',
			carType:'',
			carLength:''
	},
	search: function () {
    wx.navigateTo({
      url: '/pages/searchcargoes/cargoes'
    })
  },
	onLoad:function(options){
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
	},
	onShow:function(options){
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
		page = 1;  
		this.setData({  
				list: [],  
				size:0
		});  
		var that = this;
		GetList(that);
	},
	onReachBottom: function () {  
    //上拉  
		console.log("上拉")  
		if (this.data.loading) return;  
		this.setData({ loading: true });  
		updateRefreshIcon.call(this);
		var that = this;  
			GetList(that); 
			setTimeout( () =>{
				this.setData({
					loading: false
				})
			}, 2000)
	}
})

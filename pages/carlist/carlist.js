var app = getApp();
var page =1;
var pageSize = app.pageSize;
var GetList = function (that) { 
	that.setData({  
    hidden: false  
	});  
	var url=app.serviceurl + '/api/truck';

	wx.request({
		url: url,
		data:{
			username:app.uid,
			pageSize:pageSize,
			page: page,
			status:that.data.status
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
					mylist.push(res.data.data[i]);
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
		filterdata:{},  //筛选条件数据
		showfilter:false, //是否显示下拉筛选
		showfilterindex:null, //显示哪个筛选类目
		sortindex:0,  //排序索引
		sortid:null,  //排序id
		status:-1,
		filter:{},
		scrolltop:null, //滚动位置
		loading:false,
		refreshAnimation:{},
    list:[],
    size:0
  },
  search: function () {
    wx.navigateTo({
      url: '/pages/searchcar/addcar'
    })
  },
  onLoad: function (options) {
		this.fetchFilterData();
  },
	fetchFilterData:function(){ //获取筛选条件
    this.setData({
      filterdata:{
        "sort": [
            {
                "id": 0,
                "title": "全部"
            },
            {
                "id": 1,
                "title": "交易中"
            },
            {
                "id": 2,
                "title": "已交易"
						},
						{
							"id": 3,
							"title": "已作废"
						}
        ],
        "contain": [
            {
                "id": 0,
                "title": "4人以下"
            },
            {
                "id": 1,
                "title": "5-8人"
            },
            {
                "id": 2,
                "title": "8-12人"
            },
             {
                "id": 3,
                "title": "12-20人"
            },
            {
                "id": 4,
                "title": "20人以上"
            },
        ],
        "equipments": [
            {
                "id": 0,
                "title": "投影仪"
            },
            {
                "id": 1,
                "title": "欢迎屏"
            },
            {
                "id": 2,
                "title": "视屏设备"
            },
            {
                "id": 3,
                "title": "电话会议设备"
            },
            {
                "id": 4,
                "title": "钢笔"
            },
            {
                "id": 5,
                "title": "麦克风"
            },
        ],
      }
    })
	},
	setFilterPanel: function(e){ //展开筛选面板
    const d = this.data;
    const i = e.currentTarget.dataset.findex;
    if(d.showfilterindex == i){
      this.setData({
        showfilter: false,
        showfilterindex: null
      })
    }else{    
      this.setData({
        showfilter: true,
        showfilterindex:i,
      })
    }
  },
  hideFilter: function(){ //关闭筛选面板
    this.setData({
      showfilter: false,
      showfilterindex: null
    })
  },
  setSort:function(e){ //选择状态
    const d= this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      sortindex:dataset.sortindex,
      sortid:dataset.sortid
    })
		console.log('状态id：'+this.data.sortid);
		var _status = 0;
		if(this.data.sortid == 0) {
			_status = -1; //all
		} else if(this.data.sortid == 1) {
			_status = 0; //in progress
		} else if(this.data.sortid == 2) {
			_status = 11; //done
		} else if(this.data.sortid == 3) {
			_status = 99; //cancel
		}
		page = 1;  
    this.setData({  
			status:_status,
			list: [],  
			size:0
    });  
    var that = this;
		GetList(that);
		this.hideFilter();
  },
  inputStartTime:function(e){
    this.setData({
      filter: Object.assign({},this.data.filter,{
        starttime:e.detail.value
      })
    })  //输入会议开始时间
  },
  inputEndTime:function(e){
    this.setData({
      filter: Object.assign({},this.data.filter,{
        endtime:e.detail.value
      })
    })  //输入会议结束时间
  },
  chooseContain:function(e){  //选择会议室容纳人数
    this.setData({
      filter: Object.assign({},this.data.filter,{
        containid:e.currentTarget.dataset.id
      })
    })
    console.log('选择的会议室容量id：'+this.data.filter.containid);
  },
  chooseEquipment:function(e){  //选择会议室设备
    const equipments = this.data.filter.equipments || [];
    const eid = e.currentTarget.dataset.id;
    this.setData({
      filter: Object.assign({},this.data.filter,{
        equipments:equipments.indexOf(eid)>-1 ? equipments.filter(i=>i!=eid):equipments.concat([eid])
      })
    })
    console.log('选择的会议室设备id：'+this.data.filter.equipments);
  },
  setClass:function(e){ //设置选中设备样式
    return this.data.filter.equipments.indexOf(e.currentTarget.dataset.id)>-1?'active':''
  },
  cleanFilter:function(){ //清空筛选条件
    this.setData({
      filter:{}
    })
  },
  submitFilter:function(){ //提交筛选条件
    console.log(this.data.filter);
  },
	scrollHandle:function(e){ //滚动事件
		console.log("e.detail.scrollTop" + e);
    this.setData({
      scrolltop:e.detail.scrollTop
    })
  },
  goToTop:function(){ //回到顶部
    this.setData({
      scrolltop:0
    })
	},
	scrollLoading:function(){ //滚动加载
    var that = this;
    GetList(that);
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

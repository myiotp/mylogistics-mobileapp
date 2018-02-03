function navigateTo(url){
    wx.redirectTo({
        url:url
    });
};
Page({
    data:{
        myLink:'../mycarlist/mycarlist'
    },
    goHome:function(){
      wx.switchTab({
				url:'../carlist/carlist',
        success: function (e) {
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
        }
			})
    },
    viewMyList:function(){
        navigateTo(this.data['myLink'])
    }
})

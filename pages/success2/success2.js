function navigateTo(url){
    wx.redirectTo({
        url:url
    });
};
Page({
    data:{
        myLink:'../cargolist/cargolist'
    },
    goHome:function(){
      wx.switchTab({
				url:'../list/list',
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

var app = getApp();
Page({
    data:{
        userInfo:{},
        myrole:'',
        total:{
            view:56,
            vehiclefavorite:'0',
            cargofavorite:'0',
            myvehicle:'0',
            mycargo:'0'
        }
    },
    onLoad:function(){
        var that = this;
        wx.getUserInfo({
            success: function(res) {
                var userInfo = res.userInfo;
                that.setData({
                    userInfo:{
                        avatar:userInfo.avatarUrl,
                        nickname:userInfo.nickName
                    }
                })
            },
            fail:function(err){}
        });
        

    		
    },
    onShow:function() {
      var that = this;
      

    }
})

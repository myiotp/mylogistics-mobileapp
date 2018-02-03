var app = getApp();
Page({
    data:{
        userInfo:{},
        total:{
            view:56,
            favorite:5
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
        /*wx.request({
            url: 'http://localhost:8080/onemap/api/0/',
            data: {
                c:'wxadoc',
                m:'getUserCount',
                uid:app.uid
            },
            success:function(res){
                console.log(res);
                that.setData({
                    total:res.data['data'].total
                });
            }
        })*/
    }
})

var app = getApp();
Page({
    data:{
        trucks:''
    },
    onLoad:function(options){
        var that = this;
        wx.request({
            url: app.serviceurl + '/api/truck/username/'+app.uid,
            data:{

            },
            success:function(res){
                that.setData({
                    trucks:res.data.data
                })
            }
        })
    }
})

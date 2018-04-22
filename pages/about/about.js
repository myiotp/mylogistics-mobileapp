//about.js
//获取应用实例
var app = getApp();
Page({
  data: {
    showLog: false,
    content:''
  },
  onLoad: function(){
    var that = this;
    wx.request({
      url: app.serviceurl + '/api/wx/about',
      data:{

      },
      success:function(res){
        console.log(res.data)
        if(res.data.data == null || res.data.data == '') {
          
        } else {
          that.setData({
            content:res.data.data
          })
        }
        
      }
    })
  },
  toggleLog: function(){
    this.setData({
      showLog: !this.data.showLog
    });
  }
});
//about.js
//获取应用实例
var app = getApp();
Page({
  data: {
    showLog: false,
    userguideurl:'https://www.tongdagufen.cn/images/help/userguide.pdf',
    content:''
  },
  onLoad: function(){
    var that = this;
    var value = wx.getStorageSync('contactInfo');
    if(value) {
      that.setData({
        content:value
      })
    } else {
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
            wx.setStorage({
              key: 'contactInfo',
              data: res.data.data
            })
          }
          
        }
      })
    }
    
  },
  getUserGuideDownloadUrl: function() {
    var self=this;
    wx.setClipboardData({
      data: self.data.userguideurl,
      success: function(res) {
        // self.setData({copyTip:true}),
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '复制成功',
          success: function(res) {
            if (res.confirm) {
              console.log('确定')
            } else if (res.cancel) {
              console.log('取消')
            }
          }
        })
      }
    });
  },
  toggleLog: function(){
    this.setData({
      showLog: !this.data.showLog
    });
  }
});
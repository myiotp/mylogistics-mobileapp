var feedbackApi=require('../mytoast/showToast');
var app = getApp();
Page({
    data:{
        userInfo:{},
        myrole:'',
        b_authresult:'未认证',
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
            withCredentials: true,
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
      var openId=wx.getStorageSync('openId');
        
      wx.request({
        url: app.serviceurl + '/api/wx/username/'+openId+'',
        data:{

        },
        success:function(res){
          console.log(res.data)
          if(res.data.data == null || res.data.data == '') {
            wx.showModal({  
              title: '提示',  
              showCancel: false,
              content: '请完善资料',
              success: function (res) {
                wx.navigateTo({
                  url: '../dataperfect/dataperfect'
                })
              }
            })  
          } else {
            app.uid = res.data.data;
            wx.setStorageSync('appuid', res.data.data);
          }
          
        }
      })

      app.uid=wx.getStorageSync('appuid');
        
      var that = this;
      wx.getStorage({
        key: 'myrole',
        success: function (res) {
          console.log(res.data);
          if (res.data == '1') {
            that.setData({
              myrole: '车主'
            })
          } else {
            that.setData({
              myrole: '货主'
            })
          }
        }
      });
      console.log(app.serviceurl + '/api/userfavorite/username/'+app.uid+'/mycount');
      wx.request({
        url: app.serviceurl + '/api/userfavorite/username/'+app.uid+'/mycount',
        data:{

        },
        success:function(res){
          console.log(res.data.data)
          that.setData({
            total:{
                vehiclefavorite: res.data.data['1'],
                cargofavorite:res.data.data['2'],
                myvehicle:res.data.data['3'],
                mycargo:res.data.data['4']
            }
          })
        }
      })

      wx.request({
        url: app.serviceurl + '/api/identityauth/' + app.uid + '/types',
        data: {
            uid:app.uid
        },
        success:function(res){
            console.log(res.data);
            if(res.data && res.data.data) {
              let _authresult = res.data.data['100'];
              // let _ok = false;
              if(_authresult == '1') {
                that.setData({
                  b_authresult: '已认证'
                })
              } else if(_authresult == '-1') {  
                that.setData({
                  b_authresult: '未通过认证'
                })
                wx.showModal({  
                  title: '提示', 
                  showCancel: true,
                  content:'您还未通过实名认证,请完善资料后提交证件进行认证!',
                  cancelText:'完善资料',
                  confirmText:'提交证件',
                  success: function(res) { 
                    if (res.confirm) { 
                      wx.navigateTo({
                        url: '../userauth/userauth'
                      })
                    } else {
                      wx.navigateTo({
                        url: '../dataperfect/dataperfect'
                      })
                    }
                  }
                })  
              }else {
                that.setData({
                  b_authresult: '待审核'
                })
                feedbackApi.showToast({title: '您的实名认证已提交,请等待认证结果!',duration: 3000 })
            }
          }
        }
      })
    }
})

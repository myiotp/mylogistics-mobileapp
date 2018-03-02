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
        app.uid=wx.getStorageSync('appuid');
        if(app.uid == '') {
          wx.showModal({  
            title: '提示',  
            content: '请完善资料',
            success: function (res) {
              wx.navigateTo({
                url: '../dataperfect/dataperfect'
              })
            }
          })  
        }
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
    },
    onShow:function() {
      app.uid=wx.getStorageSync('appuid');
        if(app.uid == '') {
          wx.showModal({  
            title: '提示',  
            content: '请完善资料',
            success: function (res) {
              wx.navigateTo({
                url: '../dataperfect/dataperfect'
              })
            }
          })  
        }
        
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
    }
})

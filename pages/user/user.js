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

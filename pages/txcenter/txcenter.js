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
              if(_authresult != '1') {
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
             
            } else {
                
            }
          }
        }
      })

    }
})

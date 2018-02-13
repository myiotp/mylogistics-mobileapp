var app = getApp();
Page({
    data:{
        userInfo:{},
        authresult:false,
        comment:'',
        total:{
            view:56,
            favorite:5
        }
    },
    onLoad:function(){
        var that = this;
        wx.request({
            url: app.serviceurl + '/api/identityauth/' + app.uid + '/type/200',
            data: {
                uid:app.uid
            },
            success:function(res){
                console.log(res.data);
                if(res.data && res.data.data) {
                  // let _authresult = res.data['authresult'];
                  // let _ok = false;
                  // if(_authresult == '1') {
                  //   _ok = true;
                  // }
                  that.setData({
                      authresult:res.data.data['authresult'],
                      comment:res.data.data['comment']
                  });
                }

            }
        })

    },
    formReset: function () {
      this.setData({

      })
    },
    _submit: function (o, title) {
      let that = this;
      wx.request({
        url: app.serviceurl + '/api/identityauth',
        method: 'POST',
        data: o,
        success: function (res) {
          console.log(res)
          res = res.data;
          if (res.info == 'OK') {
            wx.showToast({
              title: title,
              icon: 'success',
              duration: 1e3
            });

            setTimeout(function () {
              app.submited = true;
              wx.hideToast();
              wx.switchTab({
                url: '../user/user'
              })
            }, 1e3);

          }
        }
      })
    },
    formSubmit: function (e) {
      let formData = e.detail.value;
      console.log('form发生了submit事件，携带数据为：', formData);
      console.log(this.data);
      let submitData = {
        "id": formData['id'],
        "username": app.uid,
        "authresult": 0,
        "comment": '',
        "type": '200'
      };
      console.log(submitData);
      this._submit(submitData, '提交成功')
    }
})

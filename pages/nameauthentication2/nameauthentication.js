var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    tempFilePaths: '',
    uploaded: false,
    tempFilePaths2:''
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options['id']
    })

    wx.request({
        url: app.serviceurl+'/api/uploadimage/' + app.uid + '/type/102',
        data:{
            id:options['id'],
            username: app.uid
        },
        success:function(res){
          console.debug(res.data.data);
          var rawdata = res.data.data;
          that.setData({
            tempFilePaths: app.imagesurl + '/' + rawdata.image
          });
        }
    })
  },
  chooseimage: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      //itemColor: "#1AAE18",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseimage2: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      //itemColor: "#1AAE18",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage2('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage2('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        that.setData({
          tempFilePaths: res.tempFilePaths[0],
          uploaded: true
        })
      }
    })
  },
  chooseWxImage2: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        that.setData({
          tempFilePaths2: res.tempFilePaths[0],
          uploaded: true
        })
      }
    })
  },
  formReset: function () {
    this.setData({
      tempFilePaths: '',
      uploaded: false
    })
  },
  upload_file: function (url, filePath, name, type) {
    var that = this;
    wx.uploadFile({
     url: url,
     filePath: filePath,
     name: name,
     header: {
      'content-type': 'multipart/form-data'
     }, // 设置请求的 header
     formData: { 'type': type }, // HTTP 请求中其他额外的 form data
     success: function (res) {
       res = res.data;
       console.log(res);
       wx.showToast({
         title: "提交成功",
         icon: 'success',
         duration: 1000
       })
       setTimeout(function () {
         app.submited = true;
         wx.hideToast();
         wx.redirectTo({
           url: '../userauth/userauth'
         })
       }, 1500);

     },
     fail: function (res) {
     }
    })
 },
  _submit: function (o, title) {
    let that = this;
    //--将图片上传到服务器--
    var tempFilePaths = this.data.tempFilePaths;
    var tempFilePaths2 = this.data.tempFilePaths2;
    console.log(tempFilePaths);
    console.log(tempFilePaths2);

    if (tempFilePaths == '') {
      wx.showToast({
        title: '请提交身份证反面照片',
        icon: 'failure',
        duration: 1e3
      });
    } else {
      this.upload_file(app.serviceurl + '/api/upload/auth/username/'+app.uid, tempFilePaths, 'file', '102');

    }



  },
  formSubmit: function (e) {
    let formData = e.detail.value;
    console.log('form发生了submit事件，携带数据为：', formData);
    console.log(this.data);
    let submitData = {

    };
    console.log(submitData);
    this._submit(submitData, '提交成功')
  }

})

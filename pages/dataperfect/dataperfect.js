let app = getApp();
var feedbackApi=require('../mytoast/showToast');
var optionList = [];

Page({
  data: {
    textHint: "您的隐私会受到法律保护，请您放心填写  。",
    hiddenBoolean: true,
    inputHidden: true,
    className: ['header'],
    start: "请选择城市",
    usertype: 1,
    types: [{ name: '1', value: '个人', checked: true }, { name: '2', value: '企业' }],
    options: '',
    screenBtn: '',
    infoId: '',
    checkHtml: "",
    provinceList: []
  },
  init: function () {
    this.regionSelectCallback('fromid', 'start', 'startOptions');
  },
  selectType: function (e) {
    this.setData({ usertype: e.detail.value })
  },
  selectRegion: function (e) {//点击选择城市
    let name = e.target.dataset['name'];
    app.regionStatus = true;
    this.getProvince()
    this.setData({
      isShow: true,
      isShowTextArea: true,
      showData: 1
    })
    if (name == 'fromid') {
      app.selectPro = true
    } else {
      app.selectPro = false
    }
  },
  regionSelectCallback: function (key, name, options) {//获取选择地区
    let that = this;
    wx.getStorage({
      key: key,
      success: function (res) {
        console.log(res.data)
        let data = res.data;
        if(data && data.province) {
          that.setData({
            [name]: data.province['name'] + ',' + data.city['name'] + ',' + (data.district['name'] == '全部' ? '' : data.district['name']),
            [options]: data.province['id'] + ',' + data.city['id'] + ',' + (data.district['id'] == '' ? '' : data.district['id'])
          })
        }

      }
    })
  },

  onLoad: function (options) {
    var that = this;
    if (this.loaded) return;
    this.init();
    this.getProvince();
    app.uid=wx.getStorageSync('appuid');
    console.log(app.uid)
    console.log(app.serviceurl + '/api/user/' + app.uid)
    wx.request({
      url: app.serviceurl + '/api/user/' + app.uid,
      data: {

      },
      success: function (res) {
        let dd = res.data.data;
        console.info(dd);
        if(dd != null) {
          that.setData({
            id: dd.id,
            username: dd.username,
            ownname: dd.realname,
            corporatename: dd.company,
            ownerCellphone: dd.mobilephone,
            idnumber: dd.idcard,
            //start: dd.city,
            detailedaddress: dd.address,
            emergencycontact: dd.emergency,
            emergencyphone: dd.emergencyphone,
            usertype: dd.usertype

          })

          if(dd.usertype == 2) {
            that.setData({
                types:[{ name: '1', value: '个人' }, { name: '2', value: '企业',checked: true }]
            })
          }else{
            that.setData({
                types:[{ name: '1', value: '个人', checked: true }, { name: '2', value: '企业' }]
            })
          }
        }

      }
    })

    console.log(this.loaded)
    console.log(this.data);
  },
  onShow: function () {
    if (this.loaded) {
      this.init();
    } else {
      this.loaded = true;
    }
  },


  getProvince: function () {//进行省份请求
    var that = this
    var value = wx.getStorageSync('chooseCity')
    console.log(value)
    that.setData({
      proData: value.data,
      theSelect: '全国'
    })
  },
  getCity: function (e) {//获取城市
    var that = this;
    var index = e.target.dataset.index;
    var p = this.data.proData,
      c = [];
    c.push(p[index].cityList)
    var selectPro = p[index].province_name;
    var selectProId = p[index].province_id;
    that.setData({
      showData: 2,
      cityData: c[0],
      selectedProvince: {
        id: selectProId,
        name: selectPro
      },
      selectPro: selectPro,
      theSelect: selectPro,
      selectProId: selectProId
    })
  },
  getDistrict: function (e) {//获取区县
    var index = e.target.dataset.index;
    var that = this;
    var selectCity = that.data.cityData[index].name;
    var selectCityId = index;
    var distData = that.data.cityData[index].list;
    that.setData({
      distData: distData,
      showData: 3,
      selectCities: {
        id: index,
        name: selectCity
      },
      selectCity: selectCity,
      theSelect: selectCity,
      selectCityId: selectCityId
    })
  },
  backToAdd: function () {//返回到add界面
    this.setData({
      isShow: false,
      isShowTextArea: false
    })
  },
  backToFront: function () {//返回到省级
    this.setData({
      showData: 1,
      theSelect: '全国'
    })
  },
  backToSecond: function () {//返回到市级
    this.setData({
      showData: 2,
      theSelect: this.data.selectPro
    })
  },
  selectAll: function (e) {//选择其他的区县
    var index = e.target.dataset.index;
    var that = this;
    var selectDist = that.data.distData[index];
    var selectDistId = index;
    if (app.selectPro) {
      that.setData({
        isShow: false,
        isShowTextArea: false,
        selectedCity: {
          id: index,
          name: selectDist
        },
        start: that.data.selectPro + ',' + that.data.selectCity + ',' + selectDist,
        startOptions: that.data.selectProId + ',' + that.data.selectCityId + ',' + selectDistId
      })
      wx.setStorage({
        key: 'fromid',
        data: {
          province: this.data['selectedProvince'],
          city: this.data['selectCities'],
          district: this.data['selectedCity']
        }
      })
    } else {
      that.setData({
        isShow: false,
        isShowTextArea: false,
        selectedCity: {
          id: index,
          name: selectDist
        },
        end: that.data.selectPro + ',' + that.data.selectCity + ',' + selectDist,
        endOptions: that.data.selectProId + ',' + that.data.selectCityId + ',' + selectDistId
      })
      wx.setStorage({
        key: 'toid',
        data: {
          province: this.data['selectedProvince'],
          city: this.data['selectCities'],
          district: this.data['selectedCity']
        }
      });
    }
  },
  chooseAll: function (e) {//选择全部的时候
    var that = this;
    var index = e.target.id;
    var selectDist = '全部'
    if (app.selectPro) {
      that.setData({
        isShow: false,
        isShowTextArea: false,
        selectedCity: {
          id: e.target.id,
          name: selectDist
        },
        start: that.data.selectPro + ',' + that.data.selectCity + ',' + (selectDist == '全部' ? '' : selectDist),
        startOptions: that.data.selectProId + ',' + that.data.selectCityId
      })
      wx.setStorage({
        key: 'fromid',
        data: {
          province: this.data['selectedProvince'],
          city: this.data['selectCities'],
          district: this.data['selectedCity']
        }
      })
    } else {
      that.setData({
        isShow: false,
        isShowTextArea: false,
        selectedCity: {
          id: e.target.id,
          name: selectDist
        },
        end: that.data.selectPro + ',' + that.data.selectCity + ',' + (selectDist == '全部' ? '' : selectDist),
        endOptions: that.data.selectProId + ',' + that.data.selectCityId
      })
      wx.setStorage({
        key: 'toid',
        data: {
          province: this.data['selectedProvince'],
          city: this.data['selectCities'],
          district: this.data['selectedCity']
        }
      })
    }
  },

  formReset: function () {
    this.setData({

    })
  },
  _submit: function (o, title) {
    let that = this;
    
    wx.request({
      url: app.serviceurl + '/api/user',
      method: 'POST',
      data: o,
      success: function (res) {
        console.log(res)
        res = res.data;
        if(res.status == 10) {
          wx.showModal({  
            title: '提示',  
            content: '填写的唯一号已经存在'  
          })  
        } else if(res.status == 11) {
          wx.showModal({  
            title: '提示',  
            content: '唯一号不能修改'  
          })  
        } else if(res.status == 20) {
          wx.showModal({  
            title: '提示', 
            showCancel: true,
            content:'您已通过实名认证,重新提交将需要再次认证!是否确认重新提交?',
            success: function(res) { 
              if (res.confirm) { 
                that._submit2(o, '提交成功');
              }
            }
          })  
        } else {
          if (res.info == 'OK') {
            wx.setStorageSync('appuid', o.username)
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
        
      }
    })
    feedbackApi.showToast({title: '提交处理中,请稍候!',duration: 2000 })
  },
  _submit2: function (o, title) {
    let that = this;
    
    wx.request({
      url: app.serviceurl + '/api/user/reverify',
      method: 'POST',
      data: o,
      success: function (res) {
        console.log(res)
        res = res.data;
        if(res.status == 10) {
          wx.showModal({  
            title: '提示',  
            content: '填写的唯一号已经存在'  
          })  
        } else if(res.status == 11) {
          wx.showModal({  
            title: '提示',  
            content: '唯一号不能修改'  
          })  
        } else {
          if (res.info == 'OK') {
            wx.setStorageSync('appuid', o.username)
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
        
      }
    })
    
  },
  formSubmit: function (e) {
    let formData = e.detail.value;
    console.log('form发生了submit事件，携带数据为：', formData);
    var openId = (wx.getStorageSync('openId'));
    console.log(this.data);
    var flag = true;//判断信息输入是否完整  
    var warn = "";//弹框时提示的内容  
    var that=this;
 
    var pattern = /^[A-Za-z0-9]+$/gi;


    if(formData['username']=="") {
      warn="请填写唯一号(只能包含字母或数字)";
    } else if (!pattern.test(formData['username'])) {
      warn="唯一号只能包含字母或数字";
    }else if(formData['ownname']==""){
      warn="请填写真实有效的名字";
    } else if(formData['ownerCellphone']=="" || formData['ownerCellphone'].length<11) {
      warn="请填写您的手机号码";
    } else if(formData['idnumber']=="" || formData['idnumber'].length<18) {
      warn="请填写您真实的身份证号";
    } else if(formData['corporatename']=="") {
      warn="请填写您的手机号码";
    } else if(this.data['start']=="" || this.data['start']=="请选择城市") {
      warn="请选择所在地区";
    } else if(this.data['startOptions']=="" || this.data['startOptions']==",,") {
      warn="请选择所在地区";
    } else if(formData['usertype']=="") {
      warn="请选择类型";
    } else {
      flag=false;
      let submitData = {
        "id": formData['id'],
        "openid":openId,
        "username": formData['username'],
        "password": "",
        "email": "",
        "realname": formData['ownname'],
        "company": formData['corporatename'],
        "mobilephone": formData['ownerCellphone'],
        "idcard": formData['idnumber'],
        "province": this.data['start'],
        "city": this.data['startOptions'],
        "address": formData['detailedaddress'],
        "emergency": formData['emergencycontact'],
        "emergencyphone": formData['emergencyphone'],
        "usertype":this.data['usertype']
      };
      //console.log(submitData);
      feedbackApi.showToast({title: '提交处理中,请稍候!',duration: 2000 })
      that._submit(submitData, '提交成功');
      // wx.request({
      //   url: app.serviceurl + '/api/identityauth/' + formData['username'] + '/type/100',
      //   data: {
      //       uid:formData['username']
      //   },
      //   success:function(res){
      //       console.log(res.data);
      //       if(res.data && (res.data.data)) {
      //         let _authresult = res.data.data['authresult'];
      //         // let _ok = false;
      //         if(_authresult == '1') {
      //           wx.showModal({  
      //             title: '提示', 
      //             showCancel: true,
      //             content:'您已通过实名认证,重新提交将需要再次认证!是否确认重新提交?',
      //             success: function(res) { 
      //               if (res.confirm) { 
      //                 that._submit(submitData, '提交成功');
      //               }
      //             }
      //           })  
      //         } else {
      //           that._submit(submitData, '提交成功');
      //         }
      //       } else {
      //         that._submit(submitData, '提交成功');
      //       }
      //   }
      // })

      
    }
    
    if(flag==true){  
      wx.showModal({  
        title: '提示', 
        showCancel: false,
        content:warn  
      })  
    }    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

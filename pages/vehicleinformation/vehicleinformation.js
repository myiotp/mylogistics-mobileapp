let app = getApp();

var optionList = [];

Page({
  data: {
    textHint: "您的隐私会受到法律保护，请您放心填写  。",
    licenseplate: '',
    licenseplate: '',
    enginenumber: '',
    registrationaddress: '',
    vehicletype: '',
    vehiclebrand:'',
    vehicleweight:'',
    cargolength: '',
    checkdeadline: '',
    insurancedeadline: '',
    certimage: '',
    authresult: 0,
    comment: '',
    gpsx:0,
    gpsy:0,
    hiddenBoolean: true,
    inputHidden: true,
    className: ['header'],
    start: "请选择城市",
    options: '',
    screenBtn: '',
    infoId: '',
    checkHtml: "",
    provinceList: []
  },
  init: function () {
    //this.regionSelectCallback('fromid', 'start', 'startOptions');
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
    console.log(app.serviceurl + '/api/uservehicle/getJson?id=' + options['id'])
    if(options['id']) {
      wx.request({
        url: app.serviceurl + '/api/uservehicle/getJson?id=' + options['id'],
        data: {

        },
        success: function (res) {
          let dd = res.data;
          console.info(dd);
          if(dd != null) {
            that.setData({
              id: dd.id,
              username: app.uid,
              licenseplate: dd.licenseplate,
              licenseplate: dd.licenseplate,
              enginenumber: dd.enginenumber,
              registrationaddress: dd.registrationaddress,
              vehicletype: dd.vehicletype,
              vehiclebrand:dd.vehiclebrand,
              vehicleweight:dd.vehicleweight,
              cargolength: dd.cargolength,
              checkdeadline: dd.checkdeadline,
              insurancedeadline: dd.insurancedeadline,
              certimage: dd.certimage,
              authresult: dd.authresult,
              comment: dd.comment,
              gpsx: dd.gpsx,
              gpsy: dd.gpsy
            })
          }

        }
      })//end
    }


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
      url: app.serviceurl + '/api/uservehicle',
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
            wx.redirectTo({
              url: '../usercarlist/usercarlist'
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
      "licenseplate": formData['licenseplate'],
      "enginenumber": formData['enginenumber'],
      "registrationaddress": formData['registrationaddress'],
      "vehicletype": formData['vehicletype'],
      "vehiclebrand":formData['vehiclebrand'],
      "vehicleweight":formData['vehicleweight'],
      "cargolength": formData['cargolength'],
      "checkdeadline": formData['checkdeadline'],
      "insurancedeadline": formData['insurancedeadline'],
      "certimage": '',
      "authresult": 0,
      "comment": ''
    };
    console.log(submitData);
    this._submit(submitData, '提交成功')
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

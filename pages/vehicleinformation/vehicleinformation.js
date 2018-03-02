let app = getApp();

var optionList = [];
var type = [];
var size = [];
var list = [
  {
    information: '车辆类型',
    select: '请选择车辆类型',
    bindBtn: 'carType',
    name: 'car_type',
    val: ''
  }, {
    information: '货箱长度',
    select: '请选择货箱长度',
    bindBtn: 'carExtent',
    name: 'car_size',
    val: ''
  }
];

Page({
  data: {
    validstartdate:'',
    validenddate:'',
    textHint: "您的隐私会受到法律保护，请您放心填写  。",
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
    options: '',
    hiddenBoolean: true,
    inputHidden: true,
    className: ['header'],
    start: "请选择城市",
    infoList: list,
    options: '',
    screenBtn: '',
    infoId: '',
    checkHtml: "",
    mycartyelist:[],
    mycarlengthlist:[],
    provinceList: []
  },
  init: function () {
    this.regionSelectCallback('registrationaddress', 'start', 'startOptions');
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
    if (name == 'registrationaddress') {
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

      },
      fail: function(res) {
        console.log(res)
        that.setData({
          [name]: ',,',
          [options]: ',,'
        })
      }
    })
  },
  address: function (e) {
    var addId = e.currentTarget.id;
    if (addId <= 2) {
      this.setData({
        infoId: addId,
        options: this.data.provinceList,
        hiddenBoolean: !this.data.hiddenBoolean,
        screenBtn: 'cityBtn'
      });

    }
  },
  carType: function (e) {
    var addId = e.currentTarget.id;
    if (addId == 0) {
      this.setData({
        infoId: addId,
        options: this.data.mycartyelist,
        hiddenBoolean: !this.data.hiddenBoolean,
        screenBtn: 'carBtn'
      });
    }
  },
  carExtent: function (e) {
    if (e.currentTarget.id == 1) {
      this.setData({
        infoId: e.currentTarget.id,
        options: this.data.mycarlengthlist,
        hiddenBoolean: !this.data.hiddenBoolean,
        screenBtn: 'carBtn'
      });
    }
  },
  hiddenBtn: function (e) {
    this.setData({
      hiddenBoolean: !this.data.hiddenBoolean
    })
  },

  overBtn: function (e) {
    var zone,
      dataId = e.currentTarget.id,
      num = this.data.infoId;
    for (var i = 0; i < optionList.length; i++) {
      if (optionList[i].id == dataId) {
        zone = optionList[i].name;
      }
    }
    if (dataId != '') {
      this.data.infoList[this.data.infoId].val = dataId;
      this.data.infoList[this.data.infoId].select = zone;

      var newInfo = this.data.infoList;
      this.setData({
        hiddenBoolean: !this.data.hiddenBoolean,
        screenBtn: '',
        infoList: newInfo
      });

      console.log(newInfo);
    }
  },

  bindcheckdeadlineDateChange: function(e) {
    this.setData({
      checkdeadline: e.detail.value
    });
    console.log(this.data);
  },
  bindinsurancedeadlineDateChange: function(e) {
    this.setData({
      insurancedeadline: e.detail.value
    });
    console.log(this.data);
  },

  onLoad: function (options) {
    var that = this;
    if (this.loaded) return;
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    this.setData({
      checkdeadline: date.getFullYear() + seperator1 + month + seperator1 + strDate,
      insurancedeadline: date.getFullYear() + seperator1 + month + seperator1 + strDate,
      validstartdate: (date.getFullYear()-10) + seperator1 + month + seperator1 + strDate,
      validenddate: (date.getFullYear()+10) + seperator1 + month + seperator1 + strDate
    })

    this.init();
    this.getProvince();
    this.initcartype();
    this.initcarlength();

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
              start:dd.fromname,
              infoList:[
                {
                  information: '车辆类型',
                  select: dd.vehicletype,
                  bindBtn: 'carType',
                  name: 'car_type',
                  val: dd.vehicletype
                }, {
                  information: '货箱长度',
                  select: dd.cargolength,
                  bindBtn: 'carExtent',
                  name: 'car_size',
                  val: dd.cargolength
                }
              ],
              registrationaddress: dd.fromAddress,
              registrationaddressdetail:dd.fromAddress,
              vehicletype: dd.vehicletype,
              vehiclebrand:dd.vehiclebrand,
              vehicleweight:dd.vehicleweight,
              cargolength: dd.cargolength,
              checkdeadline: dd.checkdeadline,
              insurancedeadline: dd.insurancedeadline,
              certimage: dd.certimage,
              authresult: dd.authresult,
              comment: dd.comment,
              gpsx: dd.fromlng,
              gpsy: dd.fromlat
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
        key: 'registrationaddress',
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
        key: 'registrationaddress',
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

  showMap:function(e){
   
    var that = this;

    console.log(that.data.gpsx + "," + that.data.gpsy + ',' + that.data.licenseplate)
    wx.openLocation({
      latitude: that.data.gpsy,
      longitude: that.data.gpsx,
      scale: 16,
      name: that.data.licenseplate
    })

},

  carBtn: function (e) {
    var me, zone;
    var dataId = e.currentTarget.id,
      arr = this.data.infoList[this.data.infoId];
    if (this.data.infoId == 0) {
      me = this.data.mycartyelist;
    } else if (this.data.infoId == 1) {
      me = this.data.mycarlengthlist;
    }
    for (var i = 0; i < me.length; i++) {
      if (me[i].id == dataId) {
        zone = me[i].name;
      }
    }
    this.data.infoList[this.data.infoId].val = dataId;
    this.data.infoList[this.data.infoId].select = zone;

    var newInfo = this.data.infoList;
    this.setData({
      hiddenBoolean: !this.data.hiddenBoolean,
      screenBtn: '',
      infoList: newInfo
    })
  },
  initcartype : function () {
    this.type = wx.getStorageSync('chooseCartype');
    this.setData({
        mycartyelist:this.type
    })
    //console.log(this.type);
  },
  initcarlength: function () {
    this.setData({
        mycarlengthlist:wx.getStorageSync('chooseCarLength')
    })
    //console.log(this.type);
  },
  formReset: function () {
    this.setData({

    })
  },
  gotoauth : function () {
    wx.redirectTo({
      url: '../drivingcertification/drivingcertification?id='+this.data.id + '&img='+this.data.certimage
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
    var length = this.data.infoList.length;
    var car_type = '';
    var car_size = '';
    for(var i=0;i<length;i++){
      if(this.data.infoList[i].name=='car_type'){
        car_type=this.data.infoList[i].select;
      }
      if(this.data.infoList[i].name=='car_size'){
        car_size=this.data.infoList[i].select;
      }
    }
    var flag = true;//判断信息输入是否完整  
    var warn = "";//弹框时提示的内容  
    if(formData['licenseplate']==""){
      warn="请填写车牌号";
    } else if(formData['enginenumber']=="") {
      warn="请填写发动机号";
    } else if(this.data['start']=="" || this.data['start']==",,") {
      warn="请选择车辆登记地(市区)";
    } else if(formData['registrationaddressdetail']=="") {
      warn="请填写详细的车辆登记地";
    } else if(formData['vehiclebrand']=="") {
      warn="请填写车辆品牌";
    } else if(car_type=="" || car_type == '请选择车辆类型') {
      warn="请选择车辆类型";
    } else if(car_size=="" || car_size == '请选择货箱长度') {
      warn="请选择货箱长度";  
    } else if(formData['vehicleweight']=="") {
      warn="请填写车辆载重(吨)";
    } else if(formData['vehiclebrand']=="") {
      warn="请填写车辆品牌";
    } else if(this.data['checkdeadline']=="") {
      warn="请填写年检截止日期";
    } else if(this.data['insurancedeadline']=="") {
      warn="请填写保险截止日期";
    } else {
      flag=false;
      let submitData = {
        "id": formData['id'],
        "username": app.uid,
        "fromAreaName": '',
        "fromCityName": '',
        "fromProvinceName": '',
        "fromid": this.data['startOptions'],
        "fromname": this.data['start'],
        "fromAddress": formData['registrationaddressdetail'],
        "licenseplate": formData['licenseplate'],
        "enginenumber": formData['enginenumber'],
        "registrationaddress": formData['registrationaddress'],
        "vehicletype": car_type,
        "vehiclebrand":formData['vehiclebrand'],
        "vehicleweight":formData['vehicleweight'],
        "cargolength": car_size,
        "checkdeadline": this.data['checkdeadline'],
        "insurancedeadline": this.data['insurancedeadline'],
        "certimage": '',
        "authresult": 0,
        "comment": ''
      };
      console.log(submitData);
      this._submit(submitData, '提交成功')
    }
    
    if(flag==true){  
      wx.showModal({  
        title: '提示',  
        content:warn  
      })  
    }  
  },
  removeFavorite:function(){
    let that = this;
    console.log(that.data)
    wx.request({
      url: app.serviceurl + '/api/uservehicle/username/'+app.uid+'/id/'+that.data['id'],
      method: 'DELETE',
      data: {},
      success: function (res) {
        console.log(res)
        res = res.data;
        if (res.status == 1 || res.status == 2) {
          wx.showToast({
            title: '删除成功',
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

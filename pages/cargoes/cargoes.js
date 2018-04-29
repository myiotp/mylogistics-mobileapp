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
    cargoOwner: '',
    ownerCellphone: '',
    ownercompany: '',
    operator: '',
    emergencyContact: '',
    emergencyCellphone: '',
    textHint: "请添加您的货物相关信息，以便于我们帮您更精准的配车和让车主更加了解您。",
    hiddenBoolean: true,
    inputHidden: true,
    className: ['header'],
    infoList: list,
    options: '',
    screenBtn: '',
    infoId: '',
    checkHtml: "",
    shipTimestamp: '',
    today:'',
    validenddate:'',
    mycartyelist:[],
    mycarlengthlist:[],
    provinceList: []
  },
  init: function () {
    this.regionSelectCallback('fromid2', 'start', 'startOptions');
    this.regionSelectCallback('toid2', 'end', 'endOptions');
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
    if (name == 'fromid2') {
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
  formReset: function () {
    this.setData({
      infoList: list
    })
  },

  onLoad: function (options) {
    var that = this;
    if (this.loaded) return;
    this.init();
    this.getProvince();
    this.initcartype();
    this.initcarlength();
    this.initdata();

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
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    this.setData({
      today: currentdate,
      validenddate: (date.getFullYear()+1) + seperator1 + month + seperator1 + strDate,
      shipTimestamp: currentdate
    })
    console.log(this.loaded)
    console.log(this.data);
  },
  initdata : function() {
    var that = this;
    var p = {

    }
    wx.request({
      url: app.serviceurl + "/api/cargoes/username/"+app.uid+"/latest",
      data: p,

      success: function (res) {
        if(res.data.data) {
          var _data  = res.data.data;
          that.setData({
            cargoOwner: _data['cargoOwner'],
            ownerCellphone: _data['ownerCellphone'],
            ownercompany: _data['ownercompany'],
            operator: _data['operator'],
            emergencyContact: _data['emergencyContact'],
            emergencyCellphone: _data['emergencyCellphone']
          })
        }
       
      }
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
  _submit: function (o, title) {
    let that = this;
    wx.request({
      url: app.serviceurl + '/api/cargoes',
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
              url: '../success2/success2'
            })
          }, 1e3);

        } else {
          wx.showModal({  
            title: '提示',  
            content:res.info  
          })  
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
    if(formData['cargoOwner']==""){
      warn="请填写真实有效的名字";
    } else if(formData['ownerCellphone']=="") {
      warn="请填写您的手机号码";
    } else if(this.data['startOptions']=="" || this.data['startOptions']==",,") {
      warn="请选择装货地址";
    } else if(this.data['endOptions']=="" || this.data['endOptions']==",,") {
      warn="请选择卸货地址";
    } else if(car_type=="" || car_type == '请选择车辆类型') {
      warn="请选择车辆类型";
    } else if(car_size=="" || car_size == '请选择货箱长度') {
      warn="请选择货箱长度";  
    } else if(formData['cargoWeight']=="") {
      warn="请填写载重(吨)";
    } else if(formData['vehicledimension']=="") {
      warn="请填写货物体积";
    } else {
      flag=false;
      //need to handle formData['shiptime']
      let submitData = {
        "id": formData['id'],
        "username": app.uid,
        "ownercompany": formData['ownercompany'],
        "operator": formData['operator'],
        "cargotype": formData['cargotype'],
        "fromAreaName": '',
        "fromCityName": '',
        "fromProvinceName": '',
        "fromid": this.data['startOptions'],
        "fromname": this.data['start'],
        "fromAddress": formData['shipaddress'],
        "toAreaName": '',
        "toCityName": '',
        "toProvinceName": '',
        "toid": this.data['endOptions'],
        "toname": this.data['end'],
        "toAddress": formData['destinationaddress'],
        "carType": car_type,
        "carLength": car_size,
        "status": 0,
        "cargoOwner": formData['cargoOwner'],
        "ownerCellphone": formData['ownerCellphone'],
        "cargoName": formData['cargoName'],
        "cargoWeight": formData['cargoWeight'],
        "vehicledimension":formData['vehicledimension'],
        "shipTimestamp": '2018-01-02',
        "price": formData['price'],
        "payment": formData['payment'],
        "validDays": formData['validtime'],
        "memo": formData['memo'],
        "wechat": formData['wechat'],
        "emergencyContact": formData['emergencyContact'],
        "emergencyCellphone": formData['emergencyCellphone'],
        "category": formData['category'],
        "mileage": 0
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
  bindShipDateChange: function(e) {
    this.setData({
      shipTimestamp: e.detail.value
    });
    console.log(this.data);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
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
         key: 'fromid2',
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
         key: 'fromid2',
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

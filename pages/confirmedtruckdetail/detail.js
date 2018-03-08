var app = getApp();
var socketOpen = false
var socketMsgQueue = []
Page({
    data:{
        socktBtnTitle: '启动跟踪',
        id:'',
        start:{
            city:'',
            province:''
        },
        end:{
            city:'',
            province:''
        },
        fromlnglat: {
          lng:0,
          lat:0
        },
        tolnglat: {
          lng: 0,
          lat: 0
        },
        licenseplate:'',
        receipt:'',
        address:[

        ],
        source:[

        ],
        other:'',
        phone:'',
        favoited:false
    },
    onLoad:function(options){
        var that = this;
        that.setData({
          id: options['id']
        })

        wx.request({
            url: app.serviceurl+'/api/truck/' + options['id'],
            data:{
                id:options['id'],
                username: app.uid
            },
            success:function(res){
              console.debug(res.data.data);
              var rawdata = res.data.data;
              that.setData({
                start: {
                  city: rawdata.fromCityName,
                  province: rawdata.fromProvinceName
                },
                end: {
                  city: rawdata.toCityName,
                  province: rawdata.toProvinceName
                },
                fromlnglat:{
                  lng: rawdata.fromlng,
                  lat: rawdata.fromlat
                },
                tolnglat: {
                  lng: rawdata.tolng,
                  lat: rawdata.tolat
                },
                receipt: rawdata.price + '元/' + rawdata.cargoWeight + '吨  '  + rawdata.payment,
                licenseplate: rawdata.licenseplate,
                address: [
                  {
                    title: '装货地址',
                    content: rawdata.fromProvinceName + rawdata.fromCityName + rawdata.fromAreaName
                  },
                  {
                    title: '卸货地址',
                    content: rawdata.toProvinceName + rawdata.toCityName + rawdata.toAreaName
                  }
                ],
                source: [
                  {
                    caption: '车主姓名',
                    content: rawdata.owner  || ''
                  },
                  {
                    caption: '微信',
                    content: rawdata.wechat  || ''
                  }
                ],
                source1: [
                  {
                    caption: '所在公司',
                    content: rawdata.ownercompany || ''
                  },
                  {
                    caption: '经办人',
                    content: rawdata.operator || ''
                  }
                ],
                source2: [
                  {
                    caption: '装货时间',
                    content: rawdata.shipTimestamp  || ''
                  },
                  {
                    caption: '运输时效',
                    content: rawdata.validDays +'天'
                  }
                ],
                source3: [
                  {
                    caption: '车辆品牌',
                    content: rawdata.truckBarnd || ''
                  },
                  {
                    caption: '车辆情况',
                    content: rawdata.carLength + '米' + (rawdata.carType  || '')
                  }
                ],
                source4: [
                  {
                    caption: '车辆载重',
                    content: rawdata.truckWeight +'吨'
                  },
                  {
                    caption: '可载货物种类',
                    content: rawdata.cargotype || ''
                  }
                ],
                source5: [
                  {
                    caption: '紧急联系人',
                    content: rawdata.emergencyContact || ''
                  },
                  {
                    caption: '紧急联系人电话',
                    content: rawdata.emergencyCellphone || ''
                  }
                ],
                other: rawdata.memo,
                phone: rawdata.ownerCellphone,
                favoited:rawdata.favoited
              });
            }
        })
    },
    makePhoneCall:function(){
        var that = this;
        wx.makePhoneCall({
            phoneNumber:that.data['phone']
        })
    },
    starttracking:function(){
      var that = this;
      var remindTitle = socketOpen ? '正在关闭' : '正在连接'
      wx.showToast({
        title: remindTitle,
        icon: 'loading',
        duration: 10000
      })

      if (!socketOpen) {
        wx.connectSocket({
          url: 'ws://localhost:8080'
        })
        wx.onSocketError(function (res) { 
          socketOpen = false 
          console.log('WebSocket连接打开失败，请检查！') 
          that.setData({ 
            socktBtnTitle: '启动跟踪' 
          }) 
          wx.hideToast() 
        })
        wx.onSocketOpen(function (res) {
          console.log('WebSocket连接已打开！')
          wx.hideToast()
          that.setData({
            socktBtnTitle: '跟踪已启动，点击断开连接'
          })
          socketOpen = true
          for (var i = 0; i < socketMsgQueue.length; i++) {
            that.sendSocketMessage(socketMsgQueue[i])
          }
          socketMsgQueue = []
        })
        wx.onSocketClose(function (res) {
          socketOpen = false
          console.log('WebSocket 已关闭！')
          wx.hideToast()
          that.setData({
            socktBtnTitle: '启动跟踪'
          })
        })
      } else {
        //关闭WebSocket连接。
        wx.closeSocket()
      }    

      setInterval(function () {  
        //循环执行代码  
        //console.log("111");
        if(socketOpen) {
          wx.getLocation({
            type: 'gcj02',
            success: function(res) {
              var latitude = res.latitude
              var longitude = res.longitude
              var speed = res.speed
              var accuracy = res.accuracy
              var msg = "{'t':"+latitude+",'g':"+longitude+",'s':"+speed+",'a':"+accuracy+"}";
              //console.log(msg)
              that.sendSocketMessage(msg)
              
            },
            fail: function(err) {
              console.log(err)
              wx.getSetting({
                success: (res) => {
                  console.log(res);
                  console.log(res.authSetting['scope.userLocation']);
                  if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {//非初始化进入该页面,且未授权
                    wx.showModal({
                      title: '是否授权当前位置',
                      content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                      success: function (res) {
                        if (res.cancel) {
                          console.info("1授权失败返回数据");
          
                        } else if (res.confirm) {
                          //village_LBS(that);
                          wx.openSetting({
                            success: function (data) {
                              console.log(data);
                              if (data.authSetting["scope.userLocation"] == true) {
                                wx.showToast({
                                  title: '授权成功',
                                  icon: 'success',
                                  duration: 5000
                                })
                                //再次授权，调用getLocationt的API
                                //village_LBS(that);
                              }else{
                                wx.showToast({
                                  title: '授权失败',
                                  icon: 'success',
                                  duration: 5000
                                })
                              }
                            }
                          })
                        }
                      }
                    })
                  } else if (res.authSetting['scope.userLocation'] == undefined) {//初始化进入
                    //village_LBS(that);
                  }
                }
              })
            }
          })
        }
        
      }, 10000) //循环时间 这里是10秒   
   },
   sendSocketMessage: function (msg) { 
    if (socketOpen) { 
      //通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。 
      wx.sendSocketMessage({ 
        data: msg 
       }) 
     } else { 
       socketMsgQueue.push(msg) 
     } 
    },

    removeFavorite:function(){
      let that = this;
      console.log(that.data)
      wx.request({
        url: app.serviceurl + '/api/userfavorite/username/'+app.uid+'/vehicle/'+that.data['id'],
        method: 'DELETE',
        data: {},
        success: function (res) {
          console.log(res)
          res = res.data;
          if (res.status == 1 || res.status == 2) {
            wx.showToast({
              title: '取消收藏成功',
              icon: 'success',
              duration: 1e3
            });
            setTimeout(function () {
              app.submited = true;
              wx.hideToast();
              wx.redirectTo({
                url: '../favorites/favorites'
              })
            }, 1e3);
          }
        }
      })
    },
    addFavorite:function(){
      let that = this;
      console.log(that.data)
      wx.request({
        url: app.serviceurl + '/api/userfavorite/username/'+app.uid+'/vehicle/'+that.data['id'],
        method: 'POST',
        data: {},
        success: function (res) {
          console.log(res)
          res = res.data;
          if (res.status == 1 || res.status == 2) {
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 1e3
            });
            setTimeout(function () {
              app.submited = true;
              wx.hideToast();
              wx.switchTab({
                url: '../carlist/carlist'
              })
            }, 1e3);
          }
        }
      })
    },
    showMap:function(e){
        var index = e.target['dataset'].index;
        var that = this;
        console.log(index)
        console.log(that.data.fromlnglat.lat + "," + that.data.tolnglat.lat + ',' + that.data.address[0].content)
        console.log(that.data.fromlnglat.lng + "," + that.data.tolnglat.lng + ',' + that.data.address[1].content)
        if(index == '0') {
          wx.openLocation({
            latitude: that.data.fromlnglat.lat,
            longitude: that.data.fromlnglat.lng,
            scale: 16,
            name: that.data.address[0].content
          })
        } else if (index == '1') {
          wx.openLocation({
            latitude: that.data.tolnglat.lat,
            longitude: that.data.tolnglat.lng,
            scale: 16,
            name: that.data.address[1].content
          })
        } 

    },
    onShow:function(options){
        var that = this;
        console.info(app.serviceurl+'/api/truck/' + that.data['id']);
        wx.request({
            url: app.serviceurl+'/api/truck/' + that.data['id'],
            data:{
              username: app.uid
            },
            success:function(res){
              console.info(res.data.data);
              var rawdata = res.data.data;
              that.setData({
                id: that.data['id'],
                start: {
                  city: rawdata.fromCityName,
                  province: rawdata.fromProvinceName
                },
                end: {
                  city: rawdata.toCityName,
                  province: rawdata.toProvinceName
                },
                receipt: rawdata.price + '元/' + rawdata.cargoWeight + '吨  '  + rawdata.payment,
                licenseplate: rawdata.licenseplate,
                address: [
                  {
                    title: '装货地址',
                    content: rawdata.fromProvinceName + rawdata.fromCityName + rawdata.fromAreaName
                  },
                  {
                    title: '卸货地址',
                    content: rawdata.toProvinceName + rawdata.toCityName + rawdata.toAreaName
                  }
                ],
                source: [
                  {
                    caption: '车主姓名',
                    content: rawdata.owner  || ''
                  },
                  {
                    caption: '微信',
                    content: rawdata.wechat  || ''
                  }
                ],
                source1: [
                  {
                    caption: '所在公司',
                    content: rawdata.ownercompany || ''
                  },
                  {
                    caption: '经办人',
                    content: rawdata.operator || ''
                  }
                ],
                source2: [
                  {
                    caption: '装货时间',
                    content: rawdata.shipTimestamp  || ''
                  },
                  {
                    caption: '运输时效',
                    content: rawdata.validDays +'天'
                  }
                ],
                source3: [
                  {
                    caption: '车辆品牌',
                    content: rawdata.truckBarnd || ''
                  },
                  {
                    caption: '车辆情况',
                    content: rawdata.carLength + '米' + (rawdata.carType  || '')
                  }
                ],
                source4: [
                  {
                    caption: '车辆载重',
                    content: rawdata.truckWeight +'吨'
                  },
                  {
                    caption: '可载货物种类',
                    content: rawdata.cargotype || ''
                  }
                ],
                source5: [
                  {
                    caption: '紧急联系人',
                    content: rawdata.emergencyContact || ''
                  },
                  {
                    caption: '紧急联系人电话',
                    content: rawdata.emergencyCellphone || ''
                  }
                ],
                other: rawdata.memo,
                phone: rawdata.ownerCellphone,
                favoited:rawdata.favoited
              });
            }
        })
    }
})

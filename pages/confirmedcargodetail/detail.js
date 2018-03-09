var app = getApp();
var socketMsgQueue = [];

Page({
    data:{
        socktBtnTitle: '启动跟踪',
        wstxid: '',
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
        
        mileage:'',
        receipt:'',
        address:[

        ],
        source:[

        ],
        other:'',
        phone:'',
        favorite:false,
        booked:false,
        canUpdate:false,
        canDelete:false,
        owner:''
    },
    onLoad:function(options){
      var that = this;
        that.setData({
          id: options['id'],
          txid:options['txid'],
          wstxid:wx.getStorageSync('wstxid')
        })
        console.log("txid:" + options['txid'] + ",wstxid:"+wx.getStorageSync('wstxid'))
        if(wx.getStorageSync('wstxid')) {
          if(options['txid'] == wx.getStorageSync('wstxid')) {
            that.setData({socktBtnTitle: '跟踪已启动，点击断开连接'})
          } else {
            that.setData({socktBtnTitle: '其他交易正在跟踪中，点击监控该交易，同时会断开其他交易跟踪'})
          }
        } else {
          that.setData({socktBtnTitle: '启动跟踪'})
        }

        wx.request({
            url: app.serviceurl+'/api/cargoes/' + options['id'],
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
                mileage: rawdata.mileage,
                address: [
                  {
                    title: '装货地址',
                    content: rawdata.fromProvinceName + rawdata.fromCityName + rawdata.fromAreaName + rawdata.fromAddress
                  },
                  {
                    title: '卸货地址',
                    content: rawdata.toProvinceName + rawdata.toCityName + rawdata.toAreaName + rawdata.toAddress
                  }
                ],
                source: [
                  {
                    caption: '货主姓名',
                    content: rawdata.cargoOwner || ''
                  },
                  {
                    caption: '微信',
                    content: rawdata.wechat || ''
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
                    content: rawdata.shipTimestamp
                  },
                  {
                    caption: '运输时效(天)',
                    content: rawdata.validDays
                  },
                  {
                    caption: '付款方式',
                    content: rawdata.payment
                  }
                ],
                source3: [
                  {
                    caption: '货物名称',
                    content: rawdata.cargoName
                  },
                  {
                    caption: '货物种类',
                    content: rawdata.cargotype || ''
                  }
                ],
                source4: [
                  {
                    caption: '货物情况',
                    content: rawdata.cargoWeight +'吨' + rawdata.vehicledimension + '立方米'
                  },
                  {
                    caption: '车辆需求',
                    content: rawdata.carLength + '米' + rawdata.carType
                  }
                ],
                source5: [
                  {
                    caption: '紧急联系人',
                    content: rawdata.emergencyContact
                  },
                  {
                    caption: '紧急联系人电话',
                    content: rawdata.emergencyCellphone
                  }
                ],
                other: rawdata.memo,
                phone: rawdata.ownerCellphone,
                favorite:rawdata.favoited,
                booked: rawdata.canCreate,
                canUpdate:rawdata.canUpdate,
                canDelete:rawdata.canDelete,
                owner: rawdata.username
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
      console.log("that.data.wstxid:" + that.data.wstxid)
      var remindTitle = that.data.socketOpen ? '正在关闭' : '正在连接'
      wx.showToast({
        title: remindTitle,
        icon: 'loading',
        duration: 2000
      })

      if (!that.data.socketOpen) {
        wx.hideToast()
        that.setData({
          socktBtnTitle: '跟踪已启动，点击断开连接',
          socketOpen: true
        })
        wx.setStorageSync('wstxid', that.data['txid']);
        // wx.onSocketError(function (res) { 
        //   console.log('WebSocket连接打开失败，请检查！') 
        //   that.setData({ 
        //     socktBtnTitle: '启动跟踪',
        //     socketOpen: false
        //   }) 
        //   wx.setStorageSync('socketOpen', false)
        //   wx.hideToast() 
        // })
        // wx.onSocketOpen(function (res) {
        //   console.log('WebSocket连接已打开！')
          
        //   wx.setStorageSync('socketOpen', true)
        //   for (var i = 0; i < socketMsgQueue.length; i++) {
        //     that.sendSocketMessage(socketMsgQueue[i])
        //   }
        //   socketMsgQueue = []
        // })
        // wx.onSocketClose(function (res) {
        //   console.log('WebSocket 已关闭！')
        //   wx.hideToast()
        //   that.setData({
        //     socktBtnTitle: '启动跟踪',
        //     socketOpen: false
        //   })
        //   wx.setStorageSync('socketOpen', false)
        // })
      } else {
        //关闭WebSocket连接。
        that.setData({
          socktBtnTitle: '启动跟踪',
          socketOpen: false
        })
        wx.setStorageSync('wstxid', '');
      }    
   },
   viewtracing:function(){
    let that = this;
    console.log(that.data)
    wx.navigateTo({
      url: '../tracing/tracing?txid='+that.data['txid']+'&cid='+that.data['id']+'&o='+that.data['owner']
    })
  },
    removeFavorite:function(){
      let that = this;
      console.log(that.data)
      wx.request({
        url: app.serviceurl + '/api/userfavorite/username/'+app.uid+'/cargo/'+that.data['id'],
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
              wx.switchTab({
                url: '../list/list'
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
        url: app.serviceurl + '/api/userfavorite/username/'+app.uid+'/cargo/'+that.data['id'],
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
                url: '../list/list'
              })
            }, 1e3);
          }
        }
      })
    },
    confirm:function(){
      let that = this;
      console.log(that.data)
      wx.navigateTo({
        url: '../mycargotrucks4tx/trucks?cid='+that.data['id']+'&o='+that.data['owner']
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
        console.info(app.serviceurl+'/api/cargoes/' + that.data['id']);
        wx.request({
            url: app.serviceurl+'/api/cargoes/' + that.data['id'],
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
                mileage: rawdata.mileage,
                address: [
                  {
                    title: '装货地址',
                    content: rawdata.fromProvinceName + rawdata.fromCityName + rawdata.fromAreaName + rawdata.fromAddress
                  },
                  {
                    title: '卸货地址',
                    content: rawdata.toProvinceName + rawdata.toCityName + rawdata.toAreaName + rawdata.toAddress
                  }
                ],
                source: [
                  {
                    caption: '货主姓名',
                    content: rawdata.cargoOwner || ''
                  },
                  {
                    caption: '微信',
                    content: rawdata.wechat || ''
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
                    content: rawdata.shipTimestamp
                  },
                  {
                    caption: '运输时效(天)',
                    content: rawdata.validDays
                  },
                  {
                    caption: '付款方式',
                    content: rawdata.payment
                  }
                ],
                source3: [
                  {
                    caption: '货物名称',
                    content: rawdata.cargoName
                  },
                  {
                    caption: '货物种类',
                    content: rawdata.cargotype || ''
                  }
                ],
                source4: [
                  {
                    caption: '货物情况',
                    content: rawdata.cargoWeight +'吨' + rawdata.vehicledimension + '立方米'
                  },
                  {
                    caption: '车辆需求',
                    content: rawdata.carLength + '米' + rawdata.carType
                  }
                ],
                source5: [
                  {
                    caption: '紧急联系人',
                    content: rawdata.emergencyContact
                  },
                  {
                    caption: '紧急联系人电话',
                    content: rawdata.emergencyCellphone
                  }
                ],
                other: rawdata.memo,
                phone: rawdata.ownerCellphone,
                favorite:rawdata.favoited,
                booked: rawdata.canCreate,
                canUpdate:rawdata.canUpdate,
                canDelete:rawdata.canDelete,
                owner: rawdata.username
              });
            }
        })
    }
})

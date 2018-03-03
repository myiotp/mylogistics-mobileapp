var app = getApp();
Page({
    data:{
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

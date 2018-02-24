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
        cid:0,
        truckowner:'',
        owner:''
    },
    onLoad:function(options){
        var that = this;
       
        that.setData({
          id: options['id'],
          cid:options['cid'],
          truckowner:options['o']
        })

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
                    caption: '装货时间',
                    content: rawdata.shipTimestamp
                  },
                  {
                    caption: '货物情况',
                    content: rawdata.cargoName + rawdata.cargoWeight +'吨'
                  },
                  {
                    caption: '车辆需求',
                    content: rawdata.carLength + '米' + rawdata.carType
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
    addBook:function(){
      let that = this;
      console.log(that.data)
      wx.request({
        url: app.serviceurl + '/api/usertransaction',
        method: 'POST',
        data: {
          cargoId: parseInt(that.data.id),
          truckId:parseInt(that.data.cid),
          operator:app.uid,
          type:2,
          var1: that.data['truckowner']
        },
        success: function (res) {
          console.log(res)
          res = res.data;
          if (res.status == 1 || res.status == 2) {
            wx.showToast({
              title: '等待货主确认',
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
                    caption: '装货时间',
                    content: rawdata.shipTimestamp
                  },
                  {
                    caption: '货物情况',
                    content: rawdata.cargoName + rawdata.cargoWeight +'吨'
                  },
                  {
                    caption: '车辆需求',
                    content: rawdata.carLength + '米' + rawdata.carType
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

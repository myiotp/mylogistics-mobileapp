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
        mileage:'',
        receipt:'',
        address:[
            
        ],
        source:[
            
        ],
        other:'',
        phone:''
    },
    onLoad:function(options){
        var that = this;
        wx.request({
            //url:app.ajaxurl,
            url: 'http://localhost:8080/onemap/api/cargoes/' + options['id'],
            data:{
                id:options['id'],
                uid:app['uid']
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
                phone: rawdata.ownerCellphone
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
    showMap:function(e){
        var index = e.target['dataset'].index;
        wx.getLocation({
          type: 'gcj02', //返回可以用于wx.openLocation的经纬度
          success: function(res) {
            var latitude = res.latitude
            var longitude = res.longitude
            wx.openLocation({
              latitude: latitude,
              longitude: longitude,
              scale: 28
            })
          }
        })

    }
})

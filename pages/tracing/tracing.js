var app = getApp();
//注册页面
Page({
  /**
   * 页面的初始数据
   */
  data: {
    txid: 0,
    scale:14,
    longitude:'',
    latitude:'',
    markers: [],
    polyline:[
      
    ],
    controls: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var txid=options['txid'];
    var cid=options['cid'];
    this.setData({
      txid: txid
    })
    
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  onShow:function(options){
    var that = this;
    var url = app.serviceurl+'/api/machinery/xy/txid/' + that.data['txid'];
    console.info(url);
    wx.request({
        url: url,
        data:{
          username: app.uid
        },
        success:function(res){
          var mydata=res.data;
          console.log(mydata);
          
          if(mydata) {
            var mypoints=mydata.data;
            var size=mypoints.length;
            console.log("size:"+size);
            console.log(mypoints[size-1].longitude + "," + mypoints[size-1].latitude)
            if(size > 0) {
              that.setData({
                longitude: mypoints[size-1].longitude,
                latitude: mypoints[size-1].latitude,
                polyline:[{
                  points: mypoints,
                  color:"#FF0000DD",
                  width: 8,
                  dottedLine: false
                }]
              })
            }
            

            console.log(that.data);
          }
          
        }
      })
    }    
})
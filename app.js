function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  var len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (var i = 0; i < len; i++) {
    var num1 = parseInt(v1[i])
    var num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

//app.js
App({
  onLaunch: function () {
    

    this.serviceurl ='https://tongdagufen.cn/onemap';
    this.wsserver='wss://tongdagufen.cn/wsapp/';
    //this.wsserver = 'ws://localhost:8080/onemap/myHandler';
    //this.serviceurl ='http://localhost:8080/onemap';
    this.imagesurl = 'https://tongdagufen.cn/uploadimages';
    this.uid =  wx.getStorageSync('appuid') || '';
    this.pageSize=10;

    this.setCity();
    this.setCartype();
    this.setCarLength();
    this.initWebSocket();

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // var openId = (wx.getStorageSync('openId'))
    // if (openId) {
    //   wx.getUserInfo({
    //     success: function (res) {
    //       that.setData({
    //         nickName: res.userInfo.nickName,
    //         avatarUrl: res.userInfo.avatarUrl,
    //       })
    //     },
    //     fail: function () {
    //       // fail
    //       console.log("获取失败！")
    //     },
    //     complete: function () {
    //       // complete
    //       console.log("获取用户信息完成！")
    //     }
    //   })
    // } else {

    // }
    // 登录
    var _that = this;

    wx.login({
      success: loginres => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(loginres);

       if(loginres.code) {
          var _that = this;
          wx.getUserInfo({ 
            withCredentials: true,  
            success: function (res_user) { 
              console.log(res_user);
              //调用request请求api转换登录凭证  
                wx.request({  
                  url: _that.serviceurl + '/api/wx/decodeUser/'+loginres.code,  
                  header: {  
                      'content-type': 'application/x-www-form-urlencoded'  
                  },
                  method: "POST", 
                  data: { 
                    "encryptedData": res_user.encryptedData, 
                    "iv": res_user.iv
                  }, 
                  success: function(res) {  
                    //获取openid  
                    console.log(res)
                    if(res.data && res.data.data) {
                      console.log(res.data.data); 
                      //_that.globalData.uid = res.data.openid;
                      _that.uid = res.data.data.username;
                      wx.setStorageSync('appuid', res.data.data.username);
                      wx.setStorageSync('openId', res.data.data.openId);
                    }
                  }  
                })    
            }
          })
       }
       
        
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },fail: function () {
              // wx.showModal({
              //   title: '警告',
              //   content: '您点击了拒绝授权，将无法正常使用。请再次点击授权，或者删除小程序重新进入。',
              //   success: function (res) {
              //     if (res.confirm) {
              //       console.log('用户点击确定');
              //     }
              //   }
              // })
            }
          })
        } else {
          wx.showModal({
            title: '警告',
            content: '点击授权之后您可以正常使用小程序的全部功能。',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                wx.openSetting({  
                  success: (res) => {  
                    if (res.authSetting['scope.userInfo']) {
                      // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                      wx.getUserInfo({
                        success: res => {
                          // 可以将 res 发送给后台解码出 unionId
                          this.globalData.userInfo = res.userInfo
            
                          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                          // 所以此处加入 callback 以防止这种情况
                          if (this.userInfoReadyCallback) {
                            this.userInfoReadyCallback(res)
                          }
                        },fail: function () {
                          wx.showModal({
                            title: '警告',
                            content: '您点击了拒绝授权，将无法正常使用。请再次点击授权，或者删除小程序重新进入。',
                            success: function (res) {
                              if (res.confirm) {
                                console.log('用户点击确定....')
                              }
                            }
                          })
                        }
                      })
                    } 
                  }
                })
              }
            }
          })
        }
      }
    })

    this.sendMessage();
  },
  onShow: function () {
    console.log("App生命周期函数——onShow函数");
    var ver = -1;
    try {
      var res = wx.getSystemInfoSync()
      console.log(res.model)
      console.log(res.pixelRatio)
      console.log(res.windowWidth)
      console.log(res.windowHeight)
      console.log(res.language)
      console.log(res.version)
      console.log(res.platform)
      console.log(res.SDKVersion)

      ver = compareVersion(res.SDKVersion, '1.9.90');
    } catch (e) {
      // Do something when catch error
    }

    
    console.log("ver:" + ver);
    if(ver < 0) {
      console.log('当前微信版本过低，无法正常使用该功能，请升级到最新微信版本后重试。');
      wx.showModal({  
        title: '提示', 
        showCancel: false,
        content:'当前微信版本过低，无法正常使用该功能，请升级到最新微信版本后重试。',
        success: function(res) { 
          if (res.confirm) { 
            
          }
        }
      })  
    } else {
      /**
       * 微信强制更新版本机制
       */
      const updateManager = wx.getUpdateManager();
      // 请求完新版本信息的回调
      updateManager.onCheckForUpdate(function (res) {
        let version = res.hasUpdate?'有新版本待更新':'最新版本';
        console.log(version);
      })
      //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        });
      })
      // 新的版本下载失败
      updateManager.onUpdateFailed(function () {
        wx.showModal({
          title: '新的版本下载失败,请重新安装小程序',
          icon: 'success',
          duration: 2000
        });
      })
    }
    
  },
  onHide: function () {
    console.log("App生命周期函数——onHide函数");
  },
  onError: function (msg) {
    console.log("App生命周期函数——onError函数");
  },
  sendMessage: function() {
    var that = this;
    setInterval(function () {  
      //循环执行代码  
      var _socketOpen = wx.getStorageSync('socketOpen');
      var _txid = wx.getStorageSync('wstxid');
      console.log("_socketOpen:" + _socketOpen + ",wstxid:" + _txid);
      if(!_socketOpen) {
        that.initWebSocket();
      } else {
        if(_txid) {
          wx.getLocation({
            //type: 'wgs84',
            type: 'gcj02',
            success: function(res) {
              var latitude = res.latitude
              var longitude = res.longitude
              var speed = res.speed
              var t = new Date().getTime();
              var msg = '{"t":'+t+',"y":'+latitude+',"x":'+longitude+',"s":'+speed+',"a":'+_txid+'}';
              //console.log(msg)
              wx.sendSocketMessage({ 
                data: msg,
                fail: function(err) {
                  console.log(err);
                }
               }) 
              
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
        } else {
          console.log("没有需要监控的交易:" + _txid);
        }
      }
      
      
    }, 10000) //循环时间 这里是10秒   
  },
  initWebSocket: function() {
    var that = this;
    wx.connectSocket({
      url: that.wsserver
    })
    wx.onSocketError(function (res) { 
      console.log('WebSocket连接打开失败，请检查！') 
      wx.setStorageSync('socketOpen', false)
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      wx.setStorageSync('socketOpen', true)
    })
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
      wx.setStorageSync('socketOpen', false)
    })
  },
  setCity: function () {
    var p = {

    }
    wx.request({
      url: this.serviceurl + "/api/province/cities",
      data: p,
      success: function (res) {
        wx.setStorage({
          key: 'chooseCity',
          data: res.data
        })
      }
    })
  },
  setCartype: function () {
    var p = {

    }
    wx.request({
      url: this.serviceurl + "/api/cartype",
      data: p,

      success: function (res) {
        var a = [{
          name: '选择类型',
          id: ''
        }];
        a = a.concat(res.data);
        wx.setStorage({
          key: 'chooseCartype',
          data: a
        })
      }
    })
  },
  setCarLength: function () {
    var p = {

    }
    wx.request({
      url: this.serviceurl + "/api/carlength",
      data: p,

      success: function (res) {
        var a = [{
          name: '选择长度',
          id: ''
        }];
        a = a.concat(res.data);
        wx.setStorage({
          key: 'chooseCarLength',
          data: a
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    uid:''
  }
})

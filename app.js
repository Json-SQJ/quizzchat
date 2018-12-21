//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    var that = this;
    var userInfo = wx.getStorageSync('userInfo') || {};
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.getUserInfo({
            success: function (res) {
              var objz = {};
              objz.avatarUrl = res.userInfo.avatarUrl;
              objz.nickName = res.userInfo.nickName;
              wx.setStorageSync('userInfo', objz);
              //this.globalData.userInfo = res.userInfo
            },
            fail:function(res){
              
            }
          });
          var d = that.globalData;
          var l = d.url+'/wx/common/getwxopenid?code='+res.code;
          wx.request({
            url: l,
            data: {},
            method: 'GET',
            success: function (res) {
              var openid = JSON.parse(res.data.data).openid;
              wx.setStorageSync('openid', openid);
              this.globalData.openId=openid;
            }.bind(this)
          });
          
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
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
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openId: null,
    url:"https://www.crenative.cn/quizz"
    // url:"http://127.0.0.1:8080"
  }
})
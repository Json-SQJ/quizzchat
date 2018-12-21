//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pin: ""
  },
  onLoad: function () {

  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  backToIndex: function () {
    wx.navigateTo({
      url: '../index/index'
    })
  },
  scan: function () {
    wx.scanCode({
      success: (res) => {
        //获取考试题目
        console.log(res.result)
        this.getTestQuestions(res.result);
      }
    })
  },
  getTestQuestions: function (code) {
    wx.request({
      url: app.globalData.url + '/wx/common/getTestByPin?pin=' + code,
      data: {},
      success: function (res) {
        if (res.data.code == 200) {
          console.log(res.data.data)
          wx.setStorageSync('test', res.data.data);
          wx.request({
            url:app.globalData.url + '/wx/common/getQuestionsByTestId?pin=' + code,
            data:{},
            success:function(res){
              console.log(res.data.data);
              wx.setStorageSync('questions', res.data.data);
              wx.navigateTo({
                url: "../start/start"
              })
            }
          })
        }
      }
    });
  },
  setPin: function (e) {
    this.setData({
      pin: e.detail.value
    })
  },
  start: function () {
    var that = this;
    console.log("开始答题");
    wx.request({
      url: app.globalData.url + '/wx/common/getTests?openid='+app.globalData.openId,
      success: function (res) {
        if (res.data.code != 200) {
          wx.showModal({
            title: '提示',
            content: '请勿重复答题',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url:'../index/index'
                })
              } else {
                console.log('用户点击取消')
              }
            }
          })
        }else{
          if (that.data.pin != "") {
            that.getTestQuestions(that.data.pin);
          }
        }
      }
    });
  },
  answered:function(){
    wx.navigateTo({
      url: '../testList/testList'
    })
  }
})

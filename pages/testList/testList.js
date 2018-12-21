//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    problemTitle:'',
    problemAnswer:'',
    answer:'',
    index:1,
    correct:true,
    array: [],
    indexPicker:0,
  },
  onLoad: function (e) {
    var that = this
    wx.request({
      url: app.globalData.url + '/wx/common/getTests?openid='+app.globalData.openId,
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            array: res.data.data
          })
        }
      }
    });
  },
  bindPickerChange(){

  },
  showAnswer(e){
    var id =  e.currentTarget.dataset.click;
    wx.request({
      url: app.globalData.url + '/wx/common/getStudentAnswer?openid='+app.globalData.openId+"&id="+id,
      success: function (res) {
        if (res.data.code == 200) {
          console.log(res.data.data)
          wx.setStorageSync('answer', res.data.data.answer);
          wx.setStorageSync('questions', res.data.data.questions);
          wx.setStorageSync('test', res.data.data.test);
          wx.navigateTo({
            url:'../analysis/analysis'
          })
        }
      }
    });
  },
  backToIndex(){
    wx.navigateTo({
      url:'../index/index'
    })
  }
})

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    timeS: "",
    timeM: "",
    testName: "",
    testId:"",
    questionName: "",
    time: "",
    questions: [],
    answers: [],
    answerArr: [],
    flag: 0,
    select: null,
    questionIndex: 0
  },
  onLoad: function () {
    var test = wx.getStorageSync("test");
    var questions = wx.getStorageSync("questions");
    var question = questions[0];
    console.log(questions);
    this.setData({
      testName: test.quizzName,
      testId:test.id,
      questions: questions,
      timeM: test.quizzTime,
      questionName: question.questionName,
      answers: question.answerSet
    })
    this.countDown();
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  countDown: function () {
    let that = this;
    let countDownNum = that.data.timeM;
    if (countDownNum != "" && countDownNum != 0 && countDownNum !=null) {
      var t = 60;
      that.setData({
        timer: setInterval(function () {
          t--;
          if (t == 0) {
            countDownNum--
            t = 60
          }
          that.setData({
            time: countDownNum + "分" + t + "秒"
          })
          if (countDownNum == 0) {
            clearInterval(that.data.timer);
            //关闭定时器之后，可作其他处理codes go here
          }
        }, 1000)
      })
    }
  },
  chooseAnswer: function (e) {
    if (this.data.flag == 1) {
      var arr = this.data.answerArr;
      arr.pop()
      this.setData({
        answerArr: arr
      })
    }
    var choose = e.currentTarget.dataset.click;
    var chooseAnswer = this.data.answers[choose];
    if (chooseAnswer.isCorrect == 1) {
      this.setData({
        answerArr: this.data.answerArr.concat([1]),
        flag: 1,
        select: choose,
      });
    } else {
      this.setData({
        answerArr: this.data.answerArr.concat([0]),
        flag: 1,
        select: choose,
      });
    }
  },
  next: function (e) {
    if (this.data.flag == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择答案',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }

        }
      })
      return;
    }
    var l = this.data.questions.length;
    var index = this.data.questionIndex;
    index++;
    this.setData({
      questionIndex: index
    })
    if (index >= l) {
      wx.request({
        url: app.globalData.url + "/wx/common/saveScore",
        data: {
          answerArr:this.data.answerArr,
          openid:wx.getStorageSync("openid"),
          testId:this.data.testId
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'post',
        success: function (res) {
          wx.showModal({
            title: '提示',
            content: '答题结束',
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
        }
      });
    } else {
      var question = this.data.questions[index];
      console.log("第" + index + "题")
      this.setData({
        questionName: question.questionName,
        answers: question.answerSet,
        select: null,
        flag: 0
      })
    }
  }
})

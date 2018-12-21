//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    problemTitle: '',
    problemAnswer: '',
    answer: '',
    index: 1,
    correct: false,
    array: [],
    indexPicker: null,
    testName:'',
    questionTitle:'',
    answer:''
  },
  onLoad: function () {
    var that = this;
    var answerStudent = wx.getStorageSync('answer');
    var questions = wx.getStorageSync('questions');
    var test = wx.getStorageSync('test');
    var arrayQuestion = [];
    for(var i =0;i<answerStudent.length;i++){
      arrayQuestion.push((i+1));
    }
    var answerSets = questions[0].answerSet;
    for(var j=0;j<answerSets.length;j++){    
      if(answerSets[j].isCorrect==1){      
        that.setData({
          answer:answerSets[j].selecion+":"+answerSets[j].selectionContent
        })
      }
    }
    var correct = answerStudent[this.data.index-1].isCorrect;
    if(correct===1){
      this.setData({
        correct:true
      })
    }else{
      this.setData({
        correct:false
      })
    }
    that.setData({
      array: that.data.array.concat(arrayQuestion),
      testName:test.quizzName,
      questionTitle:questions[0].questionName,
      analysisAnswer:questions[0].analysis
    })
  },
  bindPickerChange(e) {
    var that = this;
    var answerStudent = wx.getStorageSync('answer');
    var questions = wx.getStorageSync('questions');
    var answerSets = questions[this.data.index-1].answerSet;
    for(var j=0;j<answerSets.length;j++){    
      if(answerSets[j].isCorrect==1){      
        that.setData({
          answer:answerSets[j].selecion+":"+answerSets[j].selectionContent
        })
      }
    }
    var correct = answerStudent[this.data.index-1].isCorrect;
    console.log(answerStudent[this.data.index-1])
    if(correct===1){
      this.setData({
        correct:true
      })
    }else{
      this.setData({
        correct:false
      })
    }
    that.setData({
      questionTitle:questions[this.data.index-1].questionName,
      analysisAnswer:questions[this.data.index-1].analysis,
      index:Number(e.detail.value)+1
    })
  },
  backToIndex() {
    wx.navigateTo({
      url: '../index/index'
    })
  }
})
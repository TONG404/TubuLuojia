// pages/clockIn/clockIn.js
const app = getApp()
var qrcode = require('../../CreatQRCode.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    team: {},
    result:"",
    bonus:0,
    category:0,
    isWorker:0
  },
  BonusInput:function(e){
    var a=parseFloat(e.detail.value)
    var b=0
    if(a<0){
      a=-a
      while(a>=1){
        a--;
        b++;
      }
    var c=b*60+a*100
    this.data.bonus= -c
    }
    else{
      while(a>=1){
        a--;
        b++;
      }
      this.data.bonus=b*60+a*100
    }
    console.log("输入的奖励时间"+this.data.bonus)
    console.log(typeof this.data.bonus)
  },

  clock: function () {
    var that = this
    if (this.data.isWorker) {
      wx.scanCode({
        success: (res) => {
          app.globalData.result=res.result
          console.log("扫码内容3"+res.result)
          wx.request({
            url: 'https://luojia.akakii.cn/api/scan',
            method:"POST",
            data:{
              key:res.result,
              open_id:app.globalData.openid,
              bonus:that.data.bonus
            },
            header:{
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(a){
              console.log("扫码结果")
              console.log(a)
              if(a.data.status==0){
                setTimeout(function () {
                  wx.showToast({
                    title: '打卡成功！',
                    icon: 'success',
                  })
                }, 3000) //延迟时间
              }
              else if(a.data.status==-2){
                setTimeout(function () {
                  wx.showToast({
                    title: '请重新登录!',
                    image:'../../images/error.png'
                  })
                }, 3000) //延迟时间
              }
              else if(a.data.status==-202){
                setTimeout(function () {
                  wx.showToast({
                    title: '打卡次序有误!',
                    image:'../../images/error.png'
                  })
                }, 3000) //延迟时间

              }
              else if(a.data.status==-100){
                setTimeout(function () {
                  wx.showToast({
                    title: '参数错误!',
                    image:'../../images/error.png'
                  })
                }, 3000) //延迟时间

              }
              else if(a.data.status==-200){
                setTimeout(function () {
                  wx.showToast({
                    title: '用户未组队!',
                    image:'../../images/error.png'
                  })
                }, 3000) //延迟时间

              }
              else if(a.data.status==-201){
                setTimeout(function () {
                  wx.showToast({
                    title: '打卡重复或遗漏!',
                    image:'../../images/error.png'
                  })
                }, 3000) //延迟时间

              }
              else{
                setTimeout(function () {
                  wx.showToast({
                    title: '未知错误!',
                    image:'../../images/error.png'
                  })
                }, 3000) //延迟时间
              }
            }
          })
        }
      })
     
    } else {
      wx.request({
        url: 'https://luojia.akakii.cn/api/identity',
        method: 'GET',
        data: {
          open_id: app.globalData.openid
        },
        header: {
          'content-type': 'application/json' // GET默认值 
        },
        success(res) {
          console.log(res)
          qrcode({
            width: 200,
            height: 200,
            canvasId: 'myQRCode',
            text: res.data.data.token,
            callback: function () {}
          })
        },
        fail(a) {
          wx.showToast({
            title: '连接失败!',
            image: '../../images/error.png'
          })
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    this.setData({
      team: app.globalData.team,
    })
    if(this.data.team.checkPoint_id != 0 && this.data.team.checkPoint_id != null)
    {
      that.setData({
        isWorker:1,
      })
      if(app.globalData.team.check_point.category==5||app.globalData.team.check_point.category==3)
      {
        that.setData({
          category:1
        })
      }
    }
    console.log(this.data.team)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
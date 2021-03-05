// pages/user/user.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userID: "",
    profile: {},
    team: {},
    teammates: [],
    state: "",
    checkpoint_log:[],
    checkpoint_id:[],
    checkpoint:[]
  },
  refresh:function(){
    var that=this
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    },3000)
    wx.request({
      url: 'https://luojia.akakii.cn/api/me',
      method: 'GET',
      data: {
        open_id: app.globalData .openid
      },
      header: {
        'content-type': 'application/json' // GET默认值 
      },
      success(res) {
        console.log("登录状态")
        console.log(res)
        console.log(res.data.status)
        app.globalData.profile=res.data.data.profile
        app.globalData.team=res.data.data.team
        app.globalData.teammates=res.data.data.teammates
        app.globalData.checkpoint_log=res.data.data.checkpoint_log
        if(app.globalData.team.status==0){
          that.setData({
            state:"未开始",
          })
        }
        else if(app.globalData.team.status==1){
          that.setData({
            state:"计时中"
          })
        }
        else if(app.globalData.team.status==2){
          that.setData({
            state:"暂停"
          })
        }
        else if(app.globalData.team.status==3){
          that.setData({
            state:"结束"
          })
        }
        else if(app.globalData.team.status==4){
          that.setData({
            state:"游戏中"
          })
        }
        else {
          that.setData({
            state:"   "
          })
        }
      }
    })
    this.onLoad()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    console.log("打卡地点输出")
    console.log(app.globalData.checkpoint_log)

    for (let i of app.globalData.checkpoint_log) {
      let t = new Date(i.created_at);
      let h = t.getHours()
      let n = t.getMinutes()
      let s = t.getSeconds()
      i.created_at = `${h}:${n}:${s}`

      console.log(i);
    }

    this.setData({
      userInfo: app.globalData.userInfo,
      profile: app.globalData.profile,
      team: app.globalData.team,
      teammates: app.globalData.teammates,
      checkpoint_log:app.globalData.checkpoint_log
    })
    console.log(app.globalData.profile)
    console.log(this.data.teammates[1])
    console.log(app.globalData.teammates)
    
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
    var that=this
    wx.request({
      url: 'https://luojia.akakii.cn/api/me',
      method: 'GET',
      data: {
        open_id: app.globalData .openid
      },
      header: {
        'content-type': 'application/json' // GET默认值 
      },
      success(res) {
        console.log("登录状态")
        console.log(res)
        console.log(res.data.status)
        app.globalData.profile=res.data.data.profile
        app.globalData.team=res.data.data.team
        app.globalData.teammates=res.data.data.teammates
        app.globalData.checkpoint_log=res.data.data.checkpoint_log
        if(app.globalData.team.status==0){
          that.setData({
            state:"未开始",
          })
        }
        else if(app.globalData.team.status==1){
          that.setData({
            state:"计时中"
          })
        }
        else if(app.globalData.team.status==2){
          that.setData({
            state:"暂停"
          })
        }
        else if(app.globalData.team.status==3){
          that.setData({
            state:"结束"
          })
        }
        else if(app.globalData.team.status==4){
          that.setData({
            state:"游戏中"
          })
        }
        else {
          that.setData({
            state:"   "
          })
        }
      }
    })
    this.onLoad()
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
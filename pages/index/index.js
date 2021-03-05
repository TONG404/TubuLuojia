//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userID:"",
    userPassword:"",
    openid:""
  },

  //事件处理函数
  userIDInput: function(e){
    app.globalData.userID=e.detail.value
    console.log("输入的账号"+app.globalData.userID)
    console.log(typeof app.globalData.userID)
  },
  userPasswordInput: function(e){
    this.data.userPassword=e.detail.value
    console.log("输入的密码"+this.data.userPassword)
  },

  signIn:function(){
    var that=this
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    },3000)
    wx.request({
      url: 'https://luojia.akakii.cn/api/login',
      method: 'POST',
      header: {
        //'content-type': 'application/json' // GET默认值 
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        open_id: app.globalData.openid,
        student_id: app.globalData.userID,
        password: this.data.userPassword
      },
      success(res) {
        console.log(res)
        if (res.data.status==0) {
          app.globalData.team=res.data.data.team
          app.globalData.teammates=res.data.data.teammates
          app.globalData.checkpoint_log=res.data.data.checkpoint_log
          app.globalData.profile=res.data.data.profile
          wx.showToast({
            title: '登录成功！',
            icon: 'success',
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../user/user',
            })
           }, 3000) //延迟时间
        }
        else if(res.data.status==-2){
          setTimeout(function () {
            wx.showToast({
              title:'密码或账户错误',
              image:'../../images/error.png'
            })
          }, 3000) //延迟时间
        }
        else if(res.data.status==-100){
          setTimeout(function () {
            wx.showToast({
              title:'参数错误!',
              image:'../../images/error.png'
            })
          }, 3000) //延迟时间
        }
        else{
          setTimeout(function () {
            wx.showToast({
              title:'未知错误',
              image:'../../images/error.png'
            })
          }, 3000) //延迟时间
        }
      },
      fail(res) {
        setTimeout(function () {
          wx.showToast({
            title: '连接失败!',
            image:'../../images/error.png'
          })
        }, 3000) //延迟时间

      }
    })
  },
  
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log("用户信息")
          console.log(res)
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.login({
      success (res) {
        if (res.code) {
          console.log(res)
          console.log("code: "+res.code)
          //发起网络请求
          wx.request({
            url: 'https://luojia.akakii.cn/api/wechat_login',
            method: 'GET',
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/json' // GET默认值 
            },
            success(res){
              console.log("openid: "+res.data.data.openid)
              app.globalData.openid=res.data.data.openid
              wx.request({
                url: 'https://luojia.akakii.cn/api/me',
                method:'GET',
                data:{
                  open_id:res.data.data.openid
                },
                header:{
                  'content-type': 'application/json' // GET默认值 
                },
                success(res){
                  console.log("登录状态")
                  console.log(res)
                  console.log(res.data.status)
                  if(res.data.status==0 && app.globalData.userInfo){
                    app.globalData.profile=res.data.data.profile
                    app.globalData.team=res.data.data.team
                    app.globalData.teammates=res.data.data.teammates
                    app.globalData.checkpoint_log=res.data.data.checkpoint_log
                    wx.switchTab({
                      url: '../user/user',
                    })
                  }
                }
              })
            },
            fail(a) {
              wx.showToast({
                title: '连接失败!',
                image:'../../images/error.png'
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})

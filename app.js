//app.js
App({
  onLaunch: function () {

    //云开发环境初始化
    wx.cloud.init({
      env:"base-0g78at3sf25eebc6",
      traceUser: true,
    })
    
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
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

  //全局变量
  globalData: {
    userInfo: null,
    time: null,
    total_discharge: 0,
    discharge_data: [0,0,0,0,0], //办公学习 居家寝室 交通 衣物 饮食
    reduce_date: [0,0,0,0,0],

    week_discharge: [0,0,0,0,0,0,0],
    week_reduce: [0,0,0,0,0,0,0],

    bangong_record: [],
    jujia_record: [],
    jiaotong_record: [],
    yiwu_record: [],
    yingshi_record: [],

    temp1:[]
  }
})
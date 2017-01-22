var app = getApp();
var requestUrl = app.globalData.requestUrl;//请求地址，由app.js初始化

Page({
  data: {
    orderList: [],
    orderdet: [],//待支付商品信息
    selected1: true,
    selected2: false,
    selected3: false,
    loginTitle: '请登录'
  },
  onShow: function () {

    // 判断是否登录

    if (app.globalData.userInfo.expires_in != -1) {
      this.setData({
        loginTitle: '',
        selected1: true,
    selected2: false,
    selected3: false,
      })
      this.getAllOredrs();
    }

  },
  login: function () {

    wx.navigateTo({
      url: '../login/login?id=3'
    })

  },
  getAllOredrs: function (e) {
    var that = this;
    wx.request({
      url: requestUrl + 'v1/order/search',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.userInfo.access_token
      },
      success: function (res) {
        if (res.data.success) {
          that.setData({
            orderList: res.data.data.list
          })
        }
      },
      fail: function () {
        console.log('error');
      }
    })
  },


  selected1: function (e) {

    var that = this
    //全部订单
    this.setData({
      selected1: true,
      selected2: false,
      selected3: false,
    })
    if (app.globalData.userInfo.expires_in >= 1) {
      this.setData({

        loginTitle: ''
      })
    }
    wx.request({
      url: requestUrl + 'v1/order/search',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.userInfo.access_token
      },
      success: function (res) {
        if (res.data.success) {
          that.setData({
            orderList: res.data.data.list
          })
        }
      },
      fail: function () {
        console.log('error');
      }
    })

  },
  selected2: function (e) {
    var that = this
    // 待支付订单
    this.setData({
      selected1: false,
      selected2: true,
      selected3: false,
    })
    if (app.globalData.userInfo.expires_in >= 1) {
      this.setData({

        loginTitle: ''
      })
    }
    wx.request({
      url: requestUrl + 'v1/order/search',
      data: {
        status: 1
      },

      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.userInfo.access_token
      },
      success: function (res) {

        if (res.data.success) {
          that.setData({
            orderList: res.data.data.list
          })
        }
      },
      fail: function () {
        console.log('error');
      }
    })


  },

  selected3: function (e) {

    var that = this
    // 已支付订单
    this.setData({
      selected1: false,
      selected2: false,
      selected3: true,
    })
    if (app.globalData.userInfo.expires_in >= 1) {
      this.setData({

        loginTitle: ''
      })
    }
    wx.request({
      url: requestUrl + 'v1/order/search',
      data: {
        status: 2
      },

      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.userInfo.access_token
      },
      success: function (res) {
        if (res.data.success) {
          that.setData({
            orderList: res.data.data.list
          })
        }
      },
      fail: function () {
        console.log('error');
      }
    })



  },

  // 待支付订单去支付
  toPay: function (e) {
    var id = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '../pay/pay?id=' + id
    })
  },


})

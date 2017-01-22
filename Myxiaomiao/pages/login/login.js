//获取应用实例
var app = getApp();
var appId = app.globalData.appId;
var requestUrl=app.globalData.requestUrl;//请求地址，由app.js初始化
var loginId = 1;
Page({
  data: {
    username: '',
    password: '',
    alertHidden: true,
  },
  onLoad: function (option) {
    loginId = option.id
  },
  //手机号
  bindTelInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },

  //密码
  bindPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  //下一步
  toNext: function () {
    var that = this;
    if (this.data.username == '') {
      that.setData({
        alertHidden: false,
        alertTitle: '手机号不能为空'
      });
      return;
    } else if (!(/^1[34578]\d{9}$/.test(this.data.username))) {
      that.setData({
        alertHidden: false,
        alertTitle: '手机号格式不正确'
      });
      return;
    }

    //密码
    if (this.data.password == '') {
      that.setData({
        alertHidden: false,
        alertTitle: '密码不能为空'
      });
      return;
    } else if (this.data.password.length < 6) {
      that.setData({
        alertHidden: false,
        alertTitle: '密码至少6位'
      });
      return;
    }

    // 提交数据打包成json
    var record = {
      'username': this.data.username,
      'password': this.data.password,
      'grant_type': 'password',
      'appId': appId

    }
    wx.request({
      url: requestUrl+'common/user/login',
      data: record,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data)
        if (res.data.success) {

          app.globalData.userInfo = {
            access_token: res.data.data.token.access_token,
            expires_in: res.data.data.token.expires_in,
            token_type: res.data.data.token.token_type
          }

          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1000
          })

          if (loginId == 1) {

            wx.navigateBack();

          } else if (loginId == 2) {
            wx.switchTab({
              url: '../cart/cart'
            })
          } else if (loginId == 3) {
            wx.switchTab({
              url: '../myindex/myindex'
            })
          }

        }
      },
      fail: function () {
        console.log('网络请求出错!');
      }
    })
  },

  // 关闭表单验证对话框
  hideAlertView: function () {
    this.setData({
      alertHidden: true
    })
  }

})




// addressadd.js
//添加联系地址
//获取应用实例
var app = getApp()
var requestUrl=app.globalData.requestUrl;//请求地址，由app.js初始化

Page({
  data: {
    name: '',//收货人  
    phone: '',//联系电话
     //
    address: '',//地区信息
    postcode: '',//邮政编码
    addressdet: '',  //详细地址
    modalHidden: true,    //成功对话框
    alertHidden: true,
    alertHidden: '添加成功',
    date: ''
  },
  //收货人
  bindNameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
    // console.log(e.detail.value)
  },
  // 联系电话
  bindPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
    // console.log(e.detail.value)
  },

  // 选择地区
  bindAddressInput: function (e) {
    this.setData({
      address: e.detail.value
    })
    // console.log(e.detail.value)
  },


  // 详情地址
  bindAddressdetInput: function (e) {
    this.setData({
      addressdet: e.detail.value
    })
    // console.log(e.detail.value)
  },


  // 邮政编码
  bindPostcodeInput: function (e) {
    this.setData({
      postcode: e.detail.value
    })
  },

  //新增收货地址--确认
  save: function () {
    // 收货人
    var that = this
    if (this.data.name == '') {
      //提示框
      that.setData({
        alertHidden: false,
        alertTitle: '收货人不能为空'
      });

      return
    }
    // 联系电话
    var re = /^1[34578]\d{9}$/;
    if (this.data.phone == '') {
      //提示框
      that.setData({
        alertHidden: false,
        alertTitle: '手机号不能为空'
      });
      return;
    } else if (!re.test(this.data.phone)) {
      //提示框
      that.setData({
        alertHidden: false,
        alertTitle: '手机号格式不正确'
      });
      return;
    }

    //选择地区
    if (this.data.address == '') {
      //提示框
      that.setData({
        alertHidden: false,
        alertTitle: '详情地址不能为空'
      });

      return;
    }

    //详情地址
    if (this.data.addressdet == '') {
      //提示框
      that.setData({
        alertHidden: false,
        alertTitle: '详情地址不能为空'
      });

      return;
    }

    //邮政编码
    if (this.data.postcode == '') {
      //提示框
      that.setData({
        alertHidden: false,
        alertTitle: '邮政编码不能为空'
      });

      return
    }

    // 本条数据打包成json
    var adddata = {
      'name': this.data.name,
      'mobile': this.data.phone,
      'address': this.data.address,
      'detailed_address': this.data.addressdet,
      'zipcode': this.data.postcode
    }

    wx.request({
      url: requestUrl+'v1/address/save',
      data: adddata,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.userInfo.access_token
      },
      success: function (res) {
        if (res.data.success) {
          that.setData({
            modalHidden: false
          });

        }
      },
      fail: function () {
        console.log('网络请求出错!');
      }
    })

  },


  // 关闭添加成功对话框
  hideModal: function () {
    this.setData({
      'modalHidden': true
    })
    // 返回收货信息列表页面
    wx.navigateTo({
      url: '../address/address'
    })
  },
  // 关闭表单验证对话框
  hideAlertView: function () {
    this.setData({
      'alertHidden': true
    })
  },

})
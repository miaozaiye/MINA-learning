//获取应用实例
var app = getApp();
var requestUrl=app.globalData.requestUrl;//请求地址，由app.js初始化

Page({
  data: {
    orderData: null,//订单数据
    selectedaddress: {},//收获地址信息
    selectedcart: {}//商品信息
  },
  onLoad: function (options) {
    var that = this;
    // 读取缓存的收货地址信息
    wx.getStorage({
      key: 'address',
      success: function (res) {
        that.setData({
          selectedaddress: res.data
        });
      },
      fail: function () { }
    });

    // 读取缓存的购物车选择商品信息
    wx.getStorage({

      key: 'cart',
      success: function (res) {
        that.setData({
          selectedcart: res.data

        });
      },
      fail: function () { }
    })
  },
  //新增收货地址
  toAddress: function () {
    wx.navigateTo({
      url: '../address/address'
    })
  },


  // 生成订单
  toPay: function () {
    var orderdata = this.data.selectedcart;
    var orderaddress = this.data.selectedaddress;
   
   // 生成订单数据
    var orderData = {
      goods_id: orderdata.goods_id,//商品ID
      goods_spec_id: orderdata.goods_spec_id,//订单型号ID
      number: orderdata.buynumber,//订单数量
      real_price: orderdata.real_price,//订单总价
      price: orderdata.price,//商品单价
      address_id: orderaddress.address_id//地址ID
    }

    wx.request({
      url: requestUrl+'v1/order/create',
      data: orderData,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.userInfo.access_token
      },
      success: function (res) {
        var id = res.data.data.id;
        if (res.data.success) {
          //下单成功--删除该购物车信息
          wx.request({
            url: requestUrl+'v1/carts/del',
            method: "POST",
            data: {
              id: orderdata.id
            },
            header: {
              'Authorization': 'Bearer ' + app.globalData.userInfo.access_token
            },
          })
          //下单成功--跳转到支付页面
          wx.redirectTo({
            url: '../pay/pay?id=' + id
          })
        } else {
          wx.showToast({
            title: res.data.data.message,
            icon: 'loading',
            duration: 1000
          })
        }
      },
      fail: function () {
        console.log('网络请求出错!');
      }
    })

  }



})
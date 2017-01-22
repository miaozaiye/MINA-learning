//获取应用实例
var app = getApp();
var requestUrl=app.globalData.requestUrl;//请求地址，由app.js初始化

Page({
  data: {
    detList: [],
    colorSelected: [],
    modelSelected: [],
    spec_id: 0,
    spec_id2: 0,
    model1: '',
    model2: '',
    num: 1,
    minusStatus: 'disabled'
  },
  // 数据加载
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    console.log('option id is:',id);
    wx.request({
      url: requestUrl+'v1/goods/view?id=' + id,
      method: "GET",
     
      success: function (res) {
        var colorSelected = that.data.colorSelected;
        var modelSelected = that.data.modelSelected;
        var spec_id = that.data.spec_id;
        var spec_id2 = that.data.spec_id2;
        var model1 = that.data.model1;
        var model2 = that.data.model2;

        spec_id = res.data.data.spec[1][0].id;
        model1 = res.data.data.spec[1][0].name;
        console.log('get id :',spec_id);
        if (res.data.data.spec[2]) {
          spec_id2 = res.data.data.spec[2][0].id;
          model2 = res.data.data.spec[2][0].name;
          for (var i = 0, len = res.data.data.spec[2].length; i < len; i++) {
            modelSelected.push({ 'selected': false });
          }
          modelSelected[0].selected = true;
        }
        for (var i = 0, len = res.data.data.spec[1].length; i < len; i++) {
          colorSelected.push({ 'selected': false });
        }
        colorSelected[0].selected = true;
        //商品价格去掉小数点
        var data = res.data.data;
        var newprice = Number(data.price)
        data.price = newprice;

        that.setData({
          detList: res.data.data,
          colorSelected: colorSelected,
          modelSelected: modelSelected,
          spec_id: spec_id,
          spec_id2: spec_id2,
          model1: model1,
          model2: model2
        })
      },
      fail: function (res) {
        console.log('error');
      }
    })
  },
  // 商品颜色选择
  colorSelected: function (e) {
    var index = e.currentTarget.dataset.index;
    var detList = this.data.detList;
    var colorSelected = this.data.colorSelected;
    var spec_id = this.data.spec_id;
    var model1 = this.data.model1;

    for (var i = 0; i < colorSelected.length; i++) {
      colorSelected[i].selected = false;
    }
    colorSelected[index].selected = true;
    spec_id = detList.spec[1][index].id;
    model1 = detList.spec[1][index].name;

    this.setData({
      colorSelected: colorSelected,
      spec_id: spec_id,
      model1: model1
    })
  },
  // 商品类型选择
  modelSelected: function (e) {
    var index = e.currentTarget.dataset.index;
    var detList = this.data.detList;
    var modelSelected = this.data.modelSelected;
    var spec_id2 = this.data.spec_id2;
    var model2 = this.data.model2;

    for (var i = 0; i < modelSelected.length; i++) {
      modelSelected[i].selected = false;
    }
    modelSelected[index].selected = true;
    if (detList.spec[2]) {
      spec_id2 = detList.spec[2][index].id;
      model2 = detList.spec[2][index].name;
    }

    this.setData({
      modelSelected: modelSelected,
      spec_id2: spec_id2,
      model2: model2
    })
  },



  // 加入购物车
  toBuy: function () {

    // 付款总额
    var allprice = this.data.detList.price * this.data.num;
    //console.log(allprice);
    // 本条数据打包成json
    var adddata = {
      'goods_id': this.data.detList.id,
      'goods_spec_id': this.data.model1 + ',' + this.data.model2,
      'number': this.data.num,
      'real_price': allprice,
      'price': this.data.detList.price
    }
    // console.log(adddata);
    // 判断是否登录
    if (app.globalData.userInfo.expires_in == -1) {
      wx.navigateTo({
        url: '../login/login?id=1'
      })
    } else {
      wx.request({
        url:requestUrl+'v1/carts/save',
        data: adddata,
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + app.globalData.userInfo.access_token
        },
        success: function (res) {
          if (res.data.success) {
            wx.switchTab({

              url: '../cart/cart'

            })

          }
        },
        fail: function () {
          console.log('网络请求出错!');
        }
      })


    }

  },

  //商品数量加
  bindMinus: function () {
    var num = this.data.num;
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回
    this.setData({
      num: num
    });
  }
})
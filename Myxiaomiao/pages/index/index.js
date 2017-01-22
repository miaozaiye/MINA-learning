 
var app = getApp()
var appId = app.globalData.appId;//应用ID，由app.js初始化
var requestUrl=app.globalData.requestUrl;//请求地址，由app.js初始化

Page({
  data: {
    userInfo: {},//用户信息
    activityList: [],//商品数据

    // 首页轮播图
    imgUrls: [ ],
    indicatorDots: true,//是否显示面板指示点
    autoplay: true,//是否自动切换
    interval: 5000,//自动切换时间间隔
    duration: 300,//滑动动画时长
    // 图片
    array: [{
      mode: 'aspectFill',//保持纵横比缩放图片
    }]
  },
  // 监听页面加载加载
  onLoad: function () {
    var that = this;

        //请求主页banner
    wx.request({
      url: requestUrl+'v1/home/cover-list',//商品类型
      data: {
        appId:appId
      },
      
      method: "POST",
      success: function (res) {
        that.setData({
          imgUrls: res.data.data.list
        })
      },

      
      fail: function (res) {
        console.log("error");
      }
    }),
   


    //商品数据
    wx.request({
      url:requestUrl+ 'v1/goods/index',//商品列表接口
      data: {
        appId:appId,
        page_size: 15,
        page: 1
      },
      method: "GET",
      success: function (res) {
        var data = res.data.data.list;
        console.log('data is ',data);
        var i = 0;
        for (i = 0; i < data.length; i++) {
          var newprice = Number(data[i]['price'])
          data[i]['price'] = newprice;
        }
        that.setData({
          activityList: res.data.data.list
        })
        
      },
      fail: function (res) {
        console.log("error");
      }
    })

  },

 
  //商品详情页面
  toDetailview: function (e) {
    var id = e.currentTarget.dataset.id;//当前商品的的ID
    wx.navigateTo({
      url: '../goodsdet/goodsdet?id=' + id,
    })
   

  },

  //分享功能
  onShareAppMessage: function () {
    return {
      title: '哎小喵商城',
      desc: '欢迎来到哎小喵商城',
      path: '/pages/index/index'
    }
  }

})
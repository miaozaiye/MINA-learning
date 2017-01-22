//pay.js
//获取应用实例
var app = getApp();
var requestUrl=app.globalData.requestUrl;//请求地址，由app.js初始化
Page({
  data: {
    orderdet:[]
  },
  
  
  onLoad: function(options){
  	var that = this
    var url = requestUrl+"v1/order/view?id=" + options.id
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization':'Bearer ' + app.globalData.userInfo.access_token
      },
      success: function(res){
        that.setData({
          orderdet:res.data.data
        }) 

      },
      
      fail: function() {
        console.log('网络请求出错!');
      },
      
    })
        
    
  },
   pay: function(options){
     		wx.showToast({
						title: '尚未开通支付接口',
						icon: 'success',
						duration: 1000
					})
   }

})
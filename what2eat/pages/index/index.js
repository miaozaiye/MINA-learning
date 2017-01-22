//index.js
//获取应用实例
var app = getApp();
var choices=['meat','fruit','noodles','rice','mango'];
var pics=['http://www.360changshi.com/uploadfile/2016/0312/20160312102655187.jpg','http://wenku.sc115.com/uploads/allimg/131201/214G63238-0.jpg','http://img.mp.itc.cn/upload/20161212/d26b58f0c836431ba6ae781e34247fdb_th.jpeg','http://pic.zznews.cn/0/10/25/90/10259042_027093.jpg','http://iphoto.ipeen.com.tw/photo/comment/698620/827292/cgm2ad8777456fe9370411d3a9890adf3cf561.jpg'];

Page({
  
  //事件处理函数
  bindViewTap:function(){
   var choice = Math.round(Math.random()*5)
   var suggestion = choices[choice]
   var sug_img = pics[choice]
   console.log('suggestion is ',suggestion)
   this.setData({suggestion:suggestion,suggestion_img:sug_img})
  }
}
)
  // onLoad: function () {
  //   console.log('onLoad')
  //   var that = this
  //   //调用应用实例的方法获取全局数据
  //   app.getUserInfo(function(userInfo){
  //     //更新数据
  //     that.setData({
  //       userInfo:userInfo
  //     })
  //   })
  // }


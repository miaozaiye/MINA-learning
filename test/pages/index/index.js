//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    array: [1,2,3,4,5,6,7],
    array1:[{
      message:0,
      name:'zero'},
      {
        message:1,
        name:'one'}
        ]
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
inputlength:function(e){
  console.log('input event',e);
  var length = parseInt(e.detail.value);
  console.log("length is :", length);
  this.setData({length:length})



}
})

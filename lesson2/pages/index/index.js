//index.js
//获取应用实例

var calcData = {
  origin:0,
  relation:'',
  result:1,
  result2:10,
  tapCount:0
}; // set module part database


// control part

Page({
  data: calcData,
  changenumber: function(e){
    calcData.origin = parseInt(e.detail.value);
    
     if(calcData.origin < 10)
        {calcData.result = 10 - calcData.origin;
         calcData.relation = ' less than';

        }
        
     else
        {calcData.result = calcData.origin - 10;
        calcData.relation = ' greater than '
        }
        
    
    console.log('result', calcData.result);
  

  },

  calc:function(e) {
    console.log('tap event',e);
    console.log('result is',calcData.result);
    
    this.setData({result:calcData.result,origin:calcData.origin,relation:calcData.relation})
    
  
    
    // this.setData({tapCount:calcData.tapCount})
  }

}
)
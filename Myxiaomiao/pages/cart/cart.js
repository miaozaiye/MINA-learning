var app = getApp();
var requestUrl = app.globalData.requestUrl;//请求地址，由app.js初始化

Page({
	data: {
		carts: [],//购物车列表
		numberArr: [],//
		checkedArr: [],
		allChecked: true,
		count: 0,
		totalNum: 0,
		loginTitle: '请登录'
	},


	onShow: function () {
		// 判断是否登录
		if (app.globalData.userInfo.expires_in != - 1) {
			this.setData({
				loginTitle: ''
			})
			this.getCarts();
		}
	},
	//登陆
	login: function () {
		wx.navigateTo({
			url: '../login/login?id=2'
		})

	},
	//获取购物车列表
	getCarts: function () {
		var that = this;
		var numberArr = this.data.numberArr;
		var checkedArr = this.data.checkedArr;
		wx.request({
			url: requestUrl + 'v1/carts/index',
			header: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + app.globalData.userInfo.access_token
			},
			success: function (res) {

				if (res.data.success) {
					for (var i = 0, len = res.data.data.list.length; i < len; i++) {
						numberArr.push(res.data.data.list[i].number);
						checkedArr.push(false);
					}
					checkedArr[0] = true;
					that.setData({
						carts: res.data.data.list,
						numberArr: numberArr,
						checkedArr: checkedArr
					})
					that.getCount();
					that.getTotalNum();
				}
			},
			fail: function (res) {
				console.log("error");
			}
		})
	},
	//获取总价
	getCount: function () {
		var count = 0;
		var carts = this.data.carts;
		var checkedArr = this.data.checkedArr;
		for (var i = 0; i < carts.length; i++) {
			if (checkedArr[i] == true) {
				count += parseInt(carts[i].number) * parseFloat(carts[i].goods_info.price);
			}
		}
		this.setData({
			count: count
		})
	},
	//获取总数量
	getTotalNum: function () {
		var totalNum = 0;
		var carts = this.data.carts;
		var checkedArr = this.data.checkedArr;
		for (var i = 0; i < carts.length; i++) {
			if (checkedArr[i] == true) {
				totalNum += parseInt(carts[i].number);
			}
		}
		this.setData({
			totalNum: totalNum
		})
	},
	//单选
	bindCheckbox: function (e) {

		var _index = e.currentTarget.dataset.index;
		var checkedArr = this.data.checkedArr;
		for (var i = 0; i < checkedArr.length; i++) {
			checkedArr[i] = false;
		}
		checkedArr[_index] = true;

		this.setData({
			checkedArr: checkedArr
		})

		this.getCount();
		this.getTotalNum();
	},


	// //全选按钮
	// bindAllCheckbox: function () {
	// 	var checkedArr = this.data.checkedArr;
	// 	var allChecked = this.data.allChecked;
	// 	if (!allChecked) {
	// 		for (var i = 0; i < checkedArr.length; i++) {
	// 			checkedArr[i] = true;
	// 		}
	// 	} else {
	// 		for (var i = 0; i < checkedArr.length; i++) {
	// 			checkedArr[i] = false;
	// 		}
	// 	}
	// 	this.setData({
	// 		checkedArr: checkedArr,
	// 		allChecked: !allChecked
	// 	})
	// 	this.getCount();
	// 	this.getTotalNum();
	// },
	//数量减
	bindMinus: function (e) {
		var _index = e.currentTarget.dataset.index;
		var carts = this.data.carts;
		var numberArr = this.data.numberArr;
		var number = (--numberArr[_index]);
		if (number < 1) {
			numberArr[_index] = 1;
			return;
		}
		numberArr[_index] = carts[_index].number = number;
		this.setData({
			numberArr: numberArr,
			carts: carts
		})
		this.getCount();
		this.getTotalNum();
	},
	//数量加
	bindAdd: function (e) {
		var _index = e.currentTarget.dataset.index;
		var carts = this.data.carts;
		var numberArr = this.data.numberArr;
		var number = (++numberArr[_index]);
		numberArr[_index] = carts[_index].number = number;
		this.setData({
			numberArr: numberArr,
			carts: carts
		})
		this.getCount();
		this.getTotalNum();
	},
	//输入购买数量
	changeNum: function (e) {
		var _index = e.currentTarget.dataset.index;
		var carts = this.data.carts;
		var numberArr = this.data.numberArr;
		var number = carts[_index].number;
		numberArr[_index] = number = parseInt(e.detail.value);
		this.setData({
			numberArr: numberArr,
			carts: carts
		})
		this.getCount();
		this.getTotalNum();
	},

	// 购物车--删除
	toDelete: function (e) {

		var id = e.currentTarget.dataset.index;
		var that = this;
		wx.request({
			url: requestUrl + 'v1/carts/del',
			method: "POST",
			data: {
				id: id
			},
			header: {
				'Authorization': 'Bearer ' + app.globalData.userInfo.access_token
			},
			success: function (res) {
				if (res.data.success) {

					wx.showToast({
						title: '删除成功',
						icon: 'success',
						duration: 1000
					}),

						that.getCarts();
				}
			},
			fail: function () {
				console.log("error");
			}
		})
	},


	//订单确认页面
	toPay: function () {
		var that = this;
		var selectdata = "";//选择购买商品
		var carts = this.data.carts;
		var checkedArr = this.data.checkedArr;

		for (var i = 0; i < checkedArr.length; i++) {
			if (checkedArr[i] == true) {
				selectdata = carts[i]
			}
		}

		// 用户选择购买商品信息
		var cartselected = {
			id: selectdata.id,//购物车id
			title: selectdata.goods_info.title,
			logo_url: selectdata.goods_info.logo_url,
			goods_id: selectdata.goods_id,//商品id
			goods_spec_id: selectdata.goods_spec_id,
			price: selectdata.price,//单价
			real_price: selectdata.real_price,//实付价格（总价）
			buynumber: selectdata.number
		}

		var data = []
		// 用户选择购买商品信息
		wx.setStorage({
			key: 'cart',
			data: cartselected
		})

		// 跳转到订单确认页面
		wx.navigateTo({
			url: '../buy/buy',

		})

	}
})
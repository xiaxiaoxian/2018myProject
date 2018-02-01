/**
 * user.js定义用户的数据库模型
 */

let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  "userId":String,
  "userName":String,
  "userPwd":String,
  "orderList":Array,
  "cartList":[
    {
      "productId":String,
      "productName":String,
      "productImg":String,
      "productPrice":String,
      "checked":String,
      "productNum":String
    }
  ],
  "addressList":[
	  {
	  	  "addressId" : String,
		  "userName" : String,
		  "streetName" : String,
		  "postCode" : Number,
		  "tel" : Number,
		  "isDefault" : Boolean
	  }
  ]
});

module.exports = mongoose.model('User',userSchema); // 导出

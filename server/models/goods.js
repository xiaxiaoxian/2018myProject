/*goods.js定义的是商品列表的一个数据库模型*/

let  mongoose = require('mongoose');
let  Schema = mongoose.Schema;    // 定义一个表模式

let productSchema = new Schema({
	"productId": String,
	"productName": String,
	"productPrice": Number,
    "productImg": String,
    "productNum":Number,
    "checked":String
});

// commonJs的规范导出mongoose创建的商品表模型，并命名为Good;
module.exports = mongoose.model('Good',productSchema);


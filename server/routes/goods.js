let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Goods = require('../models/goods.js'); // 引入商品模型
let User = require('../models/user.js');   // 引入用户模型
// let goods = require('../routes/create.js');

// 链接mongoDB数据库
mongoose.connect('mongodb://127.0.0.1:28018/dumall');

// 成功
mongoose.connection.on('connected',function(){
  console.log('MongoDB connected success');
});

// 失败
mongoose.connection.on('error',function(){
  console.log('MongoDB connected fail');
});

// 断开
mongoose.connection.on('disconnection',function(){
  console.log('MongoDB connected disconnection');
});


/*查询商品列表数据*/
router.get("/list",function(req,res,next){          // get:通过req.param拿到浏览器的参数
  let page = parseInt(req.query.page);          // 获取分页的参数(当前第几页)
  let pageSize = parseInt(req.query.pageSize);  // 一页的数据数目
  let sort =parseInt(req.query.sort);           // 获取前端传来的排序参数
  let skip = (page-1)*pageSize;                 // 计算被忽略的条数
  let priceLevel = req.query.priceLevel;  // 获得价格的区间
  let params = {};
  let priceGt='',priceLte='';
  // console.log(req.query.page);
  // console.log(req.query.pageSize);
  // console.log(req.query.sort);
  // console.log(skip);

  if(priceLevel!='all'){
    switch (priceLevel){
      case '0' : priceGt = 0; priceLte = 100; break;
      case '1' : priceGt = 100; priceLte = 500; break;
      case '2' : priceGt = 500; priceLte = 1000; break;
      case '3' : priceGt = 1000; priceLte = 5000; break;
      case '4' : priceGt = 5000; priceLte = 10000; break;
    }
    // 对价格做区间选择
    params = {
      productPrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  // 对金额进行排序，1升序、2降序
  goodsModel.sort({'productPrice':sort}).exec(function(err,doc){   // 排序、分页、查询
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      //console.log(doc);
      res.json({
        status:'0',
        msg: '',
        result:{
          count: doc.length,
          list: doc
        }
      })
    }
  });
});


/*加入购物车*/
router.post("/addCart",function(req,res,next){
	let userId = '007';
	let productId = req.body.productId;
  User.findOne({userId:userId},function(err,userDoc){ // 拿到用户信息判断用户是否存在
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      if(userDoc){ //获取007用户一整套信息
        let goodsItem = '';
        userDoc.cartList.forEach(function(item){
          if(item.productId == productId){  // 购物车已经存在该商品
            goodsItem = item;
            goodsItem.productNum++;
          }
        });

        if(goodsItem) { // 商品存在,直接保存
          userDoc.save(function(err2,doc2){
            if(err2){
              res.json({
                status:'1',
                msg:err2.message
              })
            }else{ // 保存成功
              res.json({
                status:'0',
                msg:'',
                result:'success'
              })
            }
          })
        }else{ // 否则就是一个新的商品
          Goods.findOne({productId:productId},function(err1,doc){ // 找商品
            if(err1){
              res.json({
                status:'1',
                msg:err1.message
              })
            }else{
              if(doc){  // 获取goods表中点击选中的商品
                doc.productNum = 1;
                doc.checked = 1;
                userDoc.cartList.push(doc);
                userDoc.save(function(err2,doc2){
                  if(err2){
                    res.json({
                      status:'1',
                      msg:err2.message
                    })
                  }else{ // 保存成功
                    res.json({
                      status:'0',
                      msg:'',
                      result:'success'
                    })
                  }
                })
              }
            }
          })
        }
      }else{
        alert('没有该用户！')
      }
    }
  })
});

module.exports = router;



























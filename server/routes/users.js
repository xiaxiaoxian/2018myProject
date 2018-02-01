let express = require('express');
let router = express.Router();
let User = require('./../models/user.js'); // 引入用户模型
require('../util/util.js');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*1.登录*/
router.post('/login',function(req,res,next){
  let param = {
    userName : req.body.userName,
    userPwd : req.body.userPwd
  };

  User.findOne(param,function(err,doc){ // 查询数据库
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      if(doc){
        res.cookie("userId",doc.userId,{  // 通过cookie存储数据
          path:'/',
          maxAge:100*60*60
        });
        res.cookie("userName",doc.userName,{  // 通过cookie存储数据
          path:'/',
          maxAge:100*60*60
        });
        //req.session.user = doc;   // 通过session存储数据
        res.json({
          status:'0',
          msg:'',
          result:{
            userName:doc.userName
          }
        });
      }else{ // 用户名或密码错误
        res.json({
          status:'1',
          msg:'error login'
        });
      }
    }
  });
});


/*2.退出*/
router.post('/logout',function(req,res,next){
  res.cookie('userId','',{
    path:'/',
    maxAge:-1
  });

  res.json({
    status:"0",
    msg:'',
    result:''
  })

});


/*3.校验用户名*/
router.get('/checkLogin',function(req,res,next){
  if(req.cookies.userId){
      res.json({
        status:'0',
        msg:'',
        result:req.cookies.userName || ''
      })
  }else{
      res.json({
        status:'1',
        msg:'未登录',
        result:''
      })
  }
});


/*4.查询购物车数量*/
router.get('/getCartCount',function(req,res,next){
	if(req.cookies && req.cookies.userId){
		let userId = req.cookies.userId;
		User.findOne({userId:userId},function(err,Doc){
			if(err){
				res.json({
					status:'1',
					msg:err.message,
					result:''
				})
			}else{
				if(Doc){
					let cartList = Doc.cartList;
					console.log(cartList);
					let cartCount = 0;
					cartList.map((item)=>{
						cartCount += parseInt(item.productNum);
					});
					console.log(cartCount);
					res.json({
						status:'0',
						msg:'',
						result:cartCount
					})
				}
			}
		})
	}else{
		res.json({
			status:'1',
			result:'用户不存在'
		})
	}
});



/*5.查询当前用户的购物车数据*/
router.get('/cartList',function(req,res,next){
  let userId = req.cookies.userId;
  User.findOne({userId:userId},function(err,doc){
    if(err){
        res.json({
          status: 1,
          msg:'err.message',
          result:''
        })
      }else{
        if(doc){ // 获取购物车数据
          res.json({
            status: 0,
            msg:'',
            result:doc.cartList
          })
        }
      }
  })
});


/*6.删除购物车数据*/
router.post('/cartDel',function(req,res,next){
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  //console.log(userId);
  //console.log(productId);
  //'$pull向数组中删除指定元素'
  User.update({userId:userId},{$pull:{'cartList':{'productId':productId}}},function(err,doc){
    if(err){
      res.json({
        status:1,
        msg:err.massage,
        result:''
      })
    }else{
      res.json({
        status:0,
        msg:'',
        result:'success'
      })
    }
  })
});


/*7.保存购物车的编辑*/
router.post('/cartEdit',function(req,res,next){
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  let productNum = req.body.productNum;
  let checked = req.body.checked;

  User.update({
    "userId":userId,
    'cartList.productId':productId
  },{
    'cartList.$.productNum':productNum,
    'cartList.$.checked': checked
  },function(err,doc){
    //console.log(doc);
     if(err){
      res.json({
        status:1,
        msg:err.massage,
        result:''
      })
    }else{
      res.json({
        status:0,
        msg:'',
        result:''
      })
    }
  })
});


/*8.购物车商品的全选与单选*/
router.post('/editCheckAll',function(req,res,next){
  let userId = req.cookies.userId;
  let checkAll = req.body.checkAll ? '1':'0';
  User.findOne({userId:userId},function(err,user){
    if(err){
      res.json({
        status:1,
        msg:err.massage,
        result:''
      })
    }else{
      if(user){
        user.cartList.forEach((item)=>{
          item.checked = checkAll;
        });
        user.save(function(err1,doc){
          if(err1){
            res.json({
              status:'1',
              msg:err1.message,
              result:''
            })
          }else{
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
});


/*9.查询用户地址*/
router.get('/address',function (req,res,next) {
    let userId = req.cookies.userId;
    User.findOne({userId:userId},function(err,doc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        res.json({
          status:'0',
          msg:'',
          result:doc.addressList
        })
      }
    })
});


/*10.设置默认地址*/
router.post('/setDefault',function(req,res,next){
	let userId = req.cookies.userId;
	let addressId = req.body.addressId;
	if(!addressId){
		res.json({
			status:'1003',
			msg:'addressId is null',
			result:''
		})
	}else{
		User.findOne({userId:userId},function(err,doc){
			if(err){
				res.json({
					status:'1',
					msg:err.message,
					result:''
				})
			}else{ // 查询到
				let addressList = doc.addressList;
				addressList.forEach(function(item){
					if(item.addressId == addressId){
						item.isDefault = true;
					}else{
						item.isDefault = false;
					}
				});
				doc.save(function(err,doc1){ // 保存
					if(err){
						res.json({
							status:'1',
							msg:err.message,
							result:''
						})
					}else{
						res.json({
							status:'0',
							msg:'',
							result:''
						})
					}
				})
			}
		})
	}
});


/*11.删除地址*/
router.post('/delAdress',function(req,res,next){
	let userId = req.cookies.userId;
	let addressId = req.body.addressId;
	User.update({
		userId:userId
	},{
		$pull:{
			'addressList':{
				'addressId':addressId
			}
		}
	},function(err,doc){
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			})
		}else{
			res.json({
				status:'0',
				msg:'',
				result:''
			})
		}
	})
});


/*12.支付*/
router.post('/payMent',function(req,res,next){
	let userId = req.cookies.userId;
	let orderTotal = req.body.orderTotal;
	let addressId = req.body.addressId;
	User.findOne({userId:userId},function(err,doc){
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			})
		}else{
			// 获取当前用户的地址信息
			let address = "";
			let goodList = [];
			doc.addressList.forEach((item)=>{
				if(addressId == item.addressId){
					address = item;
				}
			});
			// 获取购物车购买的商品
			doc.cartList.filter((item)=>{
				if(item.checked == '1'){
					goodList.push(item);
				}
			});

			//生成订单号
			let platform = '622';
			let r1 = Math.floor(Math.random()*10);
			let r2 = Math.floor(Math.random()*10);
			let sysDate = new Date().Format('yyyyMMddhhmmss');
			let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
			let orderId = platform + r1 + sysDate + r2;

			let order = {
				orderId: orderId,
				orderTotal:orderTotal,
				addressInfo:address,
				goodsList:goodList,
				orderStatus:'1',
				cteateDate:createDate
			};

			doc.orderList.push(order);

			doc.save(function(err,doc1){
				if(err){
					res.json({
						status:'1',
						msg:err.message,
						result:''
					})
				}else{
					res.json({
						status:'0',
						msg:'',
						result:{
							orderId:order.orderId,
							orderTotal:order.orderTotal
						}
					})
				}
			});
		}
	})
});


/*13.订单详情*/
router.get('/orderDetail',function(req,res,next){
	let userId = req.cookies.userId;
	let orderId = req.query.orderId;
	User.findOne({userId:userId},function(err,userInfo){
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			})
		}else{
			let orderList = userInfo.orderList;
			let orderTotal = 0;
			if(orderList.length>0){
				console.log(orderList.length);
				orderList.forEach((item)=>{
					//console.log(item);
					if(item.orderId == orderId){
						orderTotal = item.orderTotal;
					}
				});
				if(orderTotal>0){
					res.json({
						status:'0',
						msg:'',
						result:{
							orderId:orderId,
							orderTotal:orderTotal
						}
					})
				}else{
					res.json({
						status:"120002",
						msg:'无此订单',
						result:''
					})
				}
			}else{
				res.json({
					status:'120001',
					msg:'当前用户为创建订单',
					result:''
				})
			}
		}
	})
});

module.exports = router;

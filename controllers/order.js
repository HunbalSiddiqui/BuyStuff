//as we are not throwing single thing in order module so we have to change the systax here

const {Order,ProductCart} = require('../models/order')

//middlewares

exports.getOrderById = (req,res,next,id)=>{
    Order.findById(id)
    .populate("products.product","name price")
    .exec((err, order)=>{
        if(err)
        {
            return res.status(400)
            .json({error : "No order found."})
        }
        req.order = order
        next();
    })
}

//create
exports.createOrder = (req,res)=>{
    req.body.order.user = req.profile;
    var order = new Order(req.body.order);
    //as order is now a mongoose object
    order.save((err, order)=>{
        if(err)
        {
            return res.status(400)
            .json({error : "Failed to save your order"})
        }
        return res.json(order)
    })
}

//read
exports.getAllOrders = (req,res)=>{
    Order.find()
    .populate("user", "_id name")
    .exec((err,orders)=>{
        if(err)
        {
            return res.status(400)
            .json({error : "No orders found."})
        }
        return res.json(orders)
    })
}


//update
exports.getOrderStatus= (req,res)=>{
    res.json(Order.schema.path("status").enumValues)
}
exports.updateStatus= (req,res)=>{
    Order.update(
        //locate
        {_id : req.body.orderId},
        {$set : {status : req.body.status}},
        (err, updatedOrder)=>{
            if(err)
            { 
                return res.status(400)
                .json({error : "Order status updation failed."})
            }
            return res.json(order)
        }
    )
}
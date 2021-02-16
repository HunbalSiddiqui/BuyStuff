const stripe = require('stripe')("sk_test_51H6y5KGwlWi8pEAC8PM8Ezr7yAZIhafTD5oWNCCMK1VsrkdXKcwKCwfL5kR5Ww7vlyMxK3EIj09qAlBrB8d2Z1YB00EkHYUz99")
const { v1: uuidv1 } = require('uuid');


exports.makePayment = (req,res) =>{
    const {token, products} = req.body
    
    console.log("PRODUCTS " , products)

    var amount = 0;
    products.map((product)=>{
        amount = amount + product.price;
    })

    const idempotencyKey = uuidv1()

    return stripe.customers.create({
        email:token.email,
        source:token.id,
    })
    .then((customer)=>{
        stripe.charges.create({
            amount : amount*100,
            currency : 'usd',
            customer : customer.id,
            receipt_email : token.email,
            description : "a test account",
            shipping : {
                name : token.card.name,
                address : {
                    line1 : token.card.address_line1,
                    line2 : token.card.address_line2,
                    city : token.card.address_city,
                    country : token.card.address_country,
                    postal_code : "none"
                }
            }
        },{idempotencyKey})
        .then(result=>{
            return res.status(200).json(result)
        })
        .catch(err=>{
            return res.stauts(400).json({error:err})
        })
    })
}
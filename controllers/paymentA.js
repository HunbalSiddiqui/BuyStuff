var braintree = require('braintree')

var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   'wpp3trdb4bj7fyg7',
    publicKey:    'gndmcqnmng6vgsxp',
    privateKey:   '8821734b18007c2cc3090150b9ce02b0'
});


exports.processPayment = (req,res) =>{
    let nonceFromTheClient = req.body.paymentMethodNonce

    let amountFromTheClient = req.body.amount
      gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        // deviceData: deviceDataFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, function (err, result) {
          if(err)
          {
            return res.status(500)
            .send({error:err})
          }
          else{
            res.send(result)
          }
      });
}

exports.getToken = (req,res) => {
    gateway.clientToken.generate(
      {
        // customerId: aCustomerId
      }, function (err, response) {
        if(err)
        {
            console.log("error = "+err)
            return res.status(500)
            .send(err)
        }
        else{
            return res.send(response)
            // var clientToken = response.clientToken
        }
      });
}
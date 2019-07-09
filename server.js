	// server

var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var request = require("request");
var bodyParser = require('body-parser');


var router = express();
router.use(bodyParser.json());
var server = http.createServer(router);


router.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];



const config = require('./config');
const payLoadTemplate = require('./payload_template')
const products = require('./products');

const configuration = config.getConfig();
const createPaymentPayloadTemplates = payLoadTemplate.getCreatePaymentsPayloadTemplate();
const productsJson = products.getProductsTemplate()






function getAccessToken(cb) {
	
	var url = configuration.ACCESS_TOKEN_URL;
			console.log(configuration.CLIENT_ID+"======"+configuration.SECRET)

	var token  = configuration.CLIENT_ID+":"+configuration.SECRET,
	    encodedKey = new Buffer(token).toString('base64'),
	    payload = "grant_type=client_credentials&Content-Type=application%2Fx-www-form-urlencoded&response_type=token&return_authn_schemes=true",
	    headers = {
			'authorization': "Basic "+encodedKey,
			'accept': "application/json",
			'accept-language': "en_US",
			'cache-control': "no-cache",
			'content-type': "application/x-www-form-urlencoded",
			'PayPal-Partner-Attribution-Id' : configuration.BN_CODE
			}

			var options = { 
			  method: 'POST',
			  url: configuration.ACCESS_TOKEN_URL,
			  headers: {
							'authorization': "Basic "+encodedKey,
							'accept': "application/json",
							'accept-language': "en_US",
							'cache-control': "no-cache",
							'content-type': "application/x-www-form-urlencoded",
							'PayPal-Partner-Attribution-Id' : configuration.BN_CODE

						},
				body:payload
			}

			request(options, function (error, response, body) {
			  if (error) {
			  	throw new Error(error);
			  }
			  else{
			  	cb(body)
			  }
			});
		}

function buildCreatePaymentPayload(data) {
	var template = createPaymentPayloadTemplates;
		template.transactions[0].amount.total = data.total
		template.transactions[0].amount.currency = data.currency
		
		template.transactions[0].amount.details.subtotal = data.subtotal
		template.transactions[0].amount.details.shipping_discount = data.shipping_discount
		template.transactions[0].amount.details.insurance = data.insurance
		template.transactions[0].amount.details.shipping = data.shipping
		template.transactions[0].amount.details.tax = data.tax
		template.transactions[0].amount.details.handling_fee = data.handling_fee

		template.transactions[0].invoice_number = makeid();

		template.transactions[0].item_list.items[0].name = data.description	
		template.transactions[0].item_list.items[0].description = data.description	
		template.transactions[0].item_list.items[0].quantity = data.quantity	
		template.transactions[0].item_list.items[0].price = data.price	
		template.transactions[0].item_list.items[0].tax = data.tax	
		template.transactions[0].item_list.items[0].currency = data.currency

		template.redirect_urls.return_url = data.return_url
		template.redirect_urls.cancel_url = data.cancel_url

		if(data.webview != undefined && data.webview == "true") {
			template.redirect_urls.return_url = data.return_url+"?webview=true"
			template.redirect_urls.cancel_url = data.cancel_url+"?webview=true"
		}
		
		if(data.customFlag == "true") {
			template.transactions[0].item_list.shipping_address.recipient_name = data.recipient_name	
			template.transactions[0].item_list.shipping_address.line1 = data.line1
			template.transactions[0].item_list.shipping_address.line2 = data.line2
			template.transactions[0].item_list.shipping_address.city = data.city
			template.transactions[0].item_list.shipping_address.country_code = data.country_code
			template.transactions[0].item_list.shipping_address.postal_code = data.postal_code
			template.transactions[0].item_list.shipping_address.phone = data.phone
			template.transactions[0].item_list.shipping_address.state = data.state			
		}else {
			delete template.transactions[0].item_list['shipping_address'];
		}


	return template;

}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

router.get('/get-access-token', function(req,res,next){
	getAccessToken(function(d){
		var accessToken = JSON.parse(d).access_token;
		res.send(accessToken);
	})
})


router.get('/complete', function(req, res, next) {
  res.send('Thanks for your order');
});





router.post('/create-payments', function(req, res, next) {

	try{
		
	var payLoad = {
  "intent": "sale",
  "payer": {
    "payment_method": "paypal"
  },
  "transactions": [
    {
      "amount": {
        "total": "30.11",
        "currency": "USD",
        "details": {
          "subtotal": "30.00",
          "tax": "0.07",
          "shipping": "0.03",
          "handling_fee": "1.00",
          "shipping_discount": "-1.00",
          "insurance": "0.01"
        }
      },
      "description": "The payment transaction description.",
      "custom": "EBAY_EMS_90048630024435",
      "invoice_number": "48787589673",
      "payment_options": {
        "allowed_payment_method": "INSTANT_FUNDING_SOURCE"
      },
      "soft_descriptor": "ECHI5786786",
      "item_list": {
        "items": [
          {
            "name": "hat",
            "description": "Brown hat.",
            "quantity": "5",
            "price": "3",
            "tax": "0.01",
            "sku": "1",
            "currency": "USD"
          },
          {
            "name": "handbag",
            "description": "Black handbag.",
            "quantity": "1",
            "price": "15",
            "tax": "0.02",
            "sku": "product34",
            "currency": "USD"
          }
        ],
        "shipping_address": {
          "recipient_name": "Brian Robinson",
          "line1": "4th Floor",
          "line2": "Unit #34",
          "city": "San Jose",
          "country_code": "US",
          "postal_code": "95131",
          "phone": "011862212345678",
          "state": "CA"
        }
      }
    }
  ],
  "note_to_payer": "Contact us for any questions on your order.",
  "redirect_urls": {
    "return_url": "https://node-paypal-express-sever.herokuapp.com/complete",
    "cancel_url": "https://node-paypal-express-sever.herokuapp.com/complete"
  }
}

	 	console.log(payLoad);
	 	getAccessToken(function(data) {

			var accessToken = JSON.parse(data).access_token;
		
			var _dataToSend = {

			}
			
			var options = { 
			  method: 'POST',
			  url: configuration.CREATE_PAYMENT_URL,
			  headers : {
					'content-type': "application/json",
					'authorization': "Bearer "+accessToken,
					'cache-control': "no-cache",
					'PayPal-Partner-Attribution-Id' : configuration.BN_CODE,
					'PayPal-Client-Metadata-Id' : req.body.riskParingId
				},
				body: payLoad,
				json:true
				
			}
			
			request(options, function (error, response, body) {
			  if (error) {
			  	throw new Error(error);
			  }
			  else{
			  console.log(body);
			  	res.send(body);
			  }
			});
			
		});
	}catch(e) {
		console.log(e)
	}
});

router.get('/execute-payments', function(req, res, next) {

	try{
		console.log(req.query);
		var paymentId = req.query.paymentId;
		var payerId =  req.query.PayerID;
		

	 	var payLoad = req.body;
	 	getAccessToken(function(data) {

			var accessToken = JSON.parse(data).access_token;
			var _dataToSend = {
				"payer_id": payerId
			}
			var options = { 
			  method: 'POST',
			  url:  configuration.EXECUTE_PAYMENT_URL.replace('{payment_id}', paymentId),
			  headers : {
					'content-type': "application/json",
					'authorization': "Bearer "+accessToken,
					'cache-control': "no-cache",
					'PayPal-Partner-Attribution-Id' : configuration.BN_CODE
				},
				body: _dataToSend,
				json:true
				
			}
			
			request(options, function (error, response, body) {
			  console.log(body)
			  if (error) {
			  	throw new Error(error);
			  }
			  else{
			 
			  	if(body.state = 'approved') {
		  		    //custom check 
					var webview = req.query.webview;
					console.log("Inside success", "intent://scan/#Intent;scheme=qwerty;package=com.example.paypalcustomtabdemo")
					//res.redirect('/success.html?id='+body.id+"&payerId="+body.payer.payer_info.payer_id+"&status=success");
					res.writeHead(302, {'Location':"intent://scan/#Intent;scheme=qwerty;package=com.example.paypalcustomtabdemo;S.payerId="+body.payer.payer_info.payer_id+";S.token="+body.id+";S.status=success;end"});
                    //res.end();
			  	}else {
			  		//res.redirect('/error.html?id='+body.id+"&payerId="+body.payer.payer_info.payer_id+"&status=failure");
			  		res.writeHead(302, {'Location':"com.example.paypalcustomtabdemo:/error/"+body.id+"/"+body.payer.payer_info.payer_id });
                    //res.end();
                    
			  	}
			  	
			  }
			});
			
		});
	}catch(e) {
		console.log(e)
	}
});


router.post('/get-payment-details', function(req, res, next) {

	try{
		var token = req.query.token;
		var payerId = req.query.payerID;

	 	getAccessToken(function(data) {

			var accessToken = JSON.parse(data).access_token;
		
			var options = { 
			  method: 'GET',
			  url:  configuration.GET_PAYMENT_DETAILS.replace('{payment_id}', token),
			  headers : {
					'content-type': "application/json",
					'authorization': "Bearer "+accessToken,
					'cache-control': "no-cache",
					'PayPal-Partner-Attribution-Id' : configuration.BN_CODE
				}
				
			}
			
			request(options, function (error, response, body) {
			  if (error) {
			  	throw new Error(error);
			  }
			  else{
			  	res.send(body);
			  }
			});
			
		});
	}catch(e) {
		console.log(e)
	}
});


router.get('/get-products', function(req, res, next) {
	res.send(productsJson.products);
  	
});

router.get('/get-products', function(req, res, next) {
	res.send(productsJson.products);
  	
});



//////////////////////////PayPal EC Webview Sample Server Code //////////////////////////////////




server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Demo server listening at", addr.address + ":" + addr.port);
});

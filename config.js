var config = {
	"IS_APPLICATION_IN_SANDBOX" : false,

	"sandbox" : {
		"CLIENT_ID" :"AUz-VyDAwn-zRsTnh4JzeGJmN82sqKjzv3-GYPEN2wDsAG82v3AWvUWCTpaJE7XGTY7ZBhjyctyuz8ZP",
		"SECRET":"ED3HCvDcmz4KiXbm9JxVRVLLgLl--eivG5tmyJVaDj5i4sWzTneaFDWQf_rCU-Rty31JEkjH5_mzAVRQ",
		"ACCESS_TOKEN_URL":"https://api.sandbox.paypal.com/v1/oauth2/token",
		"CREATE_PAYMENT_URL":"https://api.sandbox.paypal.com/v1/payments/payment",
		"EXECUTE_PAYMENT_URL":"https://api.sandbox.paypal.com/v1/payments/payment/{payment_id}/execute/",
		"GET_PAYMENT_DETAILS":"https://api.sandbox.paypal.com/v1/payments/payment/{payment_id}",
		"CANCEL_URL":"https://node-paypal-express-sever.herokuapp.com/cancel-url",
		"RETURN_URL":"com.example.paypalcustomtabdemo://success",
		"BN_CODE":"PP-DemoPortal-EC-JSV4-python-REST"
	},

	"live" : {
		"CLIENT_ID" :"AUz-VyDAwn-zRsTnh4JzeGJmN82sqKjzv3-GYPEN2wDsAG82v3AWvUWCTpaJE7XGTY7ZBhjyctyuz8ZP",
		"SECRET":"ED3HCvDcmz4KiXbm9JxVRVLLgLl--eivG5tmyJVaDj5i4sWzTneaFDWQf_rCU-Rty31JEkjH5_mzAVRQ",
		"ACCESS_TOKEN_URL":"https://api.paypal.com/v1/oauth2/token",
		"CREATE_PAYMENT_URL":"https://api.paypal.com/v1/payments/payment",
		"EXECUTE_PAYMENT_URL":"https://api.paypal.com/v1/payments/payment/{payment_id}/execute/",
		"GET_PAYMENT_DETAILS":"https://api.paypal.com/v1/payments/payment/{payment_id}",
		"CANCEL_URL":"https://node-paypal-express-sever.herokuapp.com/cancel-url",
		"RETURN_URL":"com.example.paypalcustomtabdemo://success",
		"BN_CODE":"PP-DemoPortal-EC-JSV4-python-REST"
	}
}

exports.getConfig = function() {
	console.log(config.IS_APPLICATION_IN_SANDBOX)
	if(config.IS_APPLICATION_IN_SANDBOX)
		return config.sandbox
	else
		return config.live
}



exports.getCreatePaymentsPayloadTemplate = function() {
	return {
		  "intent": "sale",
		  "payer": {
		    "payment_method": "paypal"
		  },
		  "transactions": [
		    {
		      "amount": {
		        "total": "00.00",
		        "currency": "USD",
		        "details": {
		          "subtotal": "00.00",
		          "tax": "0.00",
		          "shipping": "0.00",
		          "handling_fee": "0.00",
		          "shipping_discount": "0.00",
		          "insurance": "0.00"
		        }
		      },
		      "description": "This is the payment transaction description.",
		      "custom": "SOME_CUSTOM_MESSAGING",
		      "invoice_number": "0000000",
		     
		      "item_list": {
		        "items": [
		          {
		            "name": "hat",
		            "description": "Brown color hat",
		            "quantity": "0",
		            "price": "0",
		            "tax": "0.00",
		            "sku": "1",
		            "currency": "USD"
		          }
		        ],
		        "shipping_address": {
		          "recipient_name": "Jhon",
		          "line1": "4thFloor",
		          "line2": "unit#34",
		          "city": "San Jose",
		          "country_code": "US",
		          "postal_code": "000000",
		          "phone": "0000000000000000",
		          "state": "CA"
		        }
		      }
		    }
		  ],
		  "note_to_payer": "Contact us for any questions on your order.",
		  "redirect_urls": {
		    "return_url": "http://www.somereturnurl.com",
		    "cancel_url": "http://www.somecancelurl.com"
		  }
		}
}
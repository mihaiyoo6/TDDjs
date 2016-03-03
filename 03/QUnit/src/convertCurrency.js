var convertINR = {
	currencyConversion: function(amount, conversionRate){
		return parseFloat(amount * conversionRate).toFixed(2);
	}
};
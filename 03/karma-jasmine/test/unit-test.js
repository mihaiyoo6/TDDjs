describe('Conversion Currency', function(){
	it('100 INR should be equal with $1.59',
	function(){
		expect(currencyConversion(100, 1/63)).toEqual('1.59');
	});
});
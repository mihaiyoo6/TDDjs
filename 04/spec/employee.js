describe('Jasmine Spy', function () {
	it('Spying employee', function () {
		var alice = new Employee('Alice', 4, 'Testing');
		spyOn(alice, 'calculateSalary');
		//expect(alice.calculateSalary).toHaveBeenCalled();
		expect(alice.calculateSalary).not.toHaveBeenCalledWith(5);
	});
});

describe('Spying employee with call through', function () {
	it('Spying employee', function () {
		var alice = new Employee('Alice', 4, 'Testing');

		spyOn(alice, 'calculateSalary').and.callThrough();

		var salary = alice.getSalary();

		expect(alice.calculateSalary).toHaveBeenCalled();
		console.log('Salary is ' + salary);
		expect(salary).toEqual(4000);
	});
});

describe('Spying employee with return value', function () {
	it('Spying employee with return value', function () {

		var alice = new Employee('Alice', 4, 'Testing');
		spyOn(alice, 'calculateSalary').and.returnValue(9999);
		alice.calculateSalary();
		expect(alice.calculateSalary()).toEqual(9999);
	});

	it('Spying employee with a fake call', function(){
		var alice = new Employee('Alice', 4, 'Testing');
		spyOn(alice, 'calculateSalary').and.callFake( function(grade){
			var salary = 1000;
			return salary*grade;
		});
		var salary  = alice.calculateSalary(10);
		expect(alice.calculateSalary).toHaveBeenCalled();
		expect(salary).toEqual(10000);
	});

	//it('Spying employee with thow error', function(){
	//	var alice = new Employee('Alice', 4, 'Testing');
	//	spyOn(alice, 'calculateSalary').and.throwError('Service is down.');
	//	expect(alice.calculateSalary).toThrowError('Service is down');
	//});

	it('Spying employee with cal through and stub', function(){
		var alice = new Employee('Alice', 14, 'Testing');
		spyOn(alice, 'calculateSalary').and.callThrough();
		var salary = alice.getSalary();
		console.log('Now callingg stub');
		alice.calculateSalary.and.stub();
		expect(salary).toEqual(14000);
	});

	it('Tracking spies with calls property', function(){
		var alice = new Employee('Alice', 4, 'Testing');
		spyOn(alice, 'calculateSalary').and.callThrough();
		var salary = alice.getSalary(); //cals calculateSalary only if salary is zero
		alice.calculateSalary.and.stub();
		salary = alice.getSalary();
		expect(salary).toEqual(4000);

		expect(alice.calculateSalary.calls.any()).toEqual(true);
		expect(alice.calculateSalary.calls.count()).toEqual(1);


		console.log(alice.calculateSalary.calls.argsFor(0)); //returns blank []
		expect(alice.calculateSalary.calls.argsFor(0)).toEqual([]);
		alice.calculateSalary(1000);

		console.log(alice.calculateSalary.calls.argsFor(1)); //returns array [1000]
		expect(alice.calculateSalary.calls.argsFor(1)).toEqual([1000]);

		console.log(alice.calculateSalary.calls.allArgs()); //returns [[],[1000]]
		expect(alice.calculateSalary.calls.allArgs()).toEqual([[],[1000]]);

		console.log(alice.calculateSalary.calls.all()); //returns all objects
		console.log(alice.calculateSalary.calls.mostRecent());
		console.log(alice.calculateSalary.calls.first());
		alice.calculateSalary.calls.reset();
		expect(alice.calculateSalary.calls.any()).toEqual(false);
	});
});

describe('Custom spy', function(){
	var alice;
	beforeEach(function(){
		alice = new Employee('Alice', 5, 'Testing');
		//creating a new spy for yet undefined
		alice.assignTask  = jasmine.createSpy('assignTask');
		alice.getName = jasmine.createSpy('getName').and.returnValue('Ms Alice');
	});

	it('Expect assignTask to be called', function(){
		alice.assignTask();
		expect(alice.assignTask.calls.any()).toEqual(true);
	});

	it('Expect assignTask to be called with arguments', function(){
		alice.assignTask('Test the login of application');
		expect(alice.assignTask.calls.argsFor(0)).toEqual(['Test the login of application']);
	});

	it('Expect name to be with title Mr or Ms', function(){
		console.log(alice.getName());
		expect(alice.getName()).toEqual('Ms Alice');
	});
});

describe('custom spy object', function(){
	var car;
	beforeEach(function(){
		car = jasmine.createSpyObj('car',['start', 'stop', 'openDoor']);
		car.start();
		car.stop();
		car.openDoor();
	});

	it('Expect car to be stopped', function(){
		expect(car.start).toHaveBeenCalled();
	});
});


describe('Jasmine clock', function(){
	var employee;
	beforeEach(function(){
		employee = new Employee('Alice', 5, 'Testeing');
		employee.checkAvailability = jasmine.createSpy();
		jasmine.clock().install();
	});
	afterEach(function(){
		jasmine.clock().uninstall();
	});

	it('Checks if alice is available after one hour', function(){
		//setting time out for an our
		setTimeout(function(){
			employee.checkAvailability();
		},60*60*100);

		expect(employee.checkAvailability).not.toHaveBeenCalled();

		jasmine.clock().tick(60*60*1000);
		expect(employee.checkAvailability).toHaveBeenCalled();
	});

	it('Checks if Alice is available for next 3 hours', function(){
		setInterval(function(){
			employee.checkAvailability();
		}, 60*60*1000);

		expect(employee.checkAvailability).not.toHaveBeenCalled();
		jasmine.clock().tick(60*60*1000+1);
		expect(employee.checkAvailability.calls.count()).toEqual(1);

		jasmine.clock().tick(60*60*1000+1);
		expect(employee.checkAvailability.calls.count()).toEqual(2);

		jasmine.clock().tick(60*60*1000+1);
		expect(employee.checkAvailability.calls.count()).toEqual(3);
	});

});
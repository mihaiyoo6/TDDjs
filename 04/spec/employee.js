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
		employee = new Employee('Alice', 5, 'Testing');
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

describe('Custom Matchers', function(){
	var customMatchers = {
		toBePresent: function( util, customEqualityTesters){
			return {
				compare: function(employee){
					var statusCode = employee.getAttendance();
					var result = {};
					result.pass = util.equals( statusCode, 1, customEqualityTesters);
					if(result.pass){
						result.message = 'Employee '+employee.getName() +' is present today';
					}else{
						result.message = "Eployee "+ employee.getName() + 'is absent today';
					}
					return result;
				}
			}
		}
	};
	beforeEach(function(){
		jasmine.addMatchers(customMatchers);
	});

	it('Expected employee to be present', function(){
		var alice = new Employee('Alice', 5, 'Testing');
		alice.markAttendance(1);
		console.log(alice);
		expect(alice).toBePresent();
	});
});

describe('Checking custom Employee equality tests', function(){
	var customEqualityTester = function(employee1, employee2){
		if( typeof employee1 !== typeof employee2){
			return false;
		}

		return (employee1.getEmail() === employee2.getEmail()) && (employee1.getName() === employee2.getName());
	}
	var employeeA, employeeB;
	beforeEach(function(){
		jasmine.addCustomEqualityTester(customEqualityTester);
		employeeA = new Employee('Alice', 5, 'Testing');
		employeeA.setEmail('alice@example.com');
		employeeB = new Employee('Alice', 4, 'Testing');
		employeeB.setEmail('alice@example.com');
	});

	it('should be equal', function(){
		expect(employeeA).toEqual(employeeB);
	});

	it('should not be equal', function(){
		var employeeC = new Employee('Bob', 3, 'Testing');
		employeeC.setEmail('bob@example.com');
		expect(employeeA).not.toEqual(employeeC);
	});
});

describe('Using mock-ajax for Asynchronous operations testing', function(){

	beforeEach(function(){
		jasmine.Ajax.install();
	});

	afterEach(function(){
		jasmine.Ajax.uninstall();
	});

	it('Checking weather report Ajax API', function(){
		var successFunction = jasmine.createSpy("success");
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(args) {
			if (this.readyState == this.DONE) {
				successFunction(this.responseText);
			}
		};

		xhr.open("GET", "/get/weather/IN-Mumbai");
		xhr.send();
		console.log(jasmine.Ajax.requests.mostRecent().url);

		expect(jasmine.Ajax.requests.mostRecent().url).toBe('/get/weather/IN-Mumbai');
		expect(successFunction).not.toHaveBeenCalled();
		jasmine.Ajax.requests.mostRecent().respondWith({
			'status': 200,
			'contentType': 'text/plain',
			'responseText': 'Temp 25 C, Sunlight'
		});

		expect(successFunction).toHaveBeenCalledWith('Temp 25 C, Sunlight');
	});
});


describe("Nested Suites - top suite", function(){
	var count = 0;
	beforeEach(function(){
		console.log("Count in top suite: "+count);
		count++;
	});
	afterEach(function(){
		console.log("Calling top afterEach");
	});
	it("Increases count", function(){
		console.log("Count : " +count);
		expect(true).toEqual(true);
	});
	describe("Nested Suites - Inner suite", function(){
		beforeEach(function(){
			console.log("Count in Inner suite: "+count);
			count++;
		});
		afterEach(function(){
			console.log("Calling inner afterEach");
		});
		it("Increases count", function(){
			console.log("Count : " +count);
			expect(true).toEqual(true);
		});
		describe("Nested Suites - inner most suite", function(){
			beforeEach(function(){
				console.log("Count in inner most suite: "+count);
				count++;
			});
			afterEach(function(){
				console.log("Calling inner most afterEach");
			});
			it("Increases count", function(){
				console.log("Count : " +count);
				expect(true).toEqual(true);
			});
		});
	});
});


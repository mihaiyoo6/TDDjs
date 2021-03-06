var DEFAULT_SALARY = 1000;
function Employee (name, grade, department, salary) {
	this.name = name;
	this.grade = grade;
	this.department = department;
	this.salary = salary || 0;
}

Employee.prototype.getName = function () {
	return this.name;
};

Employee.prototype.getDepartment = function () {
	return this.department;
};

Employee.prototype.getGrade = function (grade) {
	this.grade = grade;
	return this.grade;
};

Employee.prototype.getSalary = function () {
	if (this.salary === 0) {
		this.salary = this.calculateSalary();
	}
	return this.salary;
};

Employee.prototype.calculateSalary = function () {
	return this.grade * DEFAULT_SALARY;
};

Employee.prototype.getDetails = function () {
	return 'Employee Name: ' + this.getName() +
		'\nDepartment: ' + this.getDepartment() +
		'\nGrade: ' + this.getGrade() +
		'\nSalary: ' + this.getSalary();
};

Employee.prototype.markAttendance = function(status){
	this.attendanceStatus = status;
};

Employee.prototype.getAttendance = function(){
	return this.attendanceStatus;
};

Employee.prototype.setEmail = function(email){
	this.email = email;
};

Employee.prototype.getEmail = function(){
	return this.email;
};
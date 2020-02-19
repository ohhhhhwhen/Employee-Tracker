DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department (
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary INT NOT NULL,
    department_id INT NOT NULL,
    CONSTRAINT department_id FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
	CONSTRAINT role_id FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    manager_id INT NULL,
	CONSTRAINT manager_id FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

INSERT INTO department (name)
VALUES ('Engineering'),('Legal'),('Sales'),('Media'),('Human Resource');

INSERT INTO role (title, salary, department_id)
VALUES 
	('Lead Engineer', 1234567, 1),
    ('Software Engineer', 765432, 1),
    ('Legal Team Lead', 300000, 2),
    ('Lawyer', 80808, 2),
    ('Sales Lead', 224455, 3),
    ('Sales Rep', 32132, 3),
    ('Media Director', 45678, 4),
	('Media Reporter', 619169, 4),
    ('HR Director', 456654, 5),
    ('HR Associate', 44444, 5);
    
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
	('Philip',' Rivers', 1, NULL),
	('Billy',' Mays', 5, NULL),
	('Jill',' Myers', 9, NULL),
	('Mike',' Lowery', 3, NULL),
	('Bruce',' Alimighty', 7, NULL),
	('John',' Weller', 6, 2),
	('Alexis',' Smith', 2, 1),
    ('Gianna',' Sanchez', 4, 4),
	('Ron','Burgundy', 8, 5);
	
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employee
LEFT JOIN employee manager on manager.id = employee.manager_id
INNER JOIN role ON (role.id = employee.role_id)
INNER JOIN department ON (department.id = role.department_id)
ORDER BY department.name, employee.id;

SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name, role.salary
FROM employee
INNER JOIN role ON (role.id = employee.role_id)
INNER JOIN department ON (department.id = role.department_id)
ORDER BY department.name;

SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, employee.first_name, employee.last_name, role.title, employee.id, role.salary
FROM employee
LEFT JOIN employee manager on manager.id = employee.manager_id
INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
INNER JOIN department ON (department.id = role.department_id)
ORDER BY manager;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'track';
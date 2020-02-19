DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department (
	id INTEGER NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
	id INTEGER NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
	id INTEGER NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER NULL,
    PRIMARY KEY (id)
);

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary
FROM employee
INNER JOIN role ON (role.id = employee.role_id)
INNER JOIN department ON (department.id = role.department_id)
ORDER BY employee.id;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'track';

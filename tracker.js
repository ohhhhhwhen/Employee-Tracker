"use strict";

const mysql = require("mysql");
const inquirer = require("inquirer");

const promptMessages = {
  viewEmployees: "View All Employees",
  viewEmployeesByDep: "View All Employees By Department",
  viewEmployeesByMan: "View All Employees By Manager",
  addEmployee: "Add An Employee",
  removeEmployee: "Remove An Employee",
  updateEmployeeRole: "Update Employee Role",
  updateEmployeeMan: "Update Employee Manager",
  exit: "exit"
};

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "track",
  database: "employeeTracker_db"
});

// console.log('

// _      __    ____                  
// | | /| / /__ / / /______  __ _  ___ 
// | |/ |/ / -_) / / __/ _ \/  ' \/ -_)
// |__/|__/\__/_/_/\__/\___/_/_/_/\__/ 
// ')

connection.connect(err => {
  if (err) throw err;
  prompt();
});

function prompt() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        promptMessages.viewEmployees,
        promptMessages.viewEmployeesByDep,
        promptMessages.viewEmployeesByMan,
        promptMessages.addEmployee,
        promptMessages.removeEmployee,
        promptMessages.updateEmployeeRole,
        promptMessages.updateEmployeeMan,
        promptMessages.exit
      ]
    })
    .then(answer => {
      switch (answer.action) {
        case promptMessages.viewEmployees:
          viewAll();
          break;

        case promptMessages.viewEmployeesByDep:
          viewByDep();
          break;

        case promptMessages.viewEmployeesByMan:
          viewByMan();
          break;

        case promptMessages.addEmployee:
          addEmployee();
          break;

        case promptMessages.removeEmployee:
          removeEmployee();
          break;

        case promptMessages.updateEmployeeRole:
          updateEmployeeRol();
          break;

        case promptMessages.updateEmployeeMan:
          updateEmployeeMan();
          break;

        case promptMessages.exit:
          connection.end();
          break;
      }
    });
}

function viewAll() {
  const query = `
  SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary
  FROM employee
  INNER JOIN role ON (role.id = employee.role_id)
  INNER JOIN department ON (department.id = role.department_id)
  ORDER BY employee.id;
  `;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    prompt();
  });
}


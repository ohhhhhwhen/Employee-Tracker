"use strict";

const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

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

console.log(`

        ██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗    ████████╗ ██████╗     ████████╗██╗  ██╗███████╗         
        ██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝    ╚══██╔══╝██╔═══██╗    ╚══██╔══╝██║  ██║██╔════╝         
        ██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗         ██║   ██║   ██║       ██║   ███████║█████╗           
        ██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝         ██║   ██║   ██║       ██║   ██╔══██║██╔══╝           
        ╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗       ██║   ╚██████╔╝       ██║   ██║  ██║███████╗         
         ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝       ╚═╝    ╚═════╝        ╚═╝   ╚═╝  ╚═╝╚══════╝         
                                                                                                                          
███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗    ████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗ 
██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝    ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
█████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗         ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝
██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝         ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗       ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║
╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
                                                                                                                          
                                         
`);

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

        case promptMessages.exit:
          connection.end();
          break;
      }
    });
}
function queryTable(query) {
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    prompt();
  });
}
function viewAll() {
  const query = `
  SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employee
  LEFT JOIN employee manager on manager.id = employee.manager_id
  INNER JOIN role ON (role.id = employee.role_id)
  INNER JOIN department ON (department.id = role.department_id)
  ORDER BY department.name, employee.id;
  `;
  queryTable(query);
}

function viewByDep() {
  const query = `
  SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name, role.salary
  FROM employee
  INNER JOIN role ON (role.id = employee.role_id)
  INNER JOIN department ON (department.id = role.department_id)
  ORDER BY department.name;
  `;
  queryTable(query);
}

function viewByMan() {
  const query = `
  SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, employee.first_name, employee.last_name, role.title, employee.id, role.salary
  FROM employee
  LEFT JOIN employee manager on manager.id = employee.manager_id
  INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
  INNER JOIN department ON (department.id = role.department_id)
  ORDER BY manager;
  `;
  queryTable(query);
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "fName",
        type: "input",
        message: "Enter Their First Name"
      },
      {
        name: "lName",
        type: "input",
        message: "Enter Their Last Name"
      },
      {
        name: "position",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "Lead Engineer",
          "Software Engineer",
          "Legal Team Lead",
          "Lawyer",
          "Sales Lead",
          "Sales Rep",
          "Media Director",
          "Media Reporter",
          "HR Director",
          "HR Associate"
        ]
      }
    ])
    .then(newEmployee => {
      let addQuery;
      switch (`${newEmployee.position}`) {
        case "Lead Engineer":
          addingThem(newEmployee.fName, newEmployee.lName, 1, 1);
          prompt();
          break;
        case "Software Engineer":
          addingThem(newEmployee.fName, newEmployee.lName, 2, 1);
          prompt();
          break;
        case "Legal Team Lead":
          addingThem(newEmployee.fName, newEmployee.lName, 3, 4);
          prompt();
          break;
        case "Lawyer":
          addingThem(newEmployee.fName, newEmployee.lName, 4, 4);
          prompt();
          break;
        case "Sales Lead":
          addingThem(newEmployee.fName, newEmployee.lName, 5, 2);
          prompt();
          break;
        case "Sales Rep":
          addingThem(newEmployee.fName, newEmployee.lName, 6, 2);
          prompt();
          break;
        case "Media Director":
          addingThem(newEmployee.fName, newEmployee.lName, 7, 5);
          prompt();
          break;
        case "Media Reporter":
          addingThem(newEmployee.fName, newEmployee.lName, 8, 5);
          prompt();
          break;
        case "HR Director":
          addingThem(newEmployee.fName, newEmployee.lName, 9, 3);
          prompt();
          break;
        case "HR Associate":
          addingThem(newEmployee.fName, newEmployee.lName, 10, 3);
          prompt();
          break;
      }
    });
}

function addingThem(first, last, rI, mI) {
  let addQuery = `
  INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES (?, ?, ?, ?);
  `;
  connection.query(addQuery, [first, last, rI, mI], (err, res) => {
    if (err) throw err;
  });
}

function removeEmployee() {
  inquirer
    .prompt({
      name: "employeeID",
      type: "input",
      message: "Enter Their ID Of The Employee You Wish To Delete"
    })
    .then(removeThem => {
      let removeQuery = `
      DELETE FROM employee WHERE employee.id = ?
      `;
      connection.query(removeQuery, removeThem.employeeID, (err, res) => {
        if (err) throw err;
        prompt();
      });
    });
}

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
          artistSearch();
          break;

        case promptMessages.viewEmployeesByDep:
          multiSearch();
          break;

        case promptMessages.viewEmployeesByMan:
          rangeSearch();
          break;

        case promptMessages.addEmployee:
          songSearch();
          break;

        case promptMessages.removeEmployee:
          songSearch();
          break;

        case promptMessages.updateEmployeeRole:
          songSearch();
          break;

        case promptMessages.updateEmployeeMan:
          songSearch();
          break;

        case promptMessages.exit:
          connection.end();
          break;
      }
    });
}

function artistSearch() {
  const query = "SELECT position, song, year FROM top5000 WHERE ?";
  connection.query(query, { artist: answer.artist }, (err, res) => {
    if (err) throw err;
    printRows(res);
    prompt();
  });
}

function multiSearch() {
  const query =
    "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
  connection.query(query, (err, res) => {
    if (err) throw err;
    res.map(row => console.log(row.artist));
    prompt();
  });
}

function rangeSearch() {
  inquirer
    .prompt([
      {
        name: "start",
        type: "input",
        message: "Enter starting position: ",
        validate: value => !isNaN(value)
      },
      {
        name: "end",
        type: "input",
        message: "Enter ending position: ",
        validate: value => !isNaN(value)
      }
    ])
    .then(answer => {
      const query =
        "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
      connection.query(query, [answer.start, answer.end], (err, res) => {
        if (err) throw err;
        printRows(res);
        prompt();
      });
    });
}

function songSearch() {
  inquirer
    .prompt({
      name: "song",
      type: "input",
      message: "What song would you like to look for?"
    })
    .then(answer => {
      console.log(answer.song);
      connection.query(
        "SELECT * FROM top5000 WHERE ?",
        { song: answer.song },
        (err, res) => {
          if (err) throw err;
          printRow(res[0]);
          prompt();
        }
      );
    });
}

function printRows(rows) {
  for (let row of rows) {
    printRow(row);
  }
}

function printRow(row) {
  if (row) {
    let rowAsString = "";
    for (let key in row) {
      rowAsString += getPrintableColumn(row, key);
    }
    console.log(rowAsString);
  }
}

function getPrintableColumn(row, column) {
  return `${column}: ${row[column]} | `;
}

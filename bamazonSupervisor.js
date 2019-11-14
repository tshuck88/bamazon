const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require('cli-table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "tyler",
    database: "bamazonDB"
});

initializeSupervisor();

function initializeSupervisor() {
    inquirer.prompt([
        {
            name: "start",
            type: "list",
            choices: ["View Product Sales by Department", "Create New Department"],
            message: "What would you like to do?"
        }
    ]).then(function (answer) {
        switch (answer.start) {
            case "View Product Sales by Department":
                viewDepartments();
                break;
            case "Create New Department":
                addDepartment();
                break;
        }
    });
}
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

function viewDepartments() {
    const table = new Table({
        head: ['Department Id', 'Department Name', "Over Head Costs", "Product Sales ($)", "Total Profit ($)"],
        colWidths: [20, 20, 20, 20, 20]
    });
    connection.query("SELECT *, SUM(product_sales) AS total_product_sales, SUM(product_sales)  - over_head_costs AS total_profit  FROM products INNER JOIN departments USING(department_name) GROUP BY department_name;",
        function (err, results) {
            if (err) throw err;
            for (let i = 0; i < results.length; i++) {
                let department = results[i];
                table.push([department.department_id, department.department_name, department.over_head_costs, department.total_product_sales.toFixed(2), department.total_profit.toFixed(2)])
            }
            console.log(table.toString());
        });
}
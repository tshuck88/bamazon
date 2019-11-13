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

initializeManager();

function initializeManager() {
    inquirer.prompt([
        {
            name: "start",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            message: "What would you like to do?"
        }
    ]).then(function (answer) {
        switch (answer.start) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
        }
    });
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        var table = new Table({
            head: ['Product Id', 'Product Name', "Price ($)", "Stock Quantity"],
            colWidths: [13, 20, 13, 20]
        });
        for (let i = 0; i < results.length; i++) {
            let item = results[i];
            table.push([item.id, item.product_name, item.price.toFixed(2), item.stock_quantity])
        }
        console.log(table.toString());
        connection.end();
    });
}
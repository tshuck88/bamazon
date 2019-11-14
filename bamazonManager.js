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
                viewLowInventory();
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
        const table = new Table({
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

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, results) {
        if (err) throw err;
        const table = new Table({
            head: ['Product Id', 'Product Name', "Stock Quantity"],
            colWidths: [13, 20, 20]
        });
        for (let i = 0; i < results.length; i++) {
            let item = results[i];
            table.push([item.id, item.product_name, item.stock_quantity])
        }
        console.log(table.toString());
        connection.end();
    });
}

function addInventory() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "product",
                type: "input",
                message: "Enter the id of the product you would like to add more inventory to:"
            },
            {
                name: "amount",
                type: "input",
                message: "How many units of the product would you like to add?"
            }
        ]).then(function (answer) {
            let chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].id === parseInt(answer.product)) {
                    chosenItem = results[i];
                }
            }
            connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: chosenItem.stock_quantity + parseInt(answer.amount)
                    },
                    {
                        id: parseInt(answer.product)
                    }
                ], function (err, res) {
                    if (err) throw err;
                    console.log("\nAdded " + answer.amount + " units of inventory to " + chosenItem.product_name + "!\n");
                    connection.end(); 
                }

            );
        });

    });
}
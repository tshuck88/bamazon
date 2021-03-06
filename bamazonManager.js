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
                viewProducts(restart);
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

function viewProducts(callback) {
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
        callback();
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
        restart();
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
                    console.log("\nAdded " + answer.amount + " units of stock to " + chosenItem.product_name + "!\n");
                    restart();
                }
            );
        });
    });
}

function addProduct() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Name of the product you would like to add?"
        },
        {
            name: "department",
            type: "input",
            message: "What department is the product in?"
        },
        {
            name: "price",
            type: "input",
            message: "Price of the product?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many units of the product are you adding?"
        }
    ]).then(function (answer) {
        connection.query("INSERT INTO products SET ?",
            {
                product_name: answer.name,
                department_name: answer.department,
                price: parseFloat(answer.price),
                stock_quantity: parseInt(answer.quantity)
            }, function (err, res) {
                if (err) throw err;
                console.log("\nAdded " + answer.name + " to products!\n");
                restart();
            }
        );
    });
}

function restart() {
    inquirer.prompt([
        {
            name: "restart",
            type: "list",
            choices: ["Yes", "No"],
            message: "Do you want to do anything else?"
        }
    ]).then(function (answer) {
        if (answer.restart === "Yes") {
            initializeManager();
        } else {
            connection.end();
        }
    });
}
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

connection.connect(function (err) {
    if (err) throw err;
    initializeApp();

});

function initializeApp() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        var table = new Table({
            head: ['Product Id', 'Product Name', "Price ($)"],
            colWidths: [13, 20, 13]
        });
        for (let i = 0; i < results.length; i++) {
            let item = results[i];
            table.push([item.id, item.product_name, item.price.toFixed(2)])
        }
        console.log(table.toString());
        inquirer.prompt([
            {
                name: "product",
                type: "rawlist",
                choices: function () {
                    let choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].id);
                    }
                    return choiceArray;
                },
                message: "What product id would you like to buy?"
            },
            {
                name: "amount",
                type: "input",
                message: "How many would you like to buy?"
            }
        ]).then(function (answer) {
            let chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].id === parseInt(answer.product)) {
                    chosenItem = results[i];
                }
            }
            if (parseInt(answer.amount) < chosenItem.stock_quantity) {
                connection.query("UPDATE products SET ? WHERE ?",
                    [{
                        stock_quantity: chosenItem.stock_quantity - answer.amount
                    },
                    {
                        id: chosenItem.id
                    }], function (error) {
                        if (error) throw err;
                        console.log("\nYour total is $" + (answer.amount * chosenItem.price).toFixed(2) + ". Thank you for your purchase!\n");
                        restart();
                    });
            } else {
                console.log("\nSorry, there is not enough of that product in stock for your purchase. Please try again at a lower quantity.\n");
                restart();
            }
        })
    });
}

function restart() {
    inquirer.prompt([
        {
            name: "restart",
            type: "list",
            choices: ["Yes", "No"],
            message: "Do you want to buy something else?"
        }
    ]).then(function (answer) {
        if(answer.restart === "Yes"){
            initializeApp();
        } else {
            process.exit();
        }
    });
}
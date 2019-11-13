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
    displayItems();
});

function displayItems() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        var table = new Table({
            head: ['Product Id', 'Product Name', "Price ($)"]
            , colWidths: [13, 20, 13]
        });
        for (let i = 0; i < results.length; i++) {
            let item = results[i];
            table.push([item.id, item.product_name, item.price.toFixed(2)])
        }
        console.log(table.toString())
    });
}
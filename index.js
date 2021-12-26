const inquirer = require('inquirer');
const mysql2 = require("mysql2");
const consoleTable = require("console.table");

// Connect to database
const con = mysql2.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "Chr1stm@s2021",
      database: "tracker_db"
    },
    console.log("connected to tracker_db!")
  );

con.connect(function(err) {
    if (err) throw err;
    console.log("?")
})

// main menu
function mainMenu () {
    return inquirer
    .prompt([
    {
    type: "list",
    name: "mainMenu",
    message: "What would you like to do?",
    choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee",
    "Update an employee role"]
    }
    ])
    .then(function (answers) {
        if (answers.mainMenu === "View all departments") {
            let query = "select * from department"
            con.query(query, function(err, res) {
                if(err) return err;

                console.table(res);

                mainMenu()
            })
            // viewDepartments()
        }

        // view all roles

        // view all employees

        if (answers.mainMenu === "Add a department") {
            addDepartment()
        }
    })
}

function addDepartment () {
    // use inquirer for more prompts
    return inquirer
    .prompt([
    {
    type: "input",
    name: "addDepartment",
    message: "Enter Department Name:"
    }
    ])
    // pass answers as insert statments into table
    .then(function (answers) {
        let insertStatement = (`INSERT INTO department (name) VALUES ('${answers.addDepartment}')`)
        con.query(insertStatement, function(err, res) {
            if(err) return err;
            console.log("department added");
            // return to main menu
            mainMenu()
        })
    })
}

mainMenu();
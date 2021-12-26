const inquirer = require('inquirer');

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
            console.log("view all departments was chosen!")
            // viewDepartments()
        }
    })
}

mainMenu();
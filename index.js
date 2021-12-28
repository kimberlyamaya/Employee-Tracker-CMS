const inquirer = require('inquirer');
const mysql2 = require("mysql2");
const consoleTable = require("console.table");
const nodeBanner = require('node-banner');
const figlet = require('figlet');

// Connect to database
const con = mysql2.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "Chr1stm@s2021",
      database: "tracker_db"
    },
    //console.log("connected to tracker_db!")
);

// banner
figlet("Employee Tracker", function(err, data) {
    if (err) {
        console.log('Oops');
        return;
    }
    console.log(data)

    mainMenu()
})

// main menu
async function mainMenu () {
    const answers = await inquirer
        .prompt([
            {
                type: "list",
                name: "mainMenu",
                message: "What would you like to do?",
                choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee",
                    "Update an employee role"]
            }
        ]);
    // view all departments
    if (answers.mainMenu === "View all departments") {
        let query = "SELECT * FROM department ORDER BY 1";
        con.query(query, function (err, res) {
            if (err)
                return err;
            console.table(res);
            // return to main menu
            mainMenu();
        });
    }
    // view all roles
    if (answers.mainMenu === "View all roles") {
        let query_1 = "SELECT role.id, role.title, department.name AS department, role.salary FROM role, department WHERE role.department_id = department.id ORDER BY 1";
        con.query(query_1, function (err_1, res_1) {
            if (err_1)
                return err_1;
            console.table(res_1);
            // return to main menu
            mainMenu();
        });
    }
    // view all employees
    // add a department
    if (answers.mainMenu === "Add a department") {
        addDepartment();
    }
    // add a role
    if (answers.mainMenu === "Add a role") {
        addRole();
    }
    // add an employee
    // update an employee
    if (answers.mainMenu === "Update an employee role") {
        updateEmployeeRole();
    }
}

async function addDepartment () {
    // use inquirer for more prompts
    const answers = await inquirer
        .prompt([
            {
                type: "input",
                name: "addDepartment",
                message: "Enter Department Name:"
            }
        ]);
    let insertStatement = (`INSERT INTO department (name) VALUES ('${answers.addDepartment}')`);
    con.query(insertStatement, function (err,res) {
        if (err) return err;
        console.log("\n department added \n");
        // return to main menu
        mainMenu();
    });
}

function addRole() {
    // query
    let query = ("SELECT * FROM department ORDER BY 1")

    // connection
    con.query(query, function (err,res) {
        if (err) return err;

        // array that equals res
        let departmentArr = res

        // map it
        let departments = res.map(d => d.name)

        // inquirer
        return inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Enter name of Role:"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Enter Salary:"
                },
                {
                    type: "list",
                    name: "department",
                    message: "Select Department:",
                    choices: departments
                }
            ])
            .then(function (answers) {
                // get IDs of selected options

                let departmentID = ""

                for (i = 0; i < departmentArr.length; i++) {
                    if (departmentArr[i].name === answers.department) {
                        departmentID = departmentArr[i].id
                    }
                }  

                let insertRole = (`INSERT INTO role (title,salary,department_id) VALUES ('${answers.title}','${answers.salary}', ${departmentID})`);
                con.query(insertRole, function (err,res) {
                    if (err) return err;
                    console.log("\n role added \n");
                    // return to main menu
                    mainMenu();
                });

            })
    })

}

function updateEmployeeRole() {

    // queries
    let employeeQuery = "SELECT id, concat(first_name, ' ', last_name) AS name FROM employee ORDER BY 1"
    let roleQuery = "SELECT id, title FROM role ORDER BY 1"

    // create connections
    con.query(employeeQuery, function (err,res) {
        if (err) return err;
        
        let employeeArr = res

        //console.log(res)  // results: [ { id: 1, name: 'Tom Brenden' } ]

        let employees = res.map(e => e.name)

        con.query(roleQuery, function (err,res) {
            if (err) return err;

            let roleArr = res

            let roles = res.map(r => r.title)

            // inquirer questions with arrays plugged in
            return inquirer
            .prompt([
            {
            type: "list",
            name: "employee",
            message: "What employee would you like to update?",
            choices: employees
            },
            {
            type: "list",
            name: "role",
            message: "What is the new role?",
            choices: roles
            }
            ])
            .then(function (answers) {
                // get IDs of selected options

                let employeeID = ""

                for (i = 0; i < employeeArr.length; i++) {
                    if (employeeArr[i].name === answers.employee) {
                        employeeID = employeeArr[i].id
                    }
                    
                }

                let roleID = ""

                for (j = 0; j < roleArr.length; j++) {
                    if (roleArr[j].title === answers.role) {
                        roleID = roleArr[j].id
                    }
                    
                }
                // update statement
                // create connection for update statement
                let employeeUpdate = "UPDATE employee SET role_id = ? WHERE id = ?"
                con.query(employeeUpdate, [roleID, employeeID], function (err,res) {
                    if (err) return err;

                    // return to main menu
                    mainMenu();
                })
            })
        })       
    })
}
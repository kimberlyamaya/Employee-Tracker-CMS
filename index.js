const inquirer = require('inquirer');
const mysql2 = require("mysql2");
const consoleTable = require("console.table");
const figlet = require('figlet');

// Connect to database
const con = mysql2.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "Chr1stm@s2021",
      database: "tracker_db"
    },
);

// banner
figlet("Employee Tracker", function(err, data) {
    if (err)
        return err;
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
                choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee","Update an employee role"]
            }
        ]);
    // view all departments
    if (answers.mainMenu === "View all departments") {
        let departmentQuery = "SELECT * FROM department ORDER BY 1";
        con.query(departmentQuery, function (err, res) {
            if (err)
                return err;
            console.table(res);
            // return to main menu
            mainMenu();
        });
    }
    // view all roles
    if (answers.mainMenu === "View all roles") {
        let roleQuery = "SELECT role.id, role.title, department.name AS department, role.salary FROM role, department WHERE role.department_id = department.id ORDER BY 1";
        con.query(roleQuery, function (err, res) {
            if (err)
                return err;
            console.table(res);
            // return to main menu
            mainMenu();
        });
    }
    // view all employees
    if (answers.mainMenu === "View all employees") {
        // UPDATE SQL
        let employeeQuery = "SELECT * FROM employee";
        con.query(employeeQuery, function (err, res) {
            if (err)
                return err;
            console.table(res);
            // return to main menu
            mainMenu();
        });
    }
    // add a department
    if (answers.mainMenu === "Add a department") {
        addDepartment();
    }
    // add a role
    if (answers.mainMenu === "Add a role") {
        addRole();
    }
    // add an employee
    if (answers.mainMenu === "Add an employee") {
        addEmployee();
    }
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

function addEmployee() {
    // queries
    let roleQuery = ("SELECT id, title FROM role")
    let employeeQuery = ("SELECT id, concat(first_name, ' ', last_name) AS name, role_id, manager_id FROM employee")

    // connections
    con.query(roleQuery, function (err,res) {
        if (err) return err;

        // array that equals res
        let roleArr = res

        // map it
        let roles = res.map(r => r.title)
        
        con.query(employeeQuery, function(err,res) {
            if (err) return err;

            let employeeArr = res

            let employees = res.map(e => e.name)
            employees.push("None")        
   
            // inquirer
            return inquirer
                .prompt([
                    {
                        type: "input",
                        name: "first_name",
                        message: "Enter Employee's First Name:"
                    },
                    {
                        type: "input",
                        name: "last_name",
                        message: "Enter Employee's Last Name:"
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "Select Role:",
                        choices: roles
                    },
                    {
                        type: "list",
                        name: "manager",
                        message: "Select Manager:",
                        choices: employees
                    }
                ])
                .then(function (answers) {
                    // get IDs of selected options

                    let roleID = ""

                    for (i = 0; i < roleArr.length; i++) {
                        if (roleArr[i].title === answers.role) {
                            roleID = roleArr[i].id
                        }
                    }
                    
                    let employeeID = ""

                    for (j = 0; j < employeeArr.length; j++) {
                        if (employeeArr[j].name === answers.manager) {
                            employeeID = employeeArr[j].id
                        }
                    }  


                    // two seperate queries 

                    let addEmployeeWithManager = (`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('${answers.first_name}','${answers.last_name}', ${roleID}, ${employeeID})`);

                    let addEmployeeWithNull = (`INSERT INTO employee (first_name,last_name,role_id) VALUES ('${answers.first_name}','${answers.last_name}', ${roleID})`)

                    // if answers.manager = None then run a query

                    if (answers.manager === "None") {
                        con.query(addEmployeeWithNull, function (err,res) {
                            if (err) return err;
                            console.log("\n employee added \n");
    
                            // return to main menu
                            mainMenu();
                        });
                    }

                    // if answers.manager != None then run a query

                    if (answers.manager != "None") {
                        con.query(addEmployeeWithManager, function (err,res) {
                            if (err) return err;
                            console.log("\n employee added \n");
    
                            // return to main menu
                            mainMenu();
                        });
                    }
                    
            })

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

                    console.log("\n employee role updated \n");

                    // return to main menu
                    mainMenu();
                })
            })
        })       
    })
}
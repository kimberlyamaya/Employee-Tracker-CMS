INSERT INTO department
(name) 
VALUES 
("Finance"),
("Human Resources"),
("Information Technology"),
("Operations");

INSERT INTO role
(title, salary, department_id) 
VALUES 
("Cheif Financial Officer","160000", 1), 
("Accountant", "90000", 1),
("Director of HR", "140000", 2), 
("Payroll Assistant", "60000", 2),
("Director of IT", "140000", 3),
("Network Admin", "90000", 3),
("Systems Support", "70000", 3),
("Operations Manager", "140000", 4),
("Operations Assistant", "80000", 4);

INSERT INTO employee 
(first_name, last_name, role_id, manager_id) 
VALUES 
("Phoebe", "Miller", 1, null), 
("Jacqueline", "Martinez", 2, 1),
("Dary", "Brown", 3, null),
("Alyssa", "Garcia", 4, 3),
("Tom", "Williams", 5, null),
("Ray", "Johnson", 6, 5),
("Jarro", "Davis", 7, 5),
("Riza", "Rodriguez", 8, null),
("Nick", "Smith", 9, 8);

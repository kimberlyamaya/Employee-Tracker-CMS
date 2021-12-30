INSERT INTO department
(name) 
VALUES 
("Engineer"),
("Sales"),
("Accounting"),
("Human Resource");

INSERT INTO role
(title, salary, department_id) 
VALUES 
("Senior Software Engineer","200000", 1), 
("Junior Software Engineer", "100000", 1),
("Manager of Sales", "120000", 2), 
("Sales Lead", "80000", 2),
("Accountant", "100000", 3),
("Manager of HR", "130000", 4);

INSERT INTO employee 
(first_name, last_name, role_id, manager_id) 
VALUES 
("Tom", "Brenden", 3, null), 
("Kim", "Francisco", 1, null),
("Ana", "Green", 2, 2),
("Becca", "Smart", 4, 1),
("Khloe", "Sparks", 5, null),
("Sophia", "Shoey", 6, null);
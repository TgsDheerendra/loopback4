CREATE OR REPLACE VIEW EmployeeCustomers AS
SELECT e.id AS employeeId, e.name AS employeeName, c.id AS customerId, c.name AS customerName
FROM employee e
JOIN customeremployee ce ON e.id = ce.employeeId
JOIN customer c ON ce.customerId = c.id;

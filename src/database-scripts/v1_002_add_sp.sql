DROP PROCEDURE IF EXISTS GetCustomerEmployees;

CREATE PROCEDURE GetCustomerEmployees(IN customerId INT)
BEGIN
  SELECT e.id, e.name FROM employee e
  JOIN customeremployee ce ON e.id = ce.employeeId
  WHERE ce.customerId = customerId;
END;
